import { supabase } from '../config/supabaseClient.ts';
import { type Listing, type CreateListingDto, type UpdateListingDto, type ListingFilters } from '../models/Listing.ts';
import { AppError } from '../middleware/error.middleware.ts';
import { API_MESSAGES, PAGINATION, LISTING_STATUS } from '../utils/constants.ts';

export class ListingService {
  // Get all listings with pagination and filters
  static async getListings(
    filters: ListingFilters = {},
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    try {
      const offset = (page - 1) * limit;
      let query = supabase
        .from('listings')
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `, { count: 'exact' });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data: listings, error, count } = await query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to fetch listings', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        listings: listings || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch listings', 500);
    }
  }

  // Get listing by ID
  static async getListingById(listingId: string) {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `)
        .eq('id', listingId)
        .single();

      if (error || !listing) {
        throw new AppError(API_MESSAGES.LISTING_NOT_FOUND, 404);
      }

      return listing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch listing', 500);
    }
  }

  // Create listing
  static async createListing(userId: string, listingData: CreateListingDto): Promise<Listing> {
    try {
      const { data: listing, error } = await supabase
        .from('listings')
        .insert({
          ...listingData,
          user_id: userId,
          images: listingData.images || [],
          status: listingData.status || LISTING_STATUS.ACTIVE,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !listing) {
        throw new AppError('Failed to create listing', 500);
      }

      return listing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create listing', 500);
    }
  }

  // Update listing
  static async updateListing(listingId: string, userId: string, updateData: UpdateListingDto): Promise<Listing> {
    try {
      // Check if listing exists and belongs to user
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

      if (fetchError || !existingListing) {
        throw new AppError(API_MESSAGES.LISTING_NOT_FOUND, 404);
      }

      if (existingListing.user_id !== userId) {
        throw new AppError('You can only update your own listings', 403);
      }

      const { data: listing, error } = await supabase
        .from('listings')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId)
        .select()
        .single();

      if (error || !listing) {
        throw new AppError('Failed to update listing', 500);
      }

      return listing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update listing', 500);
    }
  }

  // Delete listing
  static async deleteListing(listingId: string, userId: string): Promise<void> {
    try {
      // Check if listing exists and belongs to user
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

      if (fetchError || !existingListing) {
        throw new AppError(API_MESSAGES.LISTING_NOT_FOUND, 404);
      }

      if (existingListing.user_id !== userId) {
        throw new AppError('You can only delete your own listings', 403);
      }

      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        throw new AppError('Failed to delete listing', 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete listing', 500);
    }
  }

  // Get user's listings
  static async getUserListings(
    userId: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    try {
      const offset = (page - 1) * limit;

      const { data: listings, error, count } = await supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to fetch user listings', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        listings: listings || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch user listings', 500);
    }
  }

  // Search listings
  static async searchListings(
    searchQuery: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    try {
      const offset = (page - 1) * limit;

      const { data: listings, error, count } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `, { count: 'exact' })
        .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to search listings', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        listings: listings || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to search listings', 500);
    }
  }

  // Get listings by category
  static async getListingsByCategory(
    category: string,
    page: number = PAGINATION.DEFAULT_PAGE,
    limit: number = PAGINATION.DEFAULT_LIMIT
  ) {
    try {
      const offset = (page - 1) * limit;

      const { data: listings, error, count } = await supabase
        .from('listings')
        .select(`
          *,
          user:users(id, full_name, avatar_url)
        `, { count: 'exact' })
        .eq('category', category)
        .eq('status', LISTING_STATUS.ACTIVE)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to fetch category listings', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        listings: listings || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch category listings', 500);
    }
  }

  // Get categories
  static async getCategories() {
    try {
      const { data: categories, error } = await supabase
        .from('listings')
        .select('category')
        .eq('status', LISTING_STATUS.ACTIVE);

      if (error) {
        throw new AppError('Failed to fetch categories', 500);
      }

      // Get unique categories and count
      const categoryCounts = categories?.reduce((acc: any, listing) => {
        acc[listing.category] = (acc[listing.category] || 0) + 1;
        return acc;
      }, {});

      const uniqueCategories = Object.keys(categoryCounts || {}).map(category => ({
        name: category,
        count: categoryCounts[category],
      }));

      return uniqueCategories.sort((a, b) => b.count - a.count);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch categories', 500);
    }
  }

  // Update listing status
  static async updateListingStatus(listingId: string, userId: string, status: string): Promise<Listing> {
    try {
      // Check if listing exists and belongs to user
      const { data: existingListing, error: fetchError } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single();

      if (fetchError || !existingListing) {
        throw new AppError(API_MESSAGES.LISTING_NOT_FOUND, 404);
      }

      if (existingListing.user_id !== userId) {
        throw new AppError('You can only update your own listings', 403);
      }

      if (!Object.values(LISTING_STATUS).includes(status as any)) {
        throw new AppError('Invalid status', 400);
      }

      const { data: listing, error } = await supabase
        .from('listings')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId)
        .select()
        .single();

      if (error || !listing) {
        throw new AppError('Failed to update listing status', 500);
      }

      return listing;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update listing status', 500);
    }
  }
}
