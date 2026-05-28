import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail, sendPasswordResetEmail } from '../config/mailer.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      const existingUser = userExists.rows[0];

      // If user exists but email not verified, allow re-registration with new OTP
      if (!existingUser.email_verified) {
        const otp = generateOTP();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otpExpires = new Date(Date.now() + 10 * 60000); // 10 min

        await db.query(
          `UPDATE profiles 
           SET password_hash = $1, full_name = $2, email_otp = $3, email_otp_expires = $4 
           WHERE email = $5`,
          [hashedPassword, fullName, hashedOtp, otpExpires, email]
        );

        // Send verification email
        try {
          await sendVerificationEmail(email, otp, fullName);
        } catch (mailErr) {
          console.error('Email send failed:', mailErr.message);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to send verification email. Please check server email config.' 
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Verification code resent to your email.',
          data: { email, requiresVerification: true }
        });
      }

      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP and hash it
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60000); // 10 min

    // Create user with email_verified = false
    const result = await db.query(
      `INSERT INTO profiles (email, password_hash, full_name, email_verified, email_otp, email_otp_expires) 
       VALUES ($1, $2, $3, false, $4, $5) 
       RETURNING id, email, full_name`,
      [email, hashedPassword, fullName, hashedOtp, otpExpires]
    );
    const user = result.rows[0];

    // Send verification email
    try {
      await sendVerificationEmail(email, otp, fullName);
    } catch (mailErr) {
      console.error('Email send failed:', mailErr.message);
      // Still created user, but inform about email failure
      return res.status(201).json({
        success: true,
        message: 'Account created but verification email failed. Please use resend option.',
        data: { email, requiresVerification: true }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Account created! Verification code sent to your email.',
      data: { email, requiresVerification: true }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }

    // Find user
    const result = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ success: false, error: 'Email is already verified' });
    }

    // Check OTP expiry
    if (!user.email_otp_expires || new Date() > new Date(user.email_otp_expires)) {
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    // Verify OTP
    const isValidOtp = await bcrypt.compare(otp, user.email_otp);
    if (!isValidOtp) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }

    // Mark email as verified and clear OTP
    await db.query(
      `UPDATE profiles 
       SET email_verified = true, email_otp = NULL, email_otp_expires = NULL 
       WHERE email = $1`,
      [email]
    );

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now sign in.',
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Find user
    const result = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    if (user.email_verified) {
      return res.status(400).json({ success: false, error: 'Email is already verified' });
    }

    // Rate limit: don't resend if last OTP was sent less than 60 seconds ago
    if (user.email_otp_expires) {
      const lastSentAt = new Date(user.email_otp_expires).getTime() - 10 * 60000; // otp_expires - 10min = sent_at
      const secondsSinceSent = (Date.now() - lastSentAt) / 1000;
      if (secondsSinceSent < 60) {
        const waitSeconds = Math.ceil(60 - secondsSinceSent);
        return res.status(429).json({ 
          success: false, 
          error: `Please wait ${waitSeconds} seconds before requesting a new code.` 
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60000);

    await db.query(
      `UPDATE profiles SET email_otp = $1, email_otp_expires = $2 WHERE email = $3`,
      [hashedOtp, otpExpires, email]
    );

    // Send email
    try {
      await sendVerificationEmail(email, otp, user.full_name);
    } catch (mailErr) {
      console.error('Email resend failed:', mailErr.message);
      return res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
    }

    res.status(200).json({
      success: true,
      message: 'New verification code sent to your email.',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const result = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Block login if email not verified
    if (!user.email_verified) {
      return res.status(403).json({ 
        success: false, 
        error: 'Please verify your email before signing in.',
        code: 'EMAIL_NOT_VERIFIED',
        data: { email: user.email }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, full_name: user.full_name },
        session: { access_token: signToken(user.id) }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // For JWT, logout is primarily client-side (remove token),
    // but we can provide an endpoint for consistency.
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// --- FORGOT PASSWORD ---

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email is required' });

    const result = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Don't reveal if user exists or not (security)
      return res.status(200).json({ success: true, message: 'If this email exists, a reset code has been sent.' });
    }

    const user = result.rows[0];

    // Rate limit — 60 seconds between requests
    if (user.reset_otp_expires) {
      const lastSentAt = new Date(user.reset_otp_expires).getTime() - 10 * 60000;
      if (Date.now() - lastSentAt < 60000) {
        return res.status(429).json({ success: false, error: 'Please wait 60 seconds before requesting again.' });
      }
    }

    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60000);

    await db.query(
      `UPDATE profiles SET reset_otp = $1, reset_otp_expires = $2 WHERE email = $3`,
      [hashedOtp, otpExpires, email]
    );

    try {
      await sendPasswordResetEmail(email, otp, user.full_name);
    } catch (mailErr) {
      console.error('Reset email failed:', mailErr.message);
      return res.status(500).json({ success: false, error: 'Failed to send reset email. Please try again.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset code sent to your email.',
      data: { email }
    });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email, OTP and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    const result = await db.query('SELECT * FROM profiles WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid request' });
    }

    const user = result.rows[0];

    if (!user.reset_otp || !user.reset_otp_expires) {
      return res.status(400).json({ success: false, error: 'No reset request found. Please request a new code.' });
    }

    if (new Date() > new Date(user.reset_otp_expires)) {
      return res.status(400).json({ success: false, error: 'Reset code has expired. Please request a new one.' });
    }

    const isValidOtp = await bcrypt.compare(otp, user.reset_otp);
    if (!isValidOtp) {
      return res.status(400).json({ success: false, error: 'Invalid reset code. Please check and try again.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query(
      `UPDATE profiles SET password_hash = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE email = $2`,
      [hashedPassword, email]
    );

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully! You can now sign in with your new password.'
    });
  } catch (err) {
    next(err);
  }
};

// --- OTP AUTHENTICATION (Phone-based) ---

export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry

    // Save to DB
    await db.query(
      `INSERT INTO otp_verifications (phone, otp_code, expires_at)
       VALUES ($1, $2, $3)`,
      [phone, otp, expiresAt]
    );

    // TODO: Integrate actual SMS gateway like Twilio or MSG91 here.
    // In dev mode, print to console.
    console.log(`[OTP VERIFICATION] Mock SMS to ${phone} - OTP is: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: process.env.NODE_ENV === 'development' ? { otp } : {} // Return OTP in dev for easy testing
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp_code } = req.body;

    if (!phone || !otp_code) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    // Check OTP
    const otpResult = await db.query(
      `SELECT * FROM otp_verifications 
       WHERE phone = $1 AND otp_code = $2 AND verified = false AND expires_at > NOW() 
       ORDER BY created_at DESC LIMIT 1`,
      [phone, otp_code]
    );

    if (otpResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // Mark verified
    await db.query(
      'UPDATE otp_verifications SET verified = true WHERE id = $1',
      [otpResult.rows[0].id]
    );

    // Login or Create user
    let userResult = await db.query('SELECT * FROM profiles WHERE phone = $1', [phone]);
    let user = userResult.rows[0];

    if (!user) {
      // Create barebones user if they dont exist
      const newResult = await db.query(
        'INSERT INTO profiles (phone, full_name, role) VALUES ($1, $2, $3) RETURNING id, email, full_name, phone, role',
        [phone, 'Guest', 'customer']
      );
      user = newResult.rows[0];
    } else {
       // Filter out password hash
       delete user.password_hash;
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        user,
        session: { access_token: signToken(user.id) }
      }
    });

  } catch (error) {
    next(error);
  }
};
