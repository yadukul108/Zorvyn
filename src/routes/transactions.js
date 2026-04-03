import express from 'express';
import TransactionController from '../controllers/transactionController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { transactionCreateSchema, transactionUpdateSchema, transactionQuerySchema, transactionIdSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', validate(transactionQuerySchema), TransactionController.listTransactions);
router.get('/:id', validate(transactionIdSchema), TransactionController.getTransaction);
router.post('/', validate(transactionCreateSchema), TransactionController.createTransaction);
router.put('/:id', validate(transactionUpdateSchema), TransactionController.updateTransaction);
router.delete('/:id', validate(transactionIdSchema), TransactionController.deleteTransaction);

export default router;