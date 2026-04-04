import express from 'express';
import TransactionController from '../controllers/transactionController.js';
import authMiddleware from '../middlewares/auth.js';
import rbacMiddleware from '../middlewares/rbac.js';
import validate from '../middlewares/validate.js';
import { transactionCreateSchema, transactionUpdateSchema, transactionQuerySchema, transactionIdSchema, dashboardSummarySchema, categoryAggregationSchema, monthlyTrendsSchema } from '../validators/schemas.js';

const router = express.Router();

router.use(authMiddleware);

// Transaction CRUD endpoints
router.get('/', validate(transactionQuerySchema), TransactionController.listTransactions);
router.get('/analytics/dashboard', validate(dashboardSummarySchema), rbacMiddleware.canAccessAnalytics, TransactionController.getDashboardSummary);
router.get('/analytics/categories', validate(categoryAggregationSchema), rbacMiddleware.canAccessAnalytics, TransactionController.getCategoryAggregation);
router.get('/analytics/trends/:year?', validate(monthlyTrendsSchema), rbacMiddleware.canAccessAnalytics, TransactionController.getMonthlyTrends);
router.get('/:id', validate(transactionIdSchema), TransactionController.getTransaction);
router.post('/', validate(transactionCreateSchema), rbacMiddleware.canCreateTransaction, TransactionController.createTransaction);
router.put('/:id', validate(transactionUpdateSchema), TransactionController.updateTransaction);
router.delete('/:id', validate(transactionIdSchema), TransactionController.deleteTransaction);

export default router;