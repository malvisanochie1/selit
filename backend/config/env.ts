import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment configuration
export const env = {
  PORT: process.env.PORT || '5001',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  DATABASE_URL: process.env.DATABASE_URL,
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '5242880',
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY'];

for (const envVar of requiredEnvVars) {
  if (!env[envVar as keyof typeof env]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
}

// Helper function to get environment variable
export const getEnvVar = (key: keyof typeof env): string => {
  const value = env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}; 