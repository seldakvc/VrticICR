import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";
import RegistrationError from "../utils/RegistrationError.js";

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  }

  if (error instanceof RegistrationError) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.errorMessage,
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.fromEntries(
      Object.entries(error.errors).map(([field, detail]) => [field, [detail.message]]),
    );
    return res.status(422).json({ message: "The given data was invalid.", errors });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "value";
    return res.status(422).json({
      message: "The given data was invalid.",
      errors: { [field]: [`The ${field} has already been taken.`] },
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON request body." });
  }

  if (mongoose.connection.readyState !== 1 && error instanceof mongoose.Error) {
    return res.status(503).json({ message: "Database connection is not active." });
  }

  console.error("Unhandled API error:", error);
  return res.status(500).json({ message: "Server error." });
}

export default errorHandler;
