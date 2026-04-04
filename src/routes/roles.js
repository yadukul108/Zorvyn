import express from 'express';
import RoleController from '../controllers/roleController.js';
import authMiddleware from '../middlewares/auth.js';
import rbacMiddleware from '../middlewares/rbac.js';
import validate from '../middlewares/validate.js';
import { roleCreateSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       403:
 *         description: Forbidden
 */
router.get('/', rbacMiddleware.canReadRoles, RoleController.listRoles);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [Viewer, Analyst, Admin]
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 */
router.post('/', validate(roleCreateSchema), rbacMiddleware.canCreateRole, RoleController.createRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 enum: [Viewer, Analyst, Admin]
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.put('/:id', rbacMiddleware.canCreateRole, RoleController.updateRole);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Soft delete role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.delete('/:id', rbacMiddleware.canCreateRole, RoleController.deleteRole);

/**
 * @swagger
 * /api/roles/{id}/restore:
 *   patch:
 *     summary: Restore soft deleted role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role restored successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.patch('/:id/restore', rbacMiddleware.canCreateRole, RoleController.restoreRole);

/**
 * @swagger
 * /api/roles/deleted:
 *   get:
 *     summary: Get all soft deleted roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Role'
 *       403:
 *         description: Forbidden
 */
router.get('/deleted', rbacMiddleware.canReadRoles, RoleController.getDeletedRoles);

export default router;