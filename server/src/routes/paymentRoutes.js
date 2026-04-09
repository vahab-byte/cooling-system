import express from 'express';
import { createOrder, verifyPayment, getPaymentByBookingId } from '../controllers/paymentController.js';

const router = express.Router();

/**
 * Route: Create a new Razorpay order
 */
router.post('/create-order', createOrder);

/**
 * Route: Verify payment signature and update database
 */
router.post('/verify', verifyPayment);

/**
 * Route: Fetch payment details by booking ID
 */
router.get('/:bookingId', getPaymentByBookingId);

export default router;
