import Grupa from "../models/Grupa.js";
import ApiError from "../utils/ApiError.js";
import { getObjectId } from "../utils/objectId.js";

async function getGrupa(req, res) {
  return res.json(await Grupa.find());
}

async function getGrupaById(req, res) {
  const id = getObjectId(req.params.id);
  return res.json(id ? await Grupa.findById(id) : null);
}

async function createGrupa(req, res) {
  return res.status(201).json(await Grupa.create(req.body));
}

async function updateGrupa(req, res) {
  const id = getObjectId(req.params.id);
  const grupa = id ? await Grupa.findById(id) : null;
  if (!grupa) {
    throw new ApiError(404, "Grupa not found");
  }

  grupa.set(req.body);
  await grupa.save();
  return res.json(grupa);
}

async function deleteGrupa(req, res) {
  const id = getObjectId(req.params.id);
  const grupa = id ? await Grupa.findById(id) : null;
  if (!grupa) {
    throw new ApiError(404, "Grupa not found");
  }

  await grupa.deleteOne();
  return res.json({ message: "Grupa deleted successfully" });
}

export { createGrupa, deleteGrupa, getGrupa, getGrupaById, updateGrupa };
