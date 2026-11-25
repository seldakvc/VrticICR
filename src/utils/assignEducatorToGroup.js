import Grupa from "../models/Grupa.js";
import Vaspitac from "../models/Vaspitac.js";
import ApiError from "./ApiError.js";

async function assignEducatorToGroup(grupa, educatorId) {
  const previousEducatorId = grupa.vaspitac_id?.toString();
  const nextEducatorId = educatorId ? educatorId.toString() : null;

  if (previousEducatorId && previousEducatorId !== nextEducatorId) {
    await Vaspitac.updateOne(
      { _id: previousEducatorId, grupa_id: grupa._id },
      { $set: { grupa_id: null } },
    );
  }

  if (!nextEducatorId) {
    grupa.vaspitac_id = null;
    await grupa.save();
    return;
  }

  const vaspitac = await Vaspitac.findById(nextEducatorId);
  if (!vaspitac || vaspitac.uloga !== "vaspitac") {
    throw new ApiError(422, "The selected educator does not exist.");
  }

  const otherGroupId = vaspitac.grupa_id?.toString();
  if (otherGroupId && otherGroupId !== grupa._id.toString()) {
    const otherGroup = await Grupa.findById(otherGroupId);
    if (otherGroup?.vaspitac_id?.toString() === vaspitac._id.toString()) {
      otherGroup.vaspitac_id = null;
      await otherGroup.save();
    }
  }

  vaspitac.grupa_id = grupa._id;
  await vaspitac.save();
  grupa.vaspitac_id = vaspitac._id;
  await grupa.save();
}

export default assignEducatorToGroup;
