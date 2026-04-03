import Transaction from '../models/Transaction.js';

class TransactionService {
  async getTransactions({ userId, page = 1, limit = 20, dateFrom, dateTo, category, type }) {
    const filter = { user: userId };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const skip = (Math.max(page, 1) - 1) * limit;

    const [total, transactions] = await Promise.all([
      Transaction.countDocuments(filter),
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email'),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages
      },
      data: transactions
    };
  }

  async getTransactionById(transactionId, userId) {
    const transaction = await Transaction.findById(transactionId).populate('user', 'name email role status');
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.user._id.toString() !== userId.toString()) {
      throw new Error('Unauthorized access');
    }
    return transaction;
  }

  async createTransaction(userId, transactionData) {
    const data = {
      ...transactionData,
      user: userId
    };
    const transaction = new Transaction(data);
    await transaction.save();
    return await Transaction.findById(transaction._id).populate('user', 'name email');
  }

  async updateTransaction(transactionId, userId, payload) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access');
    }
    const updatable = ['amount', 'type', 'category', 'subcategory', 'date', 'description', 'notes', 'tags', 'paymentMethod', 'isRecurring', 'recurringFrequency', 'status', 'attachments'];
    updatable.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        transaction[field] = payload[field];
      }
    });
    await transaction.save();
    return await Transaction.findById(transaction._id).populate('user', 'name email');
  }

  async deleteTransaction(transactionId, userId) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    if (transaction.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access');
    }

    await transaction.remove();
    return transaction;
  }
}

export default new TransactionService();