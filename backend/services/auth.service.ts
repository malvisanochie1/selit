import { supabase, supabaseAdmin } from '../config/supabaseClient.ts';
import { type User, type CreateUserDto, type LoginDto, type RegisterDto } from '../models/User.ts';
import { AppError } from '../middleware/error.middleware.ts';
import { API_MESSAGES } from '../utils/constants.ts';

export class AuthService {
  // Register a new user
  static async register(userData: RegisterDto): Promise<{ user: User; session: any }> {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new AppError(API_MESSAGES.EMAIL_ALREADY_EXISTS, 409);
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError || !authData.user) {
        throw new AppError(authError?.message || 'Failed to create user', 400);
      }

      // Create user profile in database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name || null,
        })
        .select()
        .single();

      if (profileError || !profile) {
        // Clean up auth user if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new AppError('Failed to create user profile', 500);
      }

      return {
        user: profile,
        session: authData.session,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Registration failed', 500);
    }
  }

  // Login user
  static async login(credentials: LoginDto): Promise<{ user: User; session: any }> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error || !data.user) {
        throw new AppError(API_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        throw new AppError(API_MESSAGES.USER_NOT_FOUND, 404);
      }

      return {
        user: profile,
        session: data.session,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Login failed', 500);
    }
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new AppError('Logout failed', 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Logout failed', 500);
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ session: any }> {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        throw new AppError(API_MESSAGES.INVALID_TOKEN, 401);
      }

      return { session: data.session };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Token refresh failed', 500);
    }
  }

  // Get current user
  static async getCurrentUser(userId: string): Promise<User> {
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
      throw new AppError('Failed to get user', 500);
    }
  }

  // Update user profile
  static async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
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
        throw new AppError('Failed to update profile', 500);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update profile', 500);
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
      });

      if (error) {
        throw new AppError('Failed to send reset email', 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to send reset email', 500);
    }
  }

  // Change password
  static async changePassword(userId: string, newPassword: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        throw new AppError('Failed to change password', 500);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to change password', 500);
    }
  }
}
