import { Router } from 'express';
// import { AuthController } from '../controllers/auth.controller.js';
// import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.ts';
import { validateLogin, validateCreateUser } from '../models/User.ts';

const router = Router();

// Public routes
// router.post('/register', validate(validateCreateUser), AuthController.register);
// router.post('/login', validate(validateLogin), AuthController.login);
// router.post('/logout', AuthController.logout);
// router.post('/refresh-token', AuthController.refreshToken);
// router.post('/reset-password', AuthController.resetPassword);

// Protected routes
// router.get('/me', authenticateToken, AuthController.getCurrentUser);
// router.put('/profile', authenticateToken, AuthController.updateProfile);
// router.put('/change-password', authenticateToken, AuthController.changePassword);

export default router;
