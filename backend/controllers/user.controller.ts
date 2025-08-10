// import { Request, Response } from 'express';
// import { UserService } from '../services/user.service.js';
// import { sendSuccess, sendError } from '../utils/apiResponse.js';
// import { validateId, validatePagination } from '../middleware/validate.middleware.js';
// import { asyncHandler } from '../middleware/error.middleware.js';
// import { API_MESSAGES, HTTP_STATUS } from '../utils/constants.js';

// export class UserController {
//   // Get all users
//   static getUsers = asyncHandler(async (req: Request, res: Response) => {
//     const { page, limit } = validatePagination(req.query);
//     const result = await UserService.getUsers(page, limit);
    
//     sendSuccess(res, result);
//   });

//   // Get user by ID
//   static getUserById = asyncHandler(async (req: Request, res: Response) => {
//     const userId = validateId(req.params.id);
//     const user = await UserService.getUserById(userId);
    
//     sendSuccess(res, user);
//   });

//   // Create user
//   static createUser = asyncHandler(async (req: Request, res: Response) => {
//     const user = await UserService.createUser(req.body);
//     sendSuccess(res, user, API_MESSAGES.CREATED, HTTP_STATUS.CREATED);
//   });

//   // Update user
//   static updateUser = asyncHandler(async (req: Request, res: Response) => {
//     const userId = validateId(req.params.id);
//     const user = await UserService.updateUser(userId, req.body);
    
//     sendSuccess(res, user, API_MESSAGES.UPDATED);
//   });

//   // Delete user
//   static deleteUser = asyncHandler(async (req: Request, res: Response) => {
//     const userId = validateId(req.params.id);
//     await UserService.deleteUser(userId);
    
//     sendSuccess(res, null, API_MESSAGES.DELETED);
//   });

//   // Search users
//   static searchUsers = asyncHandler(async (req: Request, res: Response) => {
//     const { q: query, page, limit } = req.query;
    
//     if (!query || typeof query !== 'string') {
//       sendError(res, 'Search query is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const { page: pageNum, limit: limitNum } = validatePagination({ page, limit });
//     const result = await UserService.searchUsers(query, pageNum, limitNum);
    
//     sendSuccess(res, result);
//   });

//   // Get user statistics
//   static getUserStats = asyncHandler(async (req: Request, res: Response) => {
//     const userId = validateId(req.params.id);
//     const stats = await UserService.getUserStats(userId);
    
//     sendSuccess(res, stats);
//   });

//   // Update user avatar
//   static updateAvatar = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const { avatarUrl } = req.body;
    
//     if (!avatarUrl || typeof avatarUrl !== 'string') {
//       sendError(res, 'Avatar URL is required', HTTP_STATUS.BAD_REQUEST);
//       return;
//     }

//     const user = await UserService.updateAvatar(req.user.id, avatarUrl);
//     sendSuccess(res, user, 'Avatar updated successfully');
//   });

//   // Get current user profile
//   static getCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const user = await UserService.getUserById(req.user.id);
//     sendSuccess(res, user);
//   });

//   // Update current user profile
//   static updateCurrentUserProfile = asyncHandler(async (req: Request, res: Response) => {
//     if (!req.user) {
//       sendError(res, API_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
//       return;
//     }

//     const user = await UserService.updateUser(req.user.id, req.body);
//     sendSuccess(res, user, API_MESSAGES.UPDATED);
//   });
// }
