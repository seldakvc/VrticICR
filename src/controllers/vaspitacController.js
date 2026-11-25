import Dijete from "../models/Dijete.js";
import Grupa from "../models/Grupa.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/passwords.js";
import { getObjectId } from "../utils/objectId.js";

async function getVaspitaca(req, res) {
  return res.json(await Vaspitac.find({ uloga: { $in: ["vaspitac", null] } }));
}

async function mojiPodaci(req, res) {
  const vaspitac = await Vaspitac.findById(req.auth.user._id).populate("grupa");
  return res.json(vaspitac);
}

async function mojaGrupaDjeca(req, res) {
  const grupaId = req.auth.user.grupa_id;
  if (!grupaId) {
    return res.json([]);
  }
  return res.json(await Dijete.find({
    grupa_id: grupaId,
    upis_status: { $in: ["odobren", null] },
  }));
}

async function getVaspitacById(req, res) {
  const id = getObjectId(req.params.id);
  return res.json(id
    ? await Vaspitac.findOne({ _id: id, uloga: { $in: ["vaspitac", null] } })
    : null);
}

async function updateVaspitac(req, res) {
  if (Object.prototype.hasOwnProperty.call(req.body, "grupa_id")
    || Object.prototype.hasOwnProperty.call(req.body, "uloga")) {
    throw new ApiError(422, "Assign educators to groups using the group endpoint; roles cannot be changed here.");
  }
  const id = getObjectId(req.params.id);
  const vaspitac = id
    ? await Vaspitac.findOne({ _id: id, uloga: { $in: ["vaspitac", null] } })
    : null;
  if (!vaspitac) {
    throw new ApiError(404, "Vaspitac not found");
  }

  const updates = { ...req.body };
  if (updates.password !== undefined && updates.password !== null && updates.password !== "") {
    updates.password = await hashPassword(updates.password);
  }
  vaspitac.set(updates);
  await vaspitac.save();
  return res.json(vaspitac);
}

async function deleteVaspitac(req, res) {
  const id = getObjectId(req.params.id);
  const vaspitac = id
    ? await Vaspitac.findOne({ _id: id, uloga: { $in: ["vaspitac", null] } })
    : null;
  if (!vaspitac) {
    throw new ApiError(404, "Vaspitac not found");
  }

  if (vaspitac.grupa_id) {
    await Grupa.updateOne(
      { _id: vaspitac.grupa_id, vaspitac_id: vaspitac._id },
      { $set: { vaspitac_id: null } },
    );
  }
  await vaspitac.deleteOne();
  return res.json({ message: "Vaspitac deleted successfully" });
}

export {
  deleteVaspitac,
  getVaspitacById,
  getVaspitaca,
  mojaGrupaDjeca,
  mojiPodaci,
  updateVaspitac,
};
