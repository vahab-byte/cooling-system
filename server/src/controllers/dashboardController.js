import db from '../config/db.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const statsRes = await db.query('SELECT * FROM site_stats');
    const stats = statsRes.rows;

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const getUserDashboardOverview = async (req, res, next) => {
  const { userId } = req.params;
  try {
    // 1. Total Spent (sum of total_amount)
    const spentRes = await db.query(
      "SELECT SUM(total_amount) as total FROM bookings WHERE user_id = $1 AND status = 'completed'",
      [userId]
    );
    const totalSpent = Number(spentRes.rows[0]?.total || 0);

    // 2. Active Bookings Count
    const activeRes = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE user_id = $1 AND status NOT IN ('completed', 'cancelled')",
      [userId]
    );
    const activeCount = Number(activeRes.rows[0]?.count || 0);

    res.status(200).json({
      success: true,
      data: {
        totalSpent,
        activeCount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUserNotifications = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20',
      [userId]
    );
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 RETURNING *',
      [id]
    );
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
