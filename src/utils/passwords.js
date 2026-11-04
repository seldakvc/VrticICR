import bcrypt from "bcryptjs";
import ApiError from "./ApiError.js";

function getRounds() {
  const rounds = Number(process.env.BCRYPT_ROUNDS || 10);
  if (!Number.isInteger(rounds) || rounds < 4 || rounds > 31) {
    throw new ApiError(500, "BCRYPT_ROUNDS must be an integer between 4 and 31.");
  }
  return rounds;
}

async function hashPassword(password) {
  return bcrypt.hash(password, getRounds());
}

function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export { comparePassword, hashPassword };
