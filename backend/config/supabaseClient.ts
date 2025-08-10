import { createClient } from '@supabase/supabase-js';
import { env } from './env.ts';

// Create Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Create Supabase admin client for server-side operations
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database types (you can generate these from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
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
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price: number;
          category: string;
          location: string;
          images?: string[];
          user_id: string;
          status?: 'active' | 'sold' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number;
          category?: string;
          location?: string;
          images?: string[];
          user_id?: string;
          status?: 'active' | 'sold' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Typed Supabase client
export const typedSupabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
export const typedSupabaseAdmin = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY); 