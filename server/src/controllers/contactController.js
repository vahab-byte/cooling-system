import db from '../config/db.js';

export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    const result = await db.query(
      `INSERT INTO contacts (name, email, phone, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, email, phone, message]
    );

    res.status(201).json({
      success: true,
      message: 'Contact query saved successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};
