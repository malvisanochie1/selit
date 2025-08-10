// User interface based on Supabase schema
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// User creation DTO
export interface CreateUserDto {
  email: string;
  full_name?: string;
  avatar_url?: string;
}

// User update DTO
export interface UpdateUserDto {
  full_name?: string;
  avatar_url?: string;
}

// User response DTO (without sensitive data)
export interface UserResponse {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Login DTO
export interface LoginDto {
  email: string;
  password: string;
}

// Register DTO
export interface RegisterDto {
  email: string;
  password: string;
  full_name?: string;
}

// Validation functions (simple validation without Zod)
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateCreateUser = (data: any): CreateUserDto => {
  if (!data.email || !validateEmail(data.email)) {
    throw new Error('Valid email is required');
  }
  
  if (data.full_name && typeof data.full_name !== 'string') {
    throw new Error('Full name must be a string');
  }
  
  if (data.avatar_url && typeof data.avatar_url !== 'string') {
    throw new Error('Avatar URL must be a string');
  }
  
  return {
    email: data.email,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
  };
};

export const validateLogin = (data: any): LoginDto => {
  if (!data.email || !validateEmail(data.email)) {
    throw new Error('Valid email is required');
  }
  
  if (!data.password || !validatePassword(data.password)) {
    throw new Error('Password must be at least 6 characters');
  }
  
  return {
    email: data.email,
    password: data.password,
  };
}; 