import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const statusCode = err.statusCode || 500;

  // Log detailed error info
  logger.error(
    `[${timestamp}] ${req.method} ${req.originalUrl} — Error: ${err.message}`,
  );
  if (process.env.NODE_ENV === "development") {
    logger.error(err.stack);
  }

  // Provide user-friendly messages for known database errors
  let userMessage = err.message || "Internal server error";

  if (err.message?.includes("ENOTFOUND")) {
    userMessage =
      "Database is temporarily unavailable. Please try again later.";
  } else if (err.message?.includes("ECONNREFUSED")) {
    userMessage = "Unable to connect to the database. Please try again later.";
  } else if (
    err.message?.includes("relation") &&
    err.message?.includes("does not exist")
  ) {
    userMessage =
      "A required database table is missing. Please contact support.";
  } else if (err.message?.includes("ETIMEDOUT")) {
    userMessage = "Database connection timed out. Please try again.";
  }

  res.status(statusCode).json({
    success: false,
    message: userMessage,
    data: null,
    ...(process.env.NODE_ENV === "development" && {
      debug: err.message,
      stack: err.stack,
    }),
  });
};
