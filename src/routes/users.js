import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { userCreateSchema, userUpdateSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', UserController.listUsers);
router.get('/:id', UserController.getUser);
router.post('/', validate(userCreateSchema), UserController.createUser);
router.put('/:id', validate(userUpdateSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id/role', UserController.assignRole);
router.patch('/:id/status', UserController.updateStatus);

export default router;