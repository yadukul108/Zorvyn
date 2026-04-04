import TransactionService from '../services/transactionService.js';
import RBACService from '../services/rbacService.js';

class TransactionController {
  async listTransactions(req, res) {
    try {
      const canAccessAll = await RBACService.canReadAllTransactions(req.user);
      const filters = {
        userId: req.user._id,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        category: req.query.category,
        type: req.query.type,
        canAccessAll
      };

      const result = await TransactionService.getTransactions(filters);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransaction(req, res) {
    try {
      const canAccessAll = await RBACService.canReadAllTransactions(req.user);
      const transaction = await TransactionService.getTransactionById(req.params.id, req.user._id, canAccessAll);
      res.json({ transaction });
    } catch (error) {
      if (error.message === 'Transaction not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized access') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async createTransaction(req, res) {
    try {
      const transaction = await TransactionService.createTransaction(req.user._id, req.body);
      res.status(201).json({ message: 'Transaction created', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTransaction(req, res) {
    try {
      const canAccessAll = await RBACService.canUpdateAllTransactions(req.user);
      const transaction = await TransactionService.updateTransaction(req.params.id, req.user._id, req.body, canAccessAll);
      res.json({ message: 'Transaction updated', transaction });
    } catch (error) {
      if (error.message === 'Transaction not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized access') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTransaction(req, res) {
    try {
      const canAccessAll = await RBACService.canDeleteAllTransactions(req.user);
      await TransactionService.deleteTransaction(req.params.id, req.user._id, canAccessAll);
      res.json({ message: 'Transaction deleted' });
    } catch (error) {
      if (error.message === 'Transaction not found') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'Unauthorized access') {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
  async restoreTransaction(req, res) {
    try {
      const canAccessAll = await RBACService.canUpdateAllTransactions(req.user);
      const transaction = await TransactionService.restoreTransaction(req.params.id, req.user._id, canAccessAll);
      res.json({ message: 'Transaction restored successfully', transaction });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDeletedTransactions(req, res) {
    try {
      const canAccessAll = await RBACService.canReadAllTransactions(req.user);
      const transactions = await TransactionService.getDeletedTransactions(req.user._id, canAccessAll);
      res.json({ transactions });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  async getDashboardSummary(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;
      const summary = await TransactionService.getDashboardSummary(req.user._id, dateFrom, dateTo);
      res.json(summary);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCategoryAggregation(req, res) {
    try {
      const { dateFrom, dateTo } = req.query;
      const aggregation = await TransactionService.getCategoryAggregation(req.user._id, dateFrom, dateTo);
      res.json(aggregation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMonthlyTrends(req, res) {
    try {
      const year = req.params.year || new Date().getFullYear();
      const trends = await TransactionService.getMonthlyTrends(req.user._id, parseInt(year));
      res.json(trends);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TransactionController();