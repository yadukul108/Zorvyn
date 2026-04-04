import express from 'express';
import cleanupService from '../services/cleanupService.js';
import scheduler from '../utils/scheduler.js';
import { createSuccessResponse, createErrorResponse } from '../utils/responses.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/admin/cleanup/stats:
 *   get:
 *     summary: Get cleanup statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup statistics retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/cleanup/stats', async (req, res) => {
  try {
    const [softDeletedStats, cleanupPreview, schedulerStatus] = await Promise.all([
      cleanupService.getSoftDeletedStats(),
      cleanupService.getCleanupPreview(),
      scheduler.getStatus()
    ]);

    const stats = {
      softDeleted: softDeletedStats,
      wouldBeCleaned: cleanupPreview,
      scheduler: schedulerStatus
    };

    res.json(createSuccessResponse(stats, 'Cleanup statistics retrieved successfully'));
  } catch (error) {
    logger.error('Error getting cleanup stats:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve cleanup statistics'));
  }
});

/**
 * @swagger
 * /api/admin/cleanup/run:
 *   post:
 *     summary: Manually trigger cleanup
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup completed successfully
 *       500:
 *         description: Server error
 */
router.post('/cleanup/run', async (req, res) => {
  try {
    const result = await scheduler.triggerCleanup();
    res.json(createSuccessResponse(result, 'Cleanup completed successfully'));
  } catch (error) {
    logger.error('Error running manual cleanup:', error);
    res.status(500).json(createErrorResponse('Failed to run cleanup'));
  }
});

/**
 * @swagger
 * /api/admin/cleanup/preview:
 *   get:
 *     summary: Preview what would be cleaned up
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cleanup preview retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/cleanup/preview', async (req, res) => {
  try {
    const preview = await cleanupService.getCleanupPreview();
    res.json(createSuccessResponse(preview, 'Cleanup preview retrieved successfully'));
  } catch (error) {
    logger.error('Error getting cleanup preview:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve cleanup preview'));
  }
});

/**
 * @swagger
 * /api/admin/cleanup/status:
 *   get:
 *     summary: Get scheduler status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Scheduler status retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/cleanup/status', async (req, res) => {
  try {
    const status = scheduler.getStatus();
    res.json(createSuccessResponse(status, 'Scheduler status retrieved successfully'));
  } catch (error) {
    logger.error('Error getting scheduler status:', error);
    res.status(500).json(createErrorResponse('Failed to retrieve scheduler status'));
  }
});

export default router;