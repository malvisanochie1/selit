# Backend API

A Node.js/Express backend API for the Selit application with TypeScript, Supabase, and comprehensive error handling.

## Features

- 🔐 **Authentication** - JWT-based authentication with Supabase
- 📝 **User Management** - Complete user CRUD operations
- 🏠 **Listing Management** - Full listing management with search and filters
- 🛡️ **Security** - Helmet, CORS, input validation
- 📊 **Logging** - Winston logger with file and console output
- 🔄 **Error Handling** - Centralized error handling with custom error classes
- 📱 **API Responses** - Standardized API response format
- 🧪 **TypeScript** - Full TypeScript support with type safety

## Project Structure

```
backend/
│   ├── config/
│   │   ├── supabaseClient.ts        # Supabase setup
│   │   ├── env.ts                   # Environment variables
│   │   └── logger.ts                # Logging setup (Winston)
│   │
│   ├── models/                      # Interfaces & DTOs
│   │   ├── User.ts
│   │   ├── Listing.ts
│   │   └── index.ts
│   │
│   ├── services/                    # Business logic
│   │   ├── auth.service.ts
│   │   ├── listing.service.ts
│   │   └── user.service.ts
│   │
│   ├── controllers/                 # Express route handlers
│   │   ├── auth.controller.ts
│   │   ├── listing.controller.ts
│   │   └── user.controller.ts
│   │
│   ├── routes/                      # Route definitions
│   │   ├── auth.routes.ts
│   │   ├── listing.routes.ts
│   │   └── user.routes.ts
│   │
│   ├── middleware/                  # Middlewares
│   │   ├── auth.middleware.ts       # Verify JWT (Supabase)
│   │   ├── error.middleware.ts      # Central error handler
│   │   └── validate.middleware.ts   # Input validation
│   │
│   ├── utils/                       # Helper functions
│   │   ├── apiResponse.ts
│   │   └── constants.ts
│   │
│   ├── app.ts                       # Express app setup
│   └── server.ts                    # Entry point
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3001
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:3000

   # Logging Configuration
   LOG_LEVEL=info
   ```

3. **Set up Supabase:**
   - Create a new Supabase project
   - Get your project URL and API keys
   - Create the following tables in your Supabase database:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     full_name VARCHAR(100),
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Listings table
   CREATE TABLE listings (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     title VARCHAR(200) NOT NULL,
     description TEXT NOT NULL,
     price DECIMAL(10,2) NOT NULL,
     category VARCHAR(100) NOT NULL,
     location VARCHAR(200) NOT NULL,
     images TEXT[] DEFAULT '{}',
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'sold', 'inactive')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

   -- Create indexes
   CREATE INDEX idx_listings_user_id ON listings(user_id);
   CREATE INDEX idx_listings_category ON listings(category);
   CREATE INDEX idx_listings_status ON listings(status);
   CREATE INDEX idx_listings_created_at ON listings(created_at);
   ```

## Scripts

- **Development:**
  ```bash
  npm run dev
  ```

- **Build:**
  ```bash
  npm run build
  ```

- **Production:**
  ```bash
  npm start
  ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/search` - Search users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `PUT /api/users/avatar` - Update user avatar

### Listings
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/search` - Search listings
- `GET /api/listings/categories` - Get all categories
- `GET /api/listings/featured` - Get featured listings
- `GET /api/listings/trending` - Get trending listings
- `GET /api/listings/category/:category` - Get listings by category
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create new listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `PUT /api/listings/:id/status` - Update listing status
- `GET /api/listings/user/:userId` - Get user's listings
- `GET /api/listings/me/listings` - Get current user's listings

## API Response Format

All API responses follow a standardized format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Validation

Input validation is handled using custom validation functions. All endpoints validate their input data before processing.

## Error Handling

The API includes comprehensive error handling:
- Custom `AppError` class for operational errors
- Centralized error handling middleware
- Proper HTTP status codes
- Detailed error logging

## Logging

Logging is handled by Winston with:
- Console output for development
- File output for production
- Different log levels (error, warn, info, debug)
- Request logging with Morgan

## Security Features

- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- JWT token verification
- Rate limiting (can be added)
- SQL injection protection (via Supabase)

## Development

### Adding New Endpoints

1. Create/update the model in `models/`
2. Add business logic in `services/`
3. Create controller in `controllers/`
4. Define routes in `routes/`
5. Add to main app in `app.ts`

### Environment Variables

All environment variables are validated on startup. Missing required variables will cause the application to fail to start.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure proper environment variables
3. Set up proper logging
4. Configure CORS for your domain
5. Set up monitoring and health checks

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Add appropriate logging
5. Update documentation

## License

This project is licensed under the ISC License.
