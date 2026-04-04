import cleanupService from '../services/cleanupService.js';
import logger from './logger.js';
import { CLEANUP_CONFIG } from './constants.js';

/**
 * Simple scheduler for running periodic cleanup tasks
 */
class Scheduler {
  constructor() {
    this.jobs = new Map();
    this.isRunning = false;
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) {
      logger.warn('Scheduler is already running');
      return;
    }

    if (!CLEANUP_CONFIG.ENABLED) {
      logger.info('Cleanup scheduler is disabled');
      return;
    }

    this.isRunning = true;
    logger.info(`Starting cleanup scheduler (runs every ${CLEANUP_CONFIG.INTERVAL_HOURS} hours)`);

    // Run initial cleanup
    this.runCleanupJob();

    // Schedule recurring cleanup
    const intervalMs = CLEANUP_CONFIG.INTERVAL_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
    this.jobs.set('cleanup', setInterval(() => {
      this.runCleanupJob();
    }, intervalMs));
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    logger.info('Stopping cleanup scheduler');
    this.jobs.forEach((intervalId, jobName) => {
      clearInterval(intervalId);
      logger.debug(`Stopped job: ${jobName}`);
    });

    this.jobs.clear();
    this.isRunning = false;
  }

  /**
   * Run the cleanup job
   */
  async runCleanupJob() {
    try {
      const startTime = Date.now();
      const result = await cleanupService.runFullCleanup();
      const duration = Date.now() - startTime;

      logger.info(`Cleanup job completed in ${duration}ms`, {
        usersDeleted: result.usersDeleted,
        transactionsDeleted: result.transactionsDeleted,
        totalDeleted: result.totalDeleted
      });
    } catch (error) {
      logger.error('Cleanup job failed:', error);
    }
  }

  /**
   * Manually trigger cleanup (useful for testing or admin operations)
   * @returns {Promise<{usersDeleted: number, transactionsDeleted: number, totalDeleted: number}>}
   */
  async triggerCleanup() {
    logger.info('Manual cleanup triggered');
    return await cleanupService.runFullCleanup();
  }

  /**
   * Get scheduler status
   * @returns {object}
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      enabled: CLEANUP_CONFIG.ENABLED,
      intervalHours: CLEANUP_CONFIG.INTERVAL_HOURS,
      retentionDays: CLEANUP_CONFIG.RETENTION_DAYS,
      activeJobs: Array.from(this.jobs.keys())
    };
  }
}

export default new Scheduler();