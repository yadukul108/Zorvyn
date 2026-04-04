import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';
import rbacMiddleware from '../middlewares/rbac.js';
import validate from '../middlewares/validate.js';
import { userCreateSchema, userUpdateSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', rbacMiddleware.canReadAllUsers, UserController.listUsers);
router.get('/:id', UserController.getUser);
router.post('/', validate(userCreateSchema), rbacMiddleware.canCreateUser, UserController.createUser);
router.put('/:id', validate(userUpdateSchema), UserController.updateUser);
router.delete('/:id', rbacMiddleware.canDeleteUser, UserController.deleteUser);
router.patch('/:id/role', rbacMiddleware.canAssignRole, UserController.assignRole);
router.patch('/:id/status', rbacMiddleware.canUpdateUserStatus, UserController.updateStatus);

export default router;