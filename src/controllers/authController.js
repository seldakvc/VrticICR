import Staratelj from "../models/Staratelj.js";
import Vaspitac from "../models/Vaspitac.js";
import { hashPassword, comparePassword } from "../utils/passwords.js";
import RegistrationError from "../utils/RegistrationError.js";
import { assertTokenConfiguration, createToken } from "../utils/tokens.js";

async function registerVaspitac(req, res) {
  try {
    assertTokenConfiguration();
    const vaspitac = await Vaspitac.create({
      ime: req.body.ime,
      prezime: req.body.prezime,
      grupa_id: req.body.grupa_id,
      username: req.body.username,
      password: await hashPassword(req.body.password),
    });
    const token = createToken(vaspitac, "vaspitac");

    return res.status(201).json({
      vaspitac: {
        vaspitac_id: vaspitac._id.toString(),
        ime: vaspitac.ime,
        prezime: vaspitac.prezime,
        statuss: vaspitac.statuss,
        grupa_id: vaspitac.grupa_id.toString(),
        username: vaspitac.username,
        uloga: vaspitac.uloga,
      },
      role: vaspitac.uloga,
      token,
    });
  } catch (error) {
    throw new RegistrationError(error.message);
  }
}

async function registerStaratelj(req, res) {
  assertTokenConfiguration();
  const staratelj = await Staratelj.create({
    ime: req.body.ime,
    prezime: req.body.prezime,
    kontakt: req.body.kontakt,
    adresa: req.body.adresa,
    status: req.body.status === undefined ? 1 : req.body.status,
    username: req.body.username,
    password: await hashPassword(req.body.password),
  });
  const token = createToken(staratelj, "staratelj");

  return res.status(201).json({
    staratelj: {
      staratelj_id: staratelj._id.toString(),
      username: staratelj.username,
    },
    token,
  });
}

async function loginStaratelj(req, res) {
  const staratelj = await Staratelj.findOne({ username: req.body.username }).select("+password");
  if (!staratelj || !await comparePassword(req.body.password, staratelj.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    staratelj: {
      staratelj_id: staratelj._id.toString(),
      username: staratelj.username,
    },
    token: createToken(staratelj, "staratelj"),
  });
}

async function loginVaspitac(req, res) {
  const vaspitac = await Vaspitac.findOne({ username: req.body.username }).select("+password");
  if (!vaspitac || !await comparePassword(req.body.password, vaspitac.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    vaspitac: {
      vaspitac_id: vaspitac._id.toString(),
      ime: vaspitac.ime,
      prezime: vaspitac.prezime,
      username: vaspitac.username,
      grupa_id: vaspitac.grupa_id ? vaspitac.grupa_id.toString() : null,
      uloga: vaspitac.uloga,
    },
    role: vaspitac.uloga,
    token: createToken(vaspitac, "vaspitac"),
  });
}

export {
  loginStaratelj,
  loginVaspitac,
  registerStaratelj,
  registerVaspitac,
};
