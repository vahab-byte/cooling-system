import db from "../config/db.js";

const GST_RATE = 0.18;

// Utility to calculate price
const calculatePrice = async (serviceId, partIds = []) => {
  // Get base service price
  const sRes = await db.query("SELECT price FROM services WHERE id = $1", [
    serviceId,
  ]);
  const service = sRes.rows[0];
  if (!service) throw new Error("Service not found");

  let partsTotal = 0;
  const partsDetails = [];

  if (partIds && partIds.length > 0) {
    const pRes = await db.query(
      "SELECT id, name, price FROM spare_parts WHERE id = ANY($1)",
      [partIds],
    );
    const parts = pRes.rows;

    parts.forEach((part) => {
      partsTotal += Number(part.price);
      partsDetails.push({ name: part.name, price: Number(part.price) });
    });
  }

  const subtotal = Number(service.price) + partsTotal;
  const tax = subtotal * GST_RATE;
  const discount = 0; // Future enhancement: AMC discounts
  const total = subtotal + tax - discount;

  return {
    basePrice: Number(service.price),
    partsTotal,
    partsDetails,
    subtotal,
    tax,
    discount,
    total,
  };
};

export const estimatePrice = async (req, res, next) => {
  try {
    const { serviceId, partIds } = req.body;

    if (!serviceId) {
      return res
        .status(400)
        .json({ success: false, error: "Service ID is required" });
    }

    const estimate = await calculatePrice(serviceId, partIds);

    res.status(200).json({
      success: true,
      data: estimate,
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const { userId, serviceId, address, bookingDate, partIds } = req.body;

    if (!userId || !serviceId || !address || !bookingDate) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // 1. Calculate final price
    const pricing = await calculatePrice(serviceId, partIds);

    // 2. Auto-Allocate Technician
    const techRes = await db.query(
      "SELECT id, name FROM technicians WHERE status = 'available' LIMIT 1",
    );
    const tech = techRes.rows[0];
    const initialStatus = tech ? "assigned" : "pending";
    const techId = tech ? tech.id : null;

    // 3. Create booking record
    const bRes = await db.query(
      `INSERT INTO bookings (user_id, service_id, address, booking_date, total_amount, subtotal, tax_amount, discount_amount, status, technician_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        serviceId,
        address,
        bookingDate,
        pricing.total,
        pricing.subtotal,
        pricing.tax,
        pricing.discount,
        initialStatus,
        techId,
      ],
    );
    const booking = bRes.rows[0];

    // 4. Update technician status and notify admin
    if (techId) {
      await db.query("UPDATE technicians SET status = 'busy' WHERE id = $1", [
        techId,
      ]);

      const adminRes = await db.query(
        "SELECT id FROM profiles WHERE role = 'admin' LIMIT 1",
      );
      if (adminRes.rows.length > 0) {
        await db.query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
          [
            adminRes.rows[0].id,
            "New Auto-Assignment",
            `Booking assigned to ${tech.name}`,
            "booking_update",
          ],
        );
      }
    }

    // 3. Create invoice record
    await db.query(
      `INSERT INTO invoices (booking_id, user_id, subtotal, tax, discount, total, breakdown, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        booking.id,
        userId,
        pricing.subtotal,
        pricing.tax,
        pricing.discount,
        pricing.total,
        pricing,
        "unpaid",
      ],
    );

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingHistory = async (req, res, next) => {
  try {
    const { id } = req.params; // userId

    const result = await db.query(
      `SELECT b.*, 
       json_build_object('title', s.title, 'icon', s.icon, 'category', s.category) as services,
       json_build_object('name', t.name, 'phone', t.phone, 'rating', t.rating) as technicians
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       LEFT JOIN technicians t ON b.technician_id = t.id
       WHERE b.user_id = $1
       ORDER BY b.booking_date DESC`,
      [id],
    );
    const data = result.rows;

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // bookingId

    const result = await db.query(
      `SELECT b.id, b.status, b.technician_id, 
       json_build_object('name', t.name, 'phone', t.phone, 'status', t.status) as technicians
       FROM bookings b
       LEFT JOIN technicians t ON b.technician_id = t.id
       WHERE b.id = $1`,
      [id],
    );
    const data = result.rows[0];

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const bookService = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      address,
      service_type,
      preferred_date,
      preferred_time,
      notes,
    } = req.body;

    // 1. Find service_id by type (matching category or title)
    const sRes = await db.query(
      "SELECT id, price FROM services WHERE LOWER(category) = LOWER($1) OR LOWER(title) = LOWER($1) LIMIT 1",
      [service_type],
    );
    const service = sRes.rows[0];

    if (!service) {
      return res
        .status(404)
        .json({
          success: false,
          error: `Service type '${service_type}' not found`,
        });
    }

    // 2. Pricing
    const subtotal = Number(service.price);
    const tax = subtotal * GST_RATE;
    const total = subtotal + tax;

    // 3. Auto-Allocate Technician
    const techRes = await db.query(
      "SELECT id, name FROM technicians WHERE status = 'available' LIMIT 1",
    );
    const tech = techRes.rows[0];
    const initialStatus = tech ? "assigned" : "pending";
    const techId = tech ? tech.id : null;

    // 4. Create booking
    const result = await db.query(
      `INSERT INTO bookings (customer_name, customer_phone, address, service_id, booking_date, preferred_time, notes, total_amount, status, technician_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        name,
        phone,
        address,
        service.id,
        preferred_date,
        preferred_time,
        notes,
        total,
        initialStatus,
        techId,
      ],
    );

    // 5. Update tech and notify admin
    if (techId) {
      await db.query("UPDATE technicians SET status = 'busy' WHERE id = $1", [
        techId,
      ]);

      const adminRes = await db.query(
        "SELECT id FROM profiles WHERE role = 'admin' LIMIT 1",
      );
      if (adminRes.rows.length > 0) {
        await db.query(
          "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
          [
            adminRes.rows[0].id,
            "New Auto-Assignment",
            `Guest Booking assigned to ${tech.name}`,
            "booking_update",
          ],
        );
      }
    }

    res.status(201).json({
      success: true,
      message: "Service booked successfully",
      bookingId: result.rows[0].id,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT b.*, s.title as service_title, s.category as service_category 
       FROM bookings b 
       LEFT JOIN services s ON b.service_id = s.id 
       ORDER BY b.created_at DESC`,
    );
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const userId = req.user ? req.user.id : null; // Assume auth middleware adds user

    // 1. Get current status First
    const currentRes = await db.query(
      "SELECT status FROM bookings WHERE id = $1",
      [id],
    );
    if (currentRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }
    const oldStatus = currentRes.rows[0].status;

    // 2. Update booking
    const result = await db.query(
      "UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, id],
    );

    // 3. Track history
    if (oldStatus !== status) {
      await db.query(
        `INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by, notes) 
         VALUES ($1, $2, $3, $4, $5)`,
        [id, oldStatus, status, userId, notes || `Status changed to ${status}`],
      );
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated locally",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "DELETE FROM bookings WHERE id = $1 RETURNING *",
      [id],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
