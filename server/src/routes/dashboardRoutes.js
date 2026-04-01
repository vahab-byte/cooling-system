import express from 'express';
import { getDashboardStats, getUserDashboardOverview } from '../controllers/dashboardController.js';

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

export default router;
