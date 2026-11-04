import Dijete from "../models/Dijete.js";
import ApiError from "../utils/ApiError.js";
import { getObjectId } from "../utils/objectId.js";

async function getDijete(req, res) {
  return res.json(await Dijete.find());
}

async function getDijeteById(req, res) {
  const id = getObjectId(req.params.id);
  return res.json(id ? await Dijete.findById(id) : null);
}

async function updateDijete(req, res) {
  const id = getObjectId(req.params.id);
  const dijete = id ? await Dijete.findById(id) : null;
  if (!dijete) {
    throw new ApiError(404, "Dijete not found");
  }

  dijete.set(req.body);
  await dijete.save();
  return res.json(dijete);
}

async function deleteDijete(req, res) {
  const id = getObjectId(req.params.id);
  const dijete = id ? await Dijete.findById(id) : null;
  if (!dijete) {
    throw new ApiError(404, "Dijete not found");
  }

  await dijete.deleteOne();
  return res.json({ message: "Dijete deleted successfully" });
}

async function createDijete(req, res) {
  return res.status(201).json(await Dijete.create(req.body));
}

export {
  createDijete,
  deleteDijete,
  getDijete,
  getDijeteById,
  updateDijete,
};
