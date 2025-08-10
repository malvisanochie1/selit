import { Router } from 'express';
// import { UserController } from '../controllers/user.controller.js';
// import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
// import { validate } from '../middleware/validate.middleware.js';
// import { validateCreateUser } from '../models/User.js';

const router = Router();

// // Public routes
// router.get('/search', UserController.searchUsers);

// // Protected routes
// router.get('/', authenticateToken, UserController.getUsers);
// router.get('/me', authenticateToken, UserController.getCurrentUserProfile);
// router.put('/me', authenticateToken, UserController.updateCurrentUserProfile);
// router.put('/avatar', authenticateToken, UserController.updateAvatar);

// // User-specific routes
// router.get('/:id', authenticateToken, UserController.getUserById);
// router.get('/:id/stats', authenticateToken, UserController.getUserStats);

// // Admin routes (optional)
// router.post('/', authenticateToken, requireRole(['admin']), validate(validateCreateUser), UserController.createUser);
// router.put('/:id', authenticateToken, requireRole(['admin']), UserController.updateUser);
// router.delete('/:id', authenticateToken, requireRole(['admin']), UserController.deleteUser);

export default router;
