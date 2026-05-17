import express from 'express';
import { 
  estimatePrice, 
  createBooking, 
  getBookingHistory, 
  getBookingStatus, 
  bookService, 
  getAllBookings, 
  updateBooking, 
  deleteBooking 
} from '../controllers/bookingController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { validate, createBookingSchema, estimateSchema, bookServiceSchema } from '../middleware/validate.js';

const router = express.Router();

// Pricing estimator
router.post('/estimate', validate(estimateSchema), estimatePrice);
router.post('/book-service', validate(bookServiceSchema), bookService);

// Admin Routes (NOW PROTECTED)
router.get('/admin/all', protect, requireRole('admin'), getAllBookings);
router.patch('/admin/:id', protect, requireRole('admin'), updateBooking);
router.delete('/admin/:id', protect, requireRole('admin'), deleteBooking);

// Create new booking (Protected)
router.post('/', protect, validate(createBookingSchema), createBooking);

// Get user booking history (Protected)
router.get('/user/:id', protect, getBookingHistory);

// Get booking status (real-time tracking)
router.get('/:id/status', protect, getBookingStatus);

export default router;
