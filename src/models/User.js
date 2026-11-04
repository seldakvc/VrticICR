import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    email_verified_at: Date,
    password: { type: String, select: false },
    remember_token: { type: String, select: false },
  },
  {
    collection: "users",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    id: false,
    versionKey: false,
  },
);

applyJsonIdentity(userSchema, "id");

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
