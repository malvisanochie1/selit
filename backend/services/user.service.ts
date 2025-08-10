import { supabase } from '../config/supabaseClient.ts';
import { type User, type CreateUserDto, type UpdateUserDto } from '../models/User.ts';
import { AppError } from '../middleware/error.middleware.ts';
import { API_MESSAGES, PAGINATION } from '../utils/constants.ts';

export class UserService {
  // Get all users with pagination
  static async getUsers(page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    try {
      const offset = (page - 1) * limit;

      const { data: users, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to fetch users', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        users: users || [],
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
      throw new AppError('Failed to fetch users', 500);
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AppError(API_MESSAGES.USER_NOT_FOUND, 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch user', 500);
    }
  }

  // Get user by email
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  // Create user
  static async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Check if user already exists
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new AppError(API_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
      }

      const { data: user, error } = await supabase
        .from('users')
        .insert({
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !user) {
        throw new AppError('Failed to create user', 500);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create user', 500);
    }
  }

  // Update user
  static async updateUser(userId: string, updateData: UpdateUserDto): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error || !user) {
        throw new AppError(API_MESSAGES.USER_NOT_FOUND, 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update user', 500);
    }
  }

  // Delete user
  static async deleteUser(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new AppError(API_MESSAGES.USER_NOT_FOUND, 404);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to delete user', 500);
    }
  }

  // Search users
  static async searchUsers(query: string, page: number = PAGINATION.DEFAULT_PAGE, limit: number = PAGINATION.DEFAULT_LIMIT) {
    try {
      const offset = (page - 1) * limit;

      const { data: users, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw new AppError('Failed to search users', 500);
      }

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        users: users || [],
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
      throw new AppError('Failed to search users', 500);
    }
  }

  // Get user statistics
  static async getUserStats(userId: string) {
    try {
      // Get user's listings count
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get user's active listings count
      const { count: activeListingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active');

      // Get user's sold listings count
      const { count: soldListingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'sold');

      return {
        totalListings: listingsCount || 0,
        activeListings: activeListingsCount || 0,
        soldListings: soldListingsCount || 0,
      };
    } catch (error) {
      throw new AppError('Failed to get user statistics', 500);
    }
  }

  // Update user avatar
  static async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error || !user) {
        throw new AppError(API_MESSAGES.USER_NOT_FOUND, 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update avatar', 500);
    }
  }
}
