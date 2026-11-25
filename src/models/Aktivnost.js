import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const aktivnostSchema = new mongoose.Schema(
  {
    dijete_id: { type: mongoose.Schema.Types.ObjectId, ref: "Dijete", required: true },
    vaspitac_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vaspitac", required: true },
    datum: { type: Date, required: true },
    dnevne_aktivnosti: { type: String, maxlength: 4000 },
    napredak: { type: String, maxlength: 4000 },
    napomene: { type: String, maxlength: 4000 },
    prisustvo: { type: String, enum: ["prisutan", "odsutan", "opravdano"] },
  },
  {
    collection: "aktivnost",
    timestamps: true,
    versionKey: false,
  },
);

applyJsonIdentity(aktivnostSchema, "aktivnost_id");

const Aktivnost = mongoose.models.Aktivnost || mongoose.model("Aktivnost", aktivnostSchema);

export default Aktivnost;
