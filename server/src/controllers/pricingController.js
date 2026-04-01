import db from '../config/db.js';

// GET pricing plans (public)
export const getPricingPlans = async (req, res, next) => {
  try {
    const { type } = req.query; // 'home' or 'commercial'

    let query = 'SELECT * FROM pricing_plans WHERE is_active = true';
    const params = [];

    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    query += ' ORDER BY display_order ASC';

    const result = await db.query(query, params);

    res.status(200).json({
      success: true,
      message: 'Pricing plans fetched successfully',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// GET pricing details (legacy - services with prices)
export const getPricingDetails = async (req, res, next) => {
  try {
    const result = await db.query(
      'SELECT id, title, category, price, original_price, features, tag FROM services WHERE is_active = true ORDER BY price ASC'
    );

    res.status(200).json({
      success: true,
      message: 'Pricing details fetched',
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

// POST create pricing plan (admin)
export const createPricingPlan = async (req, res, next) => {
  try {
    const { name, type, price, period, description, features, is_featured, display_order } = req.body;

    const result = await db.query(
      `INSERT INTO pricing_plans (name, type, price, period, description, features, is_featured, display_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, type, price, period, description, JSON.stringify(features), is_featured || false, display_order || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Pricing plan created',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// PUT update pricing plan (admin)
export const updatePricingPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, type, price, period, description, features, is_featured, display_order, is_active } = req.body;

    const result = await db.query(
      `UPDATE pricing_plans SET 
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        price = COALESCE($3, price),
        period = COALESCE($4, period),
        description = COALESCE($5, description),
        features = COALESCE($6, features),
        is_featured = COALESCE($7, is_featured),
        display_order = COALESCE($8, display_order),
        is_active = COALESCE($9, is_active)
       WHERE id = $10 RETURNING *`,
      [name, type, price, period, description, features ? JSON.stringify(features) : null, is_featured, display_order, is_active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing plan updated',
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// DELETE pricing plan (admin)
export const deletePricingPlan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM pricing_plans WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Pricing plan deleted'
    });
  } catch (error) {
    next(error);
  }
};
