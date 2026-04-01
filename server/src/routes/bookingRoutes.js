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
import { protect } from '../middleware/authMiddleware.js';
import { validate, createBookingSchema, estimateSchema, bookServiceSchema } from '../middleware/validate.js';

const router = express.Router();

// Pricing estimator
router.post('/estimate', validate(estimateSchema), estimatePrice);
router.post('/book-service', validate(bookServiceSchema), bookService);

// Admin Routes
router.get('/admin/all', getAllBookings);
router.patch('/admin/:id', updateBooking);
router.delete('/admin/:id', deleteBooking);

// Create new booking (Protected)
router.post('/', protect, validate(createBookingSchema), createBooking);

// Get user booking history (Protected)
router.get('/user/:id', protect, getBookingHistory);

// Get booking status (real-time tracking)
router.get('/:id/status', protect, getBookingStatus);

export default router;
