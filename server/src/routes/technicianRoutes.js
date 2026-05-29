import express from "express";
import {
  getTechnicians,
  getTechnicianDashboard,
  updateJobStatus,
} from "../controllers/technicianController.js";
import { protect, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTechnicians);

// Protected Technician Routes
router.get(
  "/dashboard",
  protect,
  requireRole("technician"),
  getTechnicianDashboard,
);
router.put(
  "/booking/:bookingId/status",
  protect,
  requireRole("technician"),
  updateJobStatus,
);

export default router;
