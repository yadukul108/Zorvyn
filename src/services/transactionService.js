import Transaction from '../models/Transaction.js';

class TransactionService {
  async getTransactions({ userId, page = 1, limit = 20, dateFrom, dateTo, category, type, canAccessAll = false }) {
    const filter = {};

    // If user cannot access all transactions, filter by their own userId
    if (!canAccessAll) {
      filter.user = userId;
    }

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

  async getTransactionById(transactionId, userId, canAccessAll = false) {
    const transaction = await Transaction.findById(transactionId).populate('user', 'name email role status');
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check if user can access this transaction
    if (!canAccessAll && transaction.user._id.toString() !== userId.toString()) {
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

  async updateTransaction(transactionId, userId, payload, canAccessAll = false) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check if user can access this transaction
    if (!canAccessAll && transaction.user.toString() !== userId.toString()) {
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

  async deleteTransaction(transactionId, userId, canAccessAll = false) {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Check if user can access this transaction
    if (!canAccessAll && transaction.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized access');
    }

    await transaction.remove();
    return transaction;
  }

  async getDashboardSummary(userId, dateFrom, dateTo) {
    const matchFilter = { user: userId, status: 'completed' };

    if (dateFrom || dateTo) {
      matchFilter.date = {};
      if (dateFrom) matchFilter.date.$gte = new Date(dateFrom);
      if (dateTo) matchFilter.date.$lte = new Date(dateTo);
    }

    const summary = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    const income = summary.find(item => item._id === 'income')?.total || 0;
    const expense = summary.find(item => item._id === 'expense')?.total || 0;
    const balance = income - expense;

    return {
      income,
      expense,
      balance,
      period: {
        from: dateFrom ? new Date(dateFrom) : null,
        to: dateTo ? new Date(dateTo) : null
      }
    };
  }

  async getCategoryAggregation(userId, dateFrom, dateTo) {
    const matchFilter = { user: userId, status: 'completed' };

    if (dateFrom || dateTo) {
      matchFilter.date = {};
      if (dateFrom) matchFilter.date.$gte = new Date(dateFrom);
      if (dateTo) matchFilter.date.$lte = new Date(dateTo);
    }

    const aggregation = await Transaction.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            category: '$category',
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0]
            }
          },
          transactionCount: { $sum: '$count' }
        }
      },
      {
        $project: {
          category: '$_id',
          income: 1,
          expense: 1,
          transactionCount: 1,
          netAmount: { $subtract: ['$income', '$expense'] }
        }
      },
      { $sort: { netAmount: -1 } }
    ]);

    return {
      categories: aggregation,
      period: {
        from: dateFrom ? new Date(dateFrom) : null,
        to: dateTo ? new Date(dateTo) : null
      }
    };
  }

  async getMonthlyTrends(userId, year) {
    const startDate = new Date(year, 0, 1); // January 1st of the year
    const endDate = new Date(year, 11, 31, 23, 59, 59); // December 31st of the year

    const trends = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          status: 'completed',
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: {
            year: '$_id.year',
            month: '$_id.month'
          },
          income: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'income'] }, '$total', 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'expense'] }, '$total', 0]
            }
          },
          transactionCount: { $sum: '$count' }
        }
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          income: 1,
          expense: 1,
          transactionCount: 1,
          balance: { $subtract: ['$income', '$expense'] }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    // Fill in missing months with zero values
    const monthlyData = [];
    for (let month = 1; month <= 12; month++) {
      const existingData = trends.find(t => t.month === month);
      if (existingData) {
        monthlyData.push(existingData);
      } else {
        monthlyData.push({
          year,
          month,
          income: 0,
          expense: 0,
          transactionCount: 0,
          balance: 0
        });
      }
    }

    return {
      year,
      monthlyTrends: monthlyData
    };
  }
}

export default new TransactionService();