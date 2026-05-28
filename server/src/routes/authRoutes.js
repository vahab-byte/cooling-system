import express from 'express';
import { register, login, logout, sendOtp, verifyOtp, verifyEmail, resendVerification, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validate, registerSchema, loginSchema, sendOtpSchema, verifyOtpSchema, verifyEmailSchema, resendVerificationSchema, forgotPasswordSchema, resetPasswordSchema } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

// Email Verification
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-verification', validate(resendVerificationSchema), resendVerification);

// OTP Auth Flow
router.post('/send-otp', validate(sendOtpSchema), sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);

// Forgot Password Flow
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
