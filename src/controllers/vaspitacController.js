import Dijete from "../models/Dijete.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/passwords.js";
import { getObjectId } from "../utils/objectId.js";

async function getVaspitaca(req, res) {
  return res.json(await Vaspitac.find());
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
  return res.json(await Dijete.find({ grupa_id: grupaId }));
}

async function getVaspitacById(req, res) {
  const id = getObjectId(req.params.id);
  return res.json(id ? await Vaspitac.findById(id) : null);
}

async function updateVaspitac(req, res) {
  const id = getObjectId(req.params.id);
  const vaspitac = id ? await Vaspitac.findById(id) : null;
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
  const vaspitac = id ? await Vaspitac.findById(id) : null;
  if (!vaspitac) {
    throw new ApiError(404, "Vaspitac not found");
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
