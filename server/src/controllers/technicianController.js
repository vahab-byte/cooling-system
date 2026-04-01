import db from '../config/db.js';

export const getTechnicians = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT id, name, rating, jobs_completed, experience_years, avatar_url, status FROM technicians';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY rating DESC';

    const result = await db.query(query, params);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
