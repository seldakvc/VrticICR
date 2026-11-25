import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const { Schema } = mongoose;

const dijeteSchema = new Schema(
  {
    ime: String,
    prezime: String,
    datum_rodjenja: Schema.Types.Mixed,
    pol: Schema.Types.Mixed,
    adresa: String,
    zdravstvene_napomene: String,
    staratelj_id: { type: Schema.Types.ObjectId, ref: "Staratelj" },
    grupa_id: { type: Schema.Types.ObjectId, ref: "Grupa", default: null },
    upis_status: {
      type: String,
      enum: ["na_cekanju", "odobren", "odbijen"],
      default: "odobren",
    },
    zahtjev_upisa_id: { type: Schema.Types.ObjectId, ref: "ZahtjevUpisa" },
    prisustvo: Schema.Types.Mixed,
    status: Schema.Types.Mixed,
  },
  {
    collection: "dijete",
    id: false,
    timestamps: false,
    versionKey: false,
  },
);

dijeteSchema.index({ zahtjev_upisa_id: 1 }, { unique: true, sparse: true });

applyJsonIdentity(dijeteSchema, "dijete_id");

const Dijete = mongoose.models.Dijete || mongoose.model("Dijete", dijeteSchema);

export default Dijete;
