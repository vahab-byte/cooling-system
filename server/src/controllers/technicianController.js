import db from "../config/db.js";

export const getTechnicians = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query =
      "SELECT id, name, rating, jobs_completed, experience_years, avatar_url, status FROM technicians";
    const params = [];

    if (status) {
      query += " WHERE status = $1";
      params.push(status);
    }

    query += " ORDER BY rating DESC";

    const result = await db.query(query, params);
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getTechnicianDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get tech details
    const techRes = await db.query(
      "SELECT * FROM technicians WHERE profile_id = $1",
      [userId],
    );
    if (techRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Technician profile not found" });
    }
    const tech = techRes.rows[0];

    // Get active bookings
    const activeRes = await db.query(
      `SELECT b.*, s.title as service_name, p.full_name as customer_name, p.phone as customer_phone
       FROM bookings b
       LEFT JOIN services s ON b.service_id = s.id
       LEFT JOIN profiles p ON b.user_id = p.id
       WHERE b.technician_id = $1 AND b.status IN ('assigned', 'en_route', 'in_progress')
       ORDER BY b.booking_date ASC`,
      [tech.id],
    );

    res.status(200).json({
      success: true,
      data: {
        profile: tech,
        activeJobs: activeRes.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Verify technician owns this booking
    const authRes = await db.query(
      `SELECT b.id, t.id as tech_id FROM bookings b 
       JOIN technicians t ON b.technician_id = t.id 
       WHERE b.id = $1 AND t.profile_id = $2`,
      [bookingId, userId],
    );

    if (authRes.rows.length === 0) {
      return res
        .status(403)
        .json({ success: false, error: "Not authorized for this booking" });
    }

    const techId = authRes.rows[0].tech_id;

    // Update booking
    const result = await db.query(
      "UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [status, bookingId],
    );

    // If completed or cancelled, free up the technician
    if (status === "completed" || status === "cancelled") {
      await db.query(
        "UPDATE technicians SET status = 'available', jobs_completed = jobs_completed + 1 WHERE id = $1",
        [techId],
      );
    }

    // Notify admin & user (Mocked via DB notifications table)
    const adminRes = await db.query(
      "SELECT id FROM profiles WHERE role = 'admin' LIMIT 1",
    );
    if (adminRes.rows.length > 0) {
      await db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)",
        [
          adminRes.rows[0].id,
          "Job Status Updated",
          `Booking ${bookingId.split("-")[0]} marked as ${status}`,
          "info",
        ],
      );
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
