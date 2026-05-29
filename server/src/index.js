import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import xss from "xss-clean";
import hpp from "hpp";
import compression from "compression";
import { specs } from "./config/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

// Load env vars
dotenv.config();

// Validate required env vars (warn but don't crash — allow server to start for health checks)
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  logger.warn(`Missing environment variables: ${missingVars.join(", ")}`);
  logger.warn("Database-dependent routes will fail until these are set.");
}

const app = express();

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Strict: 10 auth attempts per 15 min
  message: {
    success: false,
    message: "Too many authentication attempts. Please wait 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Security and utility middleware
app.use(globalLimiter);
app.use(helmet());

// Prevent Cross-Site Scripting (XSS)
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Compress all responses for better performance
app.use(compression());

// Dynamic CORS — supports Render auto-generated URLs and custom domains
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3001",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any Render URL or listed origins
      if (allowedOrigins.includes(origin) || origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }
      callback(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// Health check (includes optional DB connectivity test)
app.get("/api/health", async (req, res) => {
  const health = {
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  };

  // Optional: test DB connection
  try {
    const { default: db } = await import("./config/db.js");
    await db.query("SELECT 1");
    health.database = "connected";
  } catch (err) {
    health.database = "disconnected";
    health.dbError = err.message;
  }

  res.status(200).json(health);
});

// Import routes
import authRoutes from "./routes/authRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import technicianRoutes from "./routes/technicianRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import pricingRoutes from "./routes/pricingRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import sparePartsRoutes from "./routes/sparePartsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";

// Mount all routes under /api/v1
app.use("/api/v1/auth", authLimiter, authRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/technicians", technicianRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/pricing", pricingRoutes);
app.use("/api/v1/testimonials", testimonialRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/spare-parts", sparePartsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/blog", blogRoutes);

// Legacy route support (keep /api/* working for existing frontend)
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/technicians", technicianRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(
    `🚀 ArcticFresh Server started in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
  logger.info(`   API:  http://localhost:${PORT}/api/v1`);
  logger.info(`   Docs: http://localhost:${PORT}/api-docs`);
});
