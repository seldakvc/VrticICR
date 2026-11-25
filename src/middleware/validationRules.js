import Grupa from "../models/Grupa.js";
import Staratelj from "../models/Staratelj.js";
import Vaspitac from "../models/Vaspitac.js";

const educatorRegistrationRules = {
  ime: { required: true, type: "string", max: 255 },
  prezime: { required: true, type: "string", max: 255 },
  grupa_id: { nullable: true, type: "objectId", exists: Grupa },
  username: { required: true, type: "string", max: 255, unique: "username", model: Vaspitac },
  password: { required: true, type: "string", min: 6 },
};

const guardianRegistrationRules = {
  ime: { required: true, type: "string", max: 255 },
  prezime: { required: true, type: "string", max: 255 },
  kontakt: { nullable: true, type: "string", max: 255 },
  adresa: { nullable: true, type: "string", max: 255 },
  status: { nullable: true, type: "integer" },
  username: { required: true, type: "string", max: 255, unique: "username", model: Staratelj },
  password: { required: true, type: "string", min: 6 },
};

const loginRules = {
  username: { required: true, type: "string" },
  password: { required: true, type: "string" },
};

const enrollmentRequestRules = {
  ime: { required: true, type: "string", max: 255 },
  prezime: { required: true, type: "string", max: 255 },
  datum_rodjenja: { required: true, type: "date" },
  pol: { nullable: true, type: "string", max: 100 },
  adresa: { required: true, type: "string", max: 500 },
  zdravstvene_napomene: { nullable: true, type: "string", max: 2000 },
  kontakt_roditelja: { required: true, type: "string", max: 255 },
};

const enrollmentReviewRules = {
  status: { required: true, type: "string", values: ["odobren", "odbijen"] },
  grupa_id: { nullable: true, type: "objectId", exists: Grupa },
  razlog_odbijanja: { nullable: true, type: "string", max: 1000 },
};

const childAdminCreateRules = {
  ime: { required: true, type: "string", max: 255 },
  prezime: { required: true, type: "string", max: 255 },
  datum_rodjenja: { required: true, type: "date" },
  pol: { nullable: true, type: "string", max: 100 },
  adresa: { nullable: true, type: "string", max: 500 },
  zdravstvene_napomene: { nullable: true, type: "string", max: 2000 },
  staratelj_id: { required: true, type: "objectId", exists: Staratelj },
  grupa_id: { required: true, type: "objectId", exists: Grupa },
};

const groupWriteRules = {
  naziv_grupe: { required: true, type: "string", max: 255 },
  uzrast: { nullable: true, type: "string", max: 100 },
  max_br_clanova: { nullable: true, type: "integer" },
  status: { nullable: true, type: "integer" },
  vaspitac_id: { nullable: true, type: "objectId", exists: Vaspitac },
};

const activityWriteRules = {
  datum: { required: true, type: "date" },
  dnevne_aktivnosti: { nullable: true, type: "string", max: 4000 },
  napredak: { nullable: true, type: "string", max: 4000 },
  napomene: { nullable: true, type: "string", max: 4000 },
  prisustvo: { nullable: true, type: "string", values: ["prisutan", "odsutan", "opravdano"] },
};

export {
  activityWriteRules,
  childAdminCreateRules,
  educatorRegistrationRules,
  enrollmentRequestRules,
  enrollmentReviewRules,
  groupWriteRules,
  guardianRegistrationRules,
  loginRules,
};
