import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const grupaSchema = new mongoose.Schema(
  {
    naziv_grupe: String,
    uzrast: mongoose.Schema.Types.Mixed,
    max_br_clanova: mongoose.Schema.Types.Mixed,
    status: mongoose.Schema.Types.Mixed,
    vaspitac_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vaspitac", default: null },
  },
  {
    collection: "grupa",
    id: false,
    timestamps: false,
    versionKey: false,
  },
);

applyJsonIdentity(grupaSchema, "grupa_id");

grupaSchema.virtual("vaspitac", {
  ref: "Vaspitac",
  localField: "vaspitac_id",
  foreignField: "_id",
  justOne: true,
});

const Grupa = mongoose.models.Grupa || mongoose.model("Grupa", grupaSchema);

export default Grupa;
