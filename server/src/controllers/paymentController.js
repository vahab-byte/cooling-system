import Razorpay from 'razorpay';
import crypto from 'crypto';
import { supabase } from '../config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

/**
 * Create a new Razorpay order
 */
export const createOrder = async (req, res) => {
  try {
    const { bookingId, amount, currency = 'INR' } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({ success: false, message: 'Booking ID and amount are required' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId: bookingId,
      }
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId,
      amount,
      paymentMethod
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // Update payments table
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert([
        {
          booking_id: bookingId,
          amount: amount,
          payment_method: paymentMethod || 'unknown',
          payment_status: 'paid',
          transaction_id: razorpay_payment_id,
          razorpay_order_id: razorpay_order_id,
        }
      ]);

    if (paymentError) throw paymentError;

    // Update booking payment status
    const { error: bookingError } = await supabase
      .from('bookings')
      .update({ payment_status: 'paid' })
      .eq('id', bookingId);

    if (bookingError) throw bookingError;

    res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

/**
 * Get payment details by booking ID
 */
export const getPaymentByBookingId = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('booking_id', bookingId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'no rows returned'

    res.status(200).json({ 
      success: true, 
      payment: data || null 
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment details' });
  }
};
