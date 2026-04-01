import db from '../config/db.js';

// GET admin dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    const bookingsResult = await db.query('SELECT COUNT(*) as total FROM bookings');
    const pendingResult = await db.query("SELECT COUNT(*) as total FROM bookings WHERE status = 'pending'");
    const completedResult = await db.query("SELECT COUNT(*) as total FROM bookings WHERE status = 'completed'");
    const usersResult = await db.query('SELECT COUNT(*) as total FROM profiles');
    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) as total FROM bookings WHERE status = 'completed'");
    const techResult = await db.query('SELECT COUNT(*) as total FROM technicians');

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched',
      data: {
        totalBookings: parseInt(bookingsResult.rows[0].total),
        pendingBookings: parseInt(pendingResult.rows[0].total),
        completedBookings: parseInt(completedResult.rows[0].total),
        totalUsers: parseInt(usersResult.rows[0].total),
        totalRevenue: parseFloat(revenueResult.rows[0].total),
        totalTechnicians: parseInt(techResult.rows[0].total)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET all users (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, email, full_name, phone, role, updated_at FROM profiles ORDER BY updated_at DESC'
    );

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET admin settings
export const getSettings = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM admin_settings ORDER BY key ASC');

    res.status(200).json({
      success: true,
      message: 'Settings fetched',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// PUT update admin setting
export const updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const result = await db.query(
      `INSERT INTO admin_settings (key, value, updated_at) VALUES ($1, $2, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()
       RETURNING *`,
      [key, JSON.stringify(value)]
    );

    res.status(200).json({
      success: true,
      message: 'Setting updated',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// GET site stats (public)
export const getSiteStats = async (req, res, next) => {
  try {
    const result = await db.query('SELECT key, value, label FROM site_stats ORDER BY id ASC');

    res.status(200).json({
      success: true,
      message: 'Site stats fetched',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
