import db from '../config/db.js';

export const getSpareParts = async (req, res, next) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM spare_parts WHERE stock > 0';
    const params = [];

    if (category) {
      query += ' AND category = $1';
      params.push(category);
    }

    query += ' ORDER BY name ASC';

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
