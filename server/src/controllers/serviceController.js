import db from '../config/db.js';

export const getServices = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY id ASC'
    );
    const data = result.rows;

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM services WHERE id = $1', [id]);
    const data = result.rows[0];

    if (!data) {
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
