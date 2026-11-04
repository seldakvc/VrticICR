import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const { Schema } = mongoose;

const vaspitacSchema = new Schema(
  {
    ime: { type: String, maxlength: 255 },
    prezime: { type: String, maxlength: 255 },
    statuss: { type: String, default: "radi" },
    grupa_id: { type: Schema.Types.ObjectId, ref: "Grupa", default: null },
    username: { type: String, maxlength: 255, unique: true },
    password: { type: String, minlength: 6, select: false },
    status: { type: Number, default: 1 },
    uloga: { type: String, enum: ["vaspitac", "admin"], default: "vaspitac" },
  },
  {
    collection: "vaspitac",
    id: false,
    timestamps: false,
    versionKey: false,
  },
);

vaspitacSchema.virtual("grupa", {
  ref: "Grupa",
  localField: "grupa_id",
  foreignField: "_id",
  justOne: true,
});

applyJsonIdentity(vaspitacSchema, "vaspitac_id");

const Vaspitac = mongoose.models.Vaspitac || mongoose.model("Vaspitac", vaspitacSchema);

export default Vaspitac;
