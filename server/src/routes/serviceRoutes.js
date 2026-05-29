import express from "express";
import {
  getServices,
  getServiceById,
} from "../controllers/serviceController.js";
import { apiCache } from "../middleware/cacheMiddleware.js";

const router = express.Router();

// Cache services for 15 minutes
router.get("/", apiCache(900), getServices);
router.get("/:id", apiCache(900), getServiceById);

export default router;
