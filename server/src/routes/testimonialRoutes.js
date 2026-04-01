import express from 'express';
import { getTestimonials, createTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);
router.delete('/:id', protect, requireRole('admin'), deleteTestimonial);

export default router;
