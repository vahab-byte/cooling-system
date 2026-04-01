import express from 'express';
import { register, login, logout, sendOtp, verifyOtp } from '../controllers/authController.js';
import { validate, registerSchema, loginSchema, sendOtpSchema, verifyOtpSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// OTP Auth Flow
router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);

export default router;
