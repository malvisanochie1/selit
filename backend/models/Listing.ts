// Listing interface based on Supabase schema
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  user_id: string;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Listing creation DTO
export interface CreateListingDto {
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images?: string[];
  status?: 'active' | 'sold' | 'inactive';
}

// Listing update DTO
export interface UpdateListingDto {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  location?: string;
  images?: string[];
  status?: 'active' | 'sold' | 'inactive';
}

// Listing response DTO
export interface ListingResponse {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  location: string;
  images: string[];
  user_id: string;
  status: 'active' | 'sold' | 'inactive';
  created_at: string;
  updated_at: string;
}

// Listing with user info
export interface ListingWithUser extends ListingResponse {
  user: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

// Listing query filters
export interface ListingFilters {
  category?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'sold' | 'inactive';
  userId?: string;
  search?: string;
}

// Validation functions (simple validation without Zod)
export const validateCreateListing = (data: any): CreateListingDto => {
  if (!data.title || typeof data.title !== 'string' || data.title.length < 1 || data.title.length > 200) {
    throw new Error('Title must be a string between 1 and 200 characters');
  }
  
  if (!data.description || typeof data.description !== 'string' || data.description.length < 10 || data.description.length > 2000) {
    throw new Error('Description must be a string between 10 and 2000 characters');
  }
  
  if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
    throw new Error('Price must be a positive number');
  }
  
  if (!data.category || typeof data.category !== 'string' || data.category.length < 1 || data.category.length > 100) {
    throw new Error('Category must be a string between 1 and 100 characters');
  }
  
  if (!data.location || typeof data.location !== 'string' || data.location.length < 1 || data.location.length > 200) {
    throw new Error('Location must be a string between 1 and 200 characters');
  }
  
  if (data.images && (!Array.isArray(data.images) || !data.images.every((img: any) => typeof img === 'string'))) {
    throw new Error('Images must be an array of strings');
  }
  
  if (data.status && !['active', 'sold', 'inactive'].includes(data.status)) {
    throw new Error('Status must be one of: active, sold, inactive');
  }
  
  return {
    title: data.title,
    description: data.description,
    price: data.price,
    category: data.category,
    location: data.location,
    images: data.images || [],
    status: data.status || 'active',
  };
};

export const validateUpdateListing = (data: any): UpdateListingDto => {
  const updateData: UpdateListingDto = {};
  
  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.length < 1 || data.title.length > 200) {
      throw new Error('Title must be a string between 1 and 200 characters');
    }
    updateData.title = data.title;
  }
  
  if (data.description !== undefined) {
    if (typeof data.description !== 'string' || data.description.length < 10 || data.description.length > 2000) {
      throw new Error('Description must be a string between 10 and 2000 characters');
    }
    updateData.description = data.description;
  }
  
  if (data.price !== undefined) {
    if (typeof data.price !== 'number' || data.price <= 0) {
      throw new Error('Price must be a positive number');
    }
    updateData.price = data.price;
  }
  
  if (data.category !== undefined) {
    if (typeof data.category !== 'string' || data.category.length < 1 || data.category.length > 100) {
      throw new Error('Category must be a string between 1 and 100 characters');
    }
    updateData.category = data.category;
  }
  
  if (data.location !== undefined) {
    if (typeof data.location !== 'string' || data.location.length < 1 || data.location.length > 200) {
      throw new Error('Location must be a string between 1 and 200 characters');
    }
    updateData.location = data.location;
  }
  
  if (data.images !== undefined) {
    if (!Array.isArray(data.images) || !data.images.every((img: any) => typeof img === 'string')) {
      throw new Error('Images must be an array of strings');
    }
    updateData.images = data.images;
  }
  
  if (data.status !== undefined) {
    if (!['active', 'sold', 'inactive'].includes(data.status)) {
      throw new Error('Status must be one of: active, sold, inactive');
    }
    updateData.status = data.status;
  }
  
  return updateData;
};
