import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const starateljSchema = new mongoose.Schema(
  {
    ime: { type: String, maxlength: 255 },
    prezime: { type: String, maxlength: 255 },
    kontakt: { type: String, maxlength: 255 },
    adresa: { type: String, maxlength: 255 },
    status: Number,
    username: { type: String, maxlength: 255, unique: true },
    password: { type: String, minlength: 6, select: false },
  },
  {
    collection: "staratelj",
    id: false,
    timestamps: false,
    versionKey: false,
  },
);

applyJsonIdentity(starateljSchema, "staratelj_id");

const Staratelj = mongoose.models.Staratelj || mongoose.model("Staratelj", starateljSchema);

export default Staratelj;
