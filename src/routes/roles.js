import express from 'express';
import RoleController from '../controllers/roleController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { roleCreateSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', RoleController.listRoles);
router.post('/', validate(roleCreateSchema), RoleController.createRole);

export default router;