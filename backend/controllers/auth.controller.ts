// import { type Request, type Response } from 'express';
// import { AuthService } from '../services/auth.service.js';
// import { sendSuccess, sendError } from '../utils/apiResponse.js';
// import { validateLogin, validateCreateUser } from '../models/User.js';
// import { asyncHandler } from '../middleware/error.middleware.js';
// import { API_MESSAGES, HTTP_STATUS } from '../utils/constants.js';
// import type { RegisterDto } from '../models/User.js';

// export class AuthController {
//   // Register new user
//   static register = asyncHandler(async (req: Request, res: Response) => {
//     const userData = validateCreateUser(req.body);
//     const result = await AuthService.register(userData as RegisterDto);
    
//     sendSuccess(res, {
//       user: result.user,
//       session: result.session,
//     }, API_MESSAGES.CREATED, HTTP_STATUS.CREATED);
//   });

//   // Login user
//   static login = asyncHandler(async (req: Request, res: Response) => {
//     const credentials = validateLogin(req.body);
//     const result = await AuthService.login(credentials);
    
//     sendSuccess(res, {
//       user: result.user,
//       session: result.session,
//     }, API_MESSAGES.SUCCESS);
//   });

//   // Logout user
//   static logout = asyncHandler(async (req: Request, res: Response) => {
//     await AuthService.logout();
//     sendSuccess(res, null, 'Logged out successfully');
//   });

//   // Refresh token
//   static refreshToken = asyncHandler(async (req: Request, res: Response) => {
//     const { refreshToken } = req.body;
    
//     if (!refreshToken) {
//       sendError(res, 'Refresh token is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const result = await AuthService.refreshToken(refreshToken);
//     sendSuccess(res, result, 'Token refreshed successfully');
//   });

//   // Get current user
//   static getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const user = await AuthService.getCurrentUser(req.user.id);
//     sendSuccess(res, user);
//   });

//   // Update profile
//   static updateProfile = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const updatedUser = await AuthService.updateProfile(req.user.id, req.body);
//     sendSuccess(res, updatedUser, API_MESSAGES.UPDATED);
//   });

//   // Reset password
//   static resetPassword = asyncHandler(async (req: Request, res: Response) => {
//     const { email } = req.body;
    
//     if (!email) {
//       sendError(res, 'Email is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     await AuthService.resetPassword(email);
//     sendSuccess(res, null, 'Password reset email sent');
//   });

//   // Change password
//   static changePassword = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const { currentPassword, newPassword } = req.body;
    
//     if (!currentPassword || !newPassword) {
//       sendError(res, 'Current password and new password are required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     // Verify current password first
//     try {
//       await AuthService.login({ email: req.user.email, password: currentPassword });
//     } catch (error) {
//       sendError(res, 'Current password is incorrect', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     await AuthService.changePassword(req.user.id, newPassword);
//     sendSuccess(res, null, 'Password changed successfully');
//   });
// }
