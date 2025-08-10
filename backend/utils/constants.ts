// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Success',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation failed',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  LISTING_NOT_FOUND: 'Listing not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid or expired token',
} as const;

// Listing Status
export const LISTING_STATUS = {
  ACTIVE: 'active',
  SOLD: 'sold',
  INACTIVE: 'inactive',
} as const;

// File Upload Constants
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_LISTING: 10,
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// JWT Constants
export const JWT_CONSTANTS = {
  DEFAULT_EXPIRES_IN: '7d',
  REFRESH_EXPIRES_IN: '30d',
} as const;

// Database Constants
export const DB_CONSTANTS = {
  TABLES: {
    USERS: 'users',
    LISTINGS: 'listings',
  },
} as const;

// Validation Constants
export const VALIDATION = {
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 100,
  TITLE_MIN_LENGTH: 1,
  TITLE_MAX_LENGTH: 200,
  DESCRIPTION_MIN_LENGTH: 10,
  DESCRIPTION_MAX_LENGTH: 2000,
  CATEGORY_MIN_LENGTH: 1,
  CATEGORY_MAX_LENGTH: 100,
  LOCATION_MIN_LENGTH: 1,
  LOCATION_MAX_LENGTH: 200,
  PRICE_MIN: 0,
  PRICE_MAX: 999999999,
} as const;
