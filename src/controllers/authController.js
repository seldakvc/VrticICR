import Grupa from "../models/Grupa.js";
import Staratelj from "../models/Staratelj.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/passwords.js";
import { assertTokenConfiguration, createToken } from "../utils/tokens.js";
import assignEducatorToGroup from "../utils/assignEducatorToGroup.js";

async function createVaspitac(req, res) {
  assertTokenConfiguration();
  const vaspitac = await Vaspitac.create({
    ime: req.body.ime,
    prezime: req.body.prezime,
    grupa_id: req.body.grupa_id || null,
    username: req.body.username,
    password: await hashPassword(req.body.password),
    uloga: "vaspitac",
  });

  if (vaspitac.grupa_id) {
    const grupa = await Grupa.findById(vaspitac.grupa_id);
    if (!grupa) {
      await vaspitac.deleteOne();
      throw new ApiError(422, "The selected group does not exist.");
    }
    await assignEducatorToGroup(grupa, vaspitac._id);
  }

  return res.status(201).json(vaspitac);
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
    uloga: "staratelj",
  });
  const token = createToken(staratelj, "staratelj");

  return res.status(201).json({
    staratelj: {
      staratelj_id: staratelj._id.toString(),
      username: staratelj.username,
    },
    role: "staratelj",
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
    role: "staratelj",
    token: createToken(staratelj, "staratelj"),
  });
}

async function loginVaspitac(req, res) {
  const vaspitac = await Vaspitac.findOne({ username: req.body.username }).select("+password");
  if (!vaspitac || vaspitac.uloga === "admin"
    || !await comparePassword(req.body.password, vaspitac.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    vaspitac: {
      vaspitac_id: vaspitac._id.toString(),
      ime: vaspitac.ime,
      prezime: vaspitac.prezime,
      username: vaspitac.username,
      grupa_id: vaspitac.grupa_id ? vaspitac.grupa_id.toString() : null,
      uloga: vaspitac.uloga || "vaspitac",
    },
    role: vaspitac.uloga || "vaspitac",
    token: createToken(vaspitac, vaspitac.uloga || "vaspitac"),
  });
}

async function loginAdmin(req, res) {
  const admin = await Vaspitac.findOne({
    username: req.body.username,
    uloga: "admin",
  }).select("+password");

  if (!admin || !await comparePassword(req.body.password, admin.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    admin: {
      admin_id: admin._id.toString(),
      username: admin.username,
    },
    role: "admin",
    token: createToken(admin, "admin"),
  });
}

export {
  createVaspitac,
  loginAdmin,
  loginStaratelj,
  loginVaspitac,
  registerStaratelj,
};
