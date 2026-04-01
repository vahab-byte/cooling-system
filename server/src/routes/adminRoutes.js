import express from 'express';
import { getDashboardStats, getAllUsers, getSettings, updateSetting, getSiteStats } from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/site-stats', getSiteStats);

// Admin only
router.get('/dashboard', protect, requireRole('admin'), getDashboardStats);
router.get('/users', protect, requireRole('admin'), getAllUsers);
router.get('/settings', protect, requireRole('admin'), getSettings);
router.put('/settings/:key', protect, requireRole('admin'), updateSetting);

export default router;
