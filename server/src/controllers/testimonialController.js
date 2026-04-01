import db from '../config/db.js';

// GET all testimonials (public)
export const getTestimonials = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT * FROM testimonials ORDER BY id DESC'
    );

    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// POST create testimonial
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, comment, rating, avatar_url } = req.body;

    const result = await db.query(
      `INSERT INTO testimonials (name, role, comment, rating, avatar_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, role, comment, rating || 5, avatar_url]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE testimonial (admin only)
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM testimonials WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
