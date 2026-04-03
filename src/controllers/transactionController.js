import TransactionService from '../services/transactionService.js';

class TransactionController {
  async listTransactions(req, res) {
    try {
      const filters = {
        userId: req.user._id,
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo,
        category: req.query.category,
        type: req.query.type
      };

      const result = await TransactionService.getTransactions(filters);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getTransaction(req, res) {
    try {
      const transaction = await TransactionService.getTransactionById(req.params.id, req.user._id);
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
      const transaction = await TransactionService.updateTransaction(req.params.id, req.user._id, req.body);
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
      await TransactionService.deleteTransaction(req.params.id, req.user._id);
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
}

export default new TransactionController();