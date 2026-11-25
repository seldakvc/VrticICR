import Grupa from "../models/Grupa.js";
import Dijete from "../models/Dijete.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "../utils/ApiError.js";
import { getObjectId } from "../utils/objectId.js";
import assignEducatorToGroup from "../utils/assignEducatorToGroup.js";

async function getGrupa(req, res) {
  const query = req.auth.role === "vaspitac"
    ? {
      $or: [
        { vaspitac_id: req.auth.user._id },
        { _id: req.auth.user.grupa_id },
      ],
    }
    : {};
  return res.json(await Grupa.find(query).populate("vaspitac"));
}

async function getGrupaById(req, res) {
  const id = getObjectId(req.params.id);
  if (!id) throw new ApiError(404, "Grupa not found");
  const query = req.auth.role === "vaspitac"
    ? {
      _id: id,
      $or: [
        { vaspitac_id: req.auth.user._id },
        { _id: req.auth.user.grupa_id },
      ],
    }
    : { _id: id };
  const grupa = await Grupa.findOne(query).populate("vaspitac");
  if (!grupa) throw new ApiError(404, "Grupa not found");
  return res.json(grupa);
}

async function createGrupa(req, res) {
  const { vaspitac_id: vaspitacId, ...fields } = req.body;
  const grupa = await Grupa.create(fields);
  if (vaspitacId) await assignEducatorToGroup(grupa, vaspitacId);
  return res.status(201).json(await grupa.populate("vaspitac"));
}

async function updateGrupa(req, res) {
  const id = getObjectId(req.params.id);
  const grupa = id ? await Grupa.findById(id) : null;
  if (!grupa) {
    throw new ApiError(404, "Grupa not found");
  }

  const { vaspitac_id: vaspitacId, ...fields } = req.body;
  grupa.set(fields);
  await grupa.save();
  if (Object.prototype.hasOwnProperty.call(req.body, "vaspitac_id")) {
    await assignEducatorToGroup(grupa, vaspitacId);
  }
  return res.json(await grupa.populate("vaspitac"));
}

async function deleteGrupa(req, res) {
  const id = getObjectId(req.params.id);
  const grupa = id ? await Grupa.findById(id) : null;
  if (!grupa) {
    throw new ApiError(404, "Grupa not found");
  }

  await Vaspitac.updateOne(
    { _id: grupa.vaspitac_id, grupa_id: grupa._id },
    { $set: { grupa_id: null } },
  );
  await Dijete.updateMany({ grupa_id: grupa._id }, { $set: { grupa_id: null } });
  await grupa.deleteOne();
  return res.json({ message: "Grupa deleted successfully" });
}

export { createGrupa, deleteGrupa, getGrupa, getGrupaById, updateGrupa };
