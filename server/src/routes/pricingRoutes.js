import express from 'express';
import { getPricingPlans, getPricingDetails, createPricingPlan, updatePricingPlan, deletePricingPlan } from '../controllers/pricingController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public
router.get('/', getPricingDetails);
router.get('/plans', getPricingPlans);

// Admin
router.post('/plans', protect, requireRole('admin'), createPricingPlan);
router.put('/plans/:id', protect, requireRole('admin'), updatePricingPlan);
router.delete('/plans/:id', protect, requireRole('admin'), deletePricingPlan);

export default router;
