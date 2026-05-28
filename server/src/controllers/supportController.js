import db from '../config/db.js';
import { randomUUID } from 'crypto';

export const createSupportTicket = async (req, res, next) => {
  try {
    const { user_id, issue_type, message } = req.body;

    const id = randomUUID();
    const result = await db.query(
      `INSERT INTO support_tickets (id, user_id, issue_type, message, status) 
       VALUES ($1, $2, $3, $4, 'open') RETURNING *`,
      [id, user_id || null, issue_type, message]
    );

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM support_tickets ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const getUserTickets = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await db.query('SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await db.query(
      'UPDATE support_tickets SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};
