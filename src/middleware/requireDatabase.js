import mongoose from "mongoose";
import ApiError from "../utils/ApiError.js";

function requireDatabase(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    return next(new ApiError(503, "Database connection is not active."));
  }
  return next();
}

export default requireDatabase;
