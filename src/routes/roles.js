import express from 'express';
import RoleController from '../controllers/roleController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', RoleController.listRoles);
router.post('/', RoleController.createRole);

export default router;