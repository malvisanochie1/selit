// import { Request, Response, NextFunction } from 'express';
// import { supabase } from '../config/supabaseClient.js';
// import { sendUnauthorized } from '../utils/apiResponse.js';

// // Extend Request interface to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         full_name: string | null;
//         avatar_url: string | null;
//       };
//     }
//   }
// }

// export const authenticateToken = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

//     if (!token) {
//       sendUnauthorized(res, 'Access token required');
//       return;
//     }

//     // Verify token with Supabase
//     const { data: { user }, error } = await supabase.auth.getUser(token);

//     if (error || !user) {
//       sendUnauthorized(res, 'Invalid or expired token');
//       return;
//     }

//     // Get user profile from database
//     const { data: profile, error: profileError } = await supabase
//       .from('users')
//       .select('id, email, full_name, avatar_url')
//       .eq('id', user.id)
//       .single();

//     if (profileError || !profile) {
//       sendUnauthorized(res, 'User profile not found');
//       return;
//     }

//     // Attach user to request
//     req.user = profile;
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
//     sendUnauthorized(res, 'Authentication failed');
//   }
// };

// export const optionalAuth = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//       next();
//       return;
//     }

//     // Verify token with Supabase
//     const { data: { user }, error } = await supabase.auth.getUser(token);

//     if (!error && user) {
//       // Get user profile from database
//       const { data: profile } = await supabase
//         .from('users')
//         .select('id, email, full_name, avatar_url')
//         .eq('id', user.id)
//         .single();

//       if (profile) {
//         req.user = profile;
//       }
//     }

//     next();
//   } catch (error) {
//     // Continue without authentication on error
//     next();
//   }
// };

// export const requireRole = (roles: string[]) => {
//   return (req: Request, res: Response, next: NextFunction): void => {
//     if (!req.user) {
//       sendUnauthorized(res, 'Authentication required');
//       return;
//     }

//     // For now, we'll implement basic role checking
//     // You can extend this based on your role system
//     if (roles.length > 0) {
//       // Add role checking logic here
//       // For example, check if user has admin role
//       next();
//     } else {
//       next();
//     }
//   };
// };
