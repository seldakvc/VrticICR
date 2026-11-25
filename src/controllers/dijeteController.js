import Dijete from "../models/Dijete.js";
import Aktivnost from "../models/Aktivnost.js";
import ApiError from "../utils/ApiError.js";
import { getObjectId } from "../utils/objectId.js";

function childScope(req) {
  if (req.auth.role === "admin") {
    return {};
  }
  if (req.auth.role === "vaspitac") {
    return req.auth.user.grupa_id
      ? {
        grupa_id: req.auth.user.grupa_id,
        upis_status: { $in: ["odobren", null] },
      }
      : { _id: { $exists: false } };
  }
  return {
    staratelj_id: req.auth.user._id,
    upis_status: { $in: ["odobren", null] },
  };
}

async function findAccessibleChild(req, id) {
  const child = await Dijete.findOne({ _id: id, ...childScope(req) });
  if (!child) {
    throw new ApiError(404, "Dijete not found");
  }
  return child;
}

async function getDijete(req, res) {
  return res.json(await Dijete.find(childScope(req)));
}

async function getDijeteById(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) {
    throw new ApiError(404, "Dijete not found");
  }
  return res.json(await findAccessibleChild(req, id));
}

async function updateDijete(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) {
    throw new ApiError(404, "Dijete not found");
  }
  const dijete = await Dijete.findById(id);
  if (!dijete) throw new ApiError(404, "Dijete not found");

  dijete.set(req.body);
  await dijete.save();
  return res.json(dijete);
}

async function deleteDijete(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) {
    throw new ApiError(404, "Dijete not found");
  }
  const dijete = await Dijete.findById(id);
  if (!dijete) throw new ApiError(404, "Dijete not found");

  await Aktivnost.deleteMany({ dijete_id: dijete._id });
  await dijete.deleteOne();
  return res.json({ message: "Dijete deleted successfully" });
}

async function createDijete(req, res) {
  return res.status(201).json(await Dijete.create({
    ...req.body,
    upis_status: "odobren",
    status: 1,
  }));
}

async function getAktivnosti(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) throw new ApiError(404, "Dijete not found");
  await findAccessibleChild(req, id);
  return res.json(await Aktivnost.find({ dijete_id: id }).sort({ datum: -1 }));
}

async function createAktivnost(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) throw new ApiError(404, "Dijete not found");
  const dijete = await findAccessibleChild(req, id);
  const aktivnost = await Aktivnost.create({
    ...req.body,
    dijete_id: dijete._id,
    vaspitac_id: req.auth.user._id,
  });
  return res.status(201).json(aktivnost);
}

async function updateAktivnost(req, res) {
  const id = getObjectId(req.params.id);
  const aktivnostId = getObjectId(req.params.aktivnostId);
  if (!id || !aktivnostId) throw new ApiError(404, "Aktivnost not found");
  await findAccessibleChild(req, id);
  const aktivnost = await Aktivnost.findOne({ _id: aktivnostId, dijete_id: id });
  if (!aktivnost) throw new ApiError(404, "Aktivnost not found");
  aktivnost.set(req.body);
  await aktivnost.save();
  return res.json(aktivnost);
}

async function deleteAktivnost(req, res) {
  const id = getObjectId(req.params.id);
  const aktivnostId = getObjectId(req.params.aktivnostId);
  if (!id || !aktivnostId) throw new ApiError(404, "Aktivnost not found");
  await findAccessibleChild(req, id);
  const aktivnost = await Aktivnost.findOne({ _id: aktivnostId, dijete_id: id });
  if (!aktivnost) throw new ApiError(404, "Aktivnost not found");
  await aktivnost.deleteOne();
  return res.json({ message: "Aktivnost deleted successfully" });
}

export {
  createAktivnost,
  createDijete,
  childScope,
  deleteAktivnost,
  deleteDijete,
  findAccessibleChild,
  getAktivnosti,
  getDijete,
  getDijeteById,
  updateAktivnost,
  updateDijete,
};
