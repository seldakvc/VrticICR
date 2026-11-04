import Grupa from "../models/Grupa.js";
import Staratelj from "../models/Staratelj.js";
import Vaspitac from "../models/Vaspitac.js";

const educatorRegistrationRules = {
  ime: { required: true, type: "string", max: 255 },
  prezime: { required: true, type: "string", max: 255 },
  grupa_id: { required: true, type: "objectId", exists: Grupa },
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

export {
  educatorRegistrationRules,
  guardianRegistrationRules,
  loginRules,
};
