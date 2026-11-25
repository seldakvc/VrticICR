import mongoose from "mongoose";
import Vaspitac from "../models/Vaspitac.js";
import { comparePassword, hashPassword } from "../utils/passwords.js";

const databaseConfig = {
  uri: process.env.MONGODB_URI,
};

function getConnectionFailureDetails(error) {
  const details = [];
  const topology = error?.reason?.type;
  if (typeof topology === "string") {
    details.push(`topology=${topology}`);
  }

  const driverCodes = new Set();
  const serverErrors = error?.reason?.servers;
  if (serverErrors && typeof serverErrors.values === "function") {
    for (const server of serverErrors.values()) {
      const cause = server?.error;
      const code = cause?.codeName || cause?.code || cause?.name;
      if (typeof code === "string" && /^[A-Za-z0-9_]+$/.test(code)) {
        driverCodes.add(code);
      }
    }
  }
  if (driverCodes.size) {
    details.push(`driver=${[...driverCodes].join(",")}`);
  }

  return details.length ? `; ${details.join("; ")}` : "";
}

export async function ensureAdminAccount() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 16 || password.length > 72) {
    throw new Error("ADMIN_PASSWORD must be between 16 and 72 characters.");
  }

  let admin = await Vaspitac.findOne({ username }).select("+password");

  if (!admin) {
    await Vaspitac.create({
      ime: "Admin",
      prezime: "Sistem",
      username,
      password: await hashPassword(password),
      uloga: "admin",
      status: 1,
    });
    return;
  }

  if (admin.uloga !== "admin") {
    throw new Error("ADMIN_USERNAME is already assigned to a non-admin account.");
  }

  if (!admin.password || !await comparePassword(password, admin.password)) {
    admin.password = await hashPassword(password);
    await admin.save();
  }
}

export async function connectToDatabase() {
  const uri = databaseConfig.uri?.trim();

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  console.info("Connecting to MongoDB...");
  try {
    await mongoose.connect(uri);
    console.info("MongoDB connection established.");
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(
      `MongoDB connection failed (${errorName})${getConnectionFailureDetails(error)}.`,
    );
    throw error;
  }
}

export default databaseConfig;
