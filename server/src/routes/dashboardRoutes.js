import express from 'express';
import { getDashboardStats, getUserDashboardOverview, getUserNotifications, markNotificationRead } from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get overall site-wide statistics
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /api/v1/dashboard/user-overview/:userId:
 *   get:
 *     summary: Get user-specific dashboard statistics
 *     tags: [Dashboard]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/user-overview/:userId', getUserDashboardOverview);

router.get('/notifications/:userId', getUserNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;
