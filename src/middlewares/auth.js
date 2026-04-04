import jwt from 'jsonwebtoken';
import AuthService from '../services/authService.js';
import { JWT_CONFIG, USER_STATUS } from '../utils/constants.js';
import { AuthenticationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      throw new AuthenticationError('Access denied. No token provided.');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Invalid token format. Use Bearer token.');
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new AuthenticationError('Access denied. No token provided.');
    }

    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    const user = await AuthService.getUserById(decoded.userId);

    if (!user) {
      throw new AuthenticationError('Invalid token. User not found.');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
      throw new AuthenticationError('Account is not active.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;

    logger.debug('User authenticated', {
      userId: user._id,
      email: user.email,
      role: user.role?.name,
    });

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    }

    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired.',
      });
    }

    logger.error('Authentication middleware error', { error: error.message });
    return res.status(500).json({
      success: false,
      error: 'Authentication failed.',
    });
  }
};

export default authMiddleware;