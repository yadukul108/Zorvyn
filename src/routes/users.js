import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', UserController.listUsers);
router.get('/:id', UserController.getUser);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.patch('/:id/role', UserController.assignRole);
router.patch('/:id/status', UserController.updateStatus);

export default router;