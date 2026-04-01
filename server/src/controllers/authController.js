import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
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
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      'INSERT INTO profiles (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING id, email, full_name',
      [email, hashedPassword, fullName]
    );
    const user = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        user,
        session: { access_token: signToken(user.id) }
      }
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

// --- OTP AUTHENTICATION ---

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
};

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

