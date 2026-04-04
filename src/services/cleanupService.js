import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import logger from '../utils/logger.js';
import { CLEANUP_CONFIG } from '../utils/constants.js';

/**
 * Service for cleaning up soft-deleted data
 */
class CleanupService {
  /**
   * Clean up old soft-deleted users
   * @returns {Promise<{deletedCount: number}>}
   */
  async cleanupUsers() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.RETENTION_DAYS);

      const result = await User.deleteMany({
        deletedAt: { $ne: null, $lt: cutoffDate }
      });

      if (result.deletedCount > 0) {
        logger.info(`Cleaned up ${result.deletedCount} soft-deleted users older than ${CLEANUP_CONFIG.RETENTION_DAYS} days`);
      }

      return result;
    } catch (error) {
      logger.error('Error cleaning up users:', error);
      throw error;
    }
  }

  /**
   * Clean up old soft-deleted transactions
   * @returns {Promise<{deletedCount: number}>}
   */
  async cleanupTransactions() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.RETENTION_DAYS);

      const result = await Transaction.deleteMany({
        deletedAt: { $ne: null, $lt: cutoffDate }
      });

      if (result.deletedCount > 0) {
        logger.info(`Cleaned up ${result.deletedCount} soft-deleted transactions older than ${CLEANUP_CONFIG.RETENTION_DAYS} days`);
      }

      return result;
    } catch (error) {
      logger.error('Error cleaning up transactions:', error);
      throw error;
    }
  }

  /**
   * Run full cleanup of all soft-deleted data
   * @returns {Promise<{usersDeleted: number, transactionsDeleted: number}>}
   */
  async runFullCleanup() {
    try {
      logger.info('Starting scheduled cleanup of soft-deleted data');

      const [userResult, transactionResult] = await Promise.all([
        this.cleanupUsers(),
        this.cleanupTransactions()
      ]);

      const summary = {
        usersDeleted: userResult.deletedCount,
        transactionsDeleted: transactionResult.deletedCount,
        totalDeleted: userResult.deletedCount + transactionResult.deletedCount
      };

      if (summary.totalDeleted > 0) {
        logger.info(`Cleanup completed: ${summary.totalDeleted} records permanently deleted`);
      } else {
        logger.info('Cleanup completed: no old records to delete');
      }

      return summary;
    } catch (error) {
      logger.error('Error during full cleanup:', error);
      throw error;
    }
  }

  /**
   * Get statistics about soft-deleted data
   * @returns {Promise<{users: number, transactions: number, total: number}>}
   */
  async getSoftDeletedStats() {
    try {
      const [userCount, transactionCount] = await Promise.all([
        User.countDocuments({ deletedAt: { $ne: null } }),
        Transaction.countDocuments({ deletedAt: { $ne: null } })
      ]);

      return {
        users: userCount,
        transactions: transactionCount,
        total: userCount + transactionCount
      };
    } catch (error) {
      logger.error('Error getting soft-deleted stats:', error);
      throw error;
    }
  }

  /**
   * Get statistics about data that would be cleaned up
   * @returns {Promise<{users: number, transactions: number, total: number}>}
   */
  async getCleanupPreview() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_CONFIG.RETENTION_DAYS);

      const [userCount, transactionCount] = await Promise.all([
        User.countDocuments({
          deletedAt: { $ne: null, $lt: cutoffDate }
        }),
        Transaction.countDocuments({
          deletedAt: { $ne: null, $lt: cutoffDate }
        })
      ]);

      return {
        users: userCount,
        transactions: transactionCount,
        total: userCount + transactionCount,
        retentionDays: CLEANUP_CONFIG.RETENTION_DAYS
      };
    } catch (error) {
      logger.error('Error getting cleanup preview:', error);
      throw error;
    }
  }
}

export default new CleanupService();