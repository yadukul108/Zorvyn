import express from 'express';
import TransactionController from '../controllers/transactionController.js';
import authMiddleware from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { transactionCreateSchema, transactionUpdateSchema, transactionQuerySchema, transactionIdSchema, dashboardSummarySchema, categoryAggregationSchema, monthlyTrendsSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', validate(transactionQuerySchema), TransactionController.listTransactions);
router.get('/:id', validate(transactionIdSchema), TransactionController.getTransaction);
router.post('/', validate(transactionCreateSchema), TransactionController.createTransaction);
router.put('/:id', validate(transactionUpdateSchema), TransactionController.updateTransaction);
router.delete('/:id', validate(transactionIdSchema), TransactionController.deleteTransaction);

// Analytics endpoints
router.get('/analytics/dashboard', validate(dashboardSummarySchema), TransactionController.getDashboardSummary);
router.get('/analytics/categories', validate(categoryAggregationSchema), TransactionController.getCategoryAggregation);
router.get('/analytics/trends/:year?', validate(monthlyTrendsSchema), TransactionController.getMonthlyTrends);

export default router;