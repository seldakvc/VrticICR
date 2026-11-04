import mongoose from "mongoose";

function isObjectId(value) {
  return typeof value === "string"
    && /^[a-fA-F0-9]{24}$/.test(value)
    && mongoose.isValidObjectId(value);
}

function getObjectId(value) {
  return isObjectId(value) ? value : null;
}

export { getObjectId, isObjectId };
