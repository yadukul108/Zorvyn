import express from 'express';
import AuthController from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

// Protected routes
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;