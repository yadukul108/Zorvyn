import express from 'express';
import adminController from '../controllers/adminController.js';
import authMiddleware from '../middlewares/auth.js';
import rbacMiddleware from '../middlewares/rbac.js';
import { PERMISSIONS } from '../utils/constants.js';

const router = express.Router();

// All admin routes require authentication and admin permissions
router.use(authMiddleware);
router.use(rbacMiddleware.checkPermission(PERMISSIONS.USER_READ_ALL)); // Admin level access

// Mount admin controller routes
router.use('/', adminController);

export default router;