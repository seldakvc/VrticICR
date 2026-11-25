import mongoose from "mongoose";
import applyJsonIdentity from "./schemaOptions.js";

const zahtjevUpisaSchema = new mongoose.Schema(
  {
    ime: { type: String, required: true, maxlength: 255 },
    prezime: { type: String, required: true, maxlength: 255 },
    datum_rodjenja: { type: Date, required: true },
    pol: String,
    adresa: { type: String, required: true, maxlength: 500 },
    zdravstvene_napomene: { type: String, maxlength: 2000 },
    kontakt_roditelja: { type: String, required: true, maxlength: 255 },
    staratelj_id: { type: mongoose.Schema.Types.ObjectId, ref: "Staratelj", required: true },
    status: {
      type: String,
      enum: ["na_cekanju", "odobren", "odbijen"],
      default: "na_cekanju",
    },
    grupa_id: { type: mongoose.Schema.Types.ObjectId, ref: "Grupa", default: null },
    dijete_id: { type: mongoose.Schema.Types.ObjectId, ref: "Dijete", default: null },
    razlog_odbijanja: { type: String, maxlength: 1000 },
    pregledao_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vaspitac", default: null },
    pregledan_at: Date,
  },
  {
    collection: "zahtjev_upisa",
    timestamps: true,
    versionKey: false,
  },
);

applyJsonIdentity(zahtjevUpisaSchema, "zahtjev_upisa_id");

const ZahtjevUpisa = mongoose.models.ZahtjevUpisa
  || mongoose.model("ZahtjevUpisa", zahtjevUpisaSchema);

export default ZahtjevUpisa;
