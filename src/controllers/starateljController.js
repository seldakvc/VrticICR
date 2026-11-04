import Dijete from "../models/Dijete.js";
import Staratelj from "../models/Staratelj.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/passwords.js";
import { getObjectId } from "../utils/objectId.js";

async function mojiPodaci(req, res) {
  return res.json(req.auth.user);
}

async function mojaDjeca(req, res) {
  return res.json(await Dijete.find({ staratelj_id: req.auth.user._id }));
}

async function mojeDijete(req, res) {
  const id = getObjectId(req.params.id);
  const dijete = id
    ? await Dijete.findOne({ _id: id, staratelj_id: req.auth.user._id })
    : null;
  if (!dijete) {
    throw new ApiError(404, "Not found");
  }
  return res.json(dijete);
}

async function getStarateljs(req, res) {
  return res.json(await Staratelj.find());
}

async function getStarateljById(req, res) {
  const id = getObjectId(req.params.id);
  return res.json(id ? await Staratelj.findById(id) : null);
}

async function createStaratelj(req, res) {
  const staratelj = await Staratelj.create({
    ...req.body,
    password: await hashPassword(req.body.password),
  });
  return res.status(201).json(staratelj);
}

async function updateStaratelj(req, res) {
  const id = getObjectId(req.params.id);
  const staratelj = id ? await Staratelj.findById(id) : null;
  if (!staratelj) {
    throw new ApiError(404, "Staratelj not found");
  }

  const updates = { ...req.body };
  if (updates.password !== undefined && updates.password !== null && updates.password !== "") {
    updates.password = await hashPassword(updates.password);
  } else {
    delete updates.password;
  }
  staratelj.set(updates);
  await staratelj.save();
  return res.json(staratelj);
}

async function deleteStaratelj(req, res) {
  const id = getObjectId(req.params.id);
  const staratelj = id ? await Staratelj.findById(id) : null;
  if (!staratelj) {
    throw new ApiError(404, "Staratelj not found");
  }

  await staratelj.deleteOne();
  return res.json({ message: "Staratelj deleted successfully" });
}

export {
  createStaratelj,
  deleteStaratelj,
  getStarateljById,
  getStarateljs,
  mojaDjeca,
  mojeDijete,
  mojiPodaci,
  updateStaratelj,
};
