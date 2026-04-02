import express from 'express';
import AuthController from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;