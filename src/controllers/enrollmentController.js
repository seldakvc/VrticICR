import Dijete from "../models/Dijete.js";
import Grupa from "../models/Grupa.js";
import ZahtjevUpisa from "../models/ZahtjevUpisa.js";
import ApiError from "../utils/ApiError.js";
import { getObjectId } from "../utils/objectId.js";

async function submitRequest(req, res) {
  const pendingRequest = await ZahtjevUpisa.exists({
    staratelj_id: req.auth.user._id,
    ime: req.body.ime,
    prezime: req.body.prezime,
    datum_rodjenja: req.body.datum_rodjenja,
    status: "na_cekanju",
  });
  if (pendingRequest) {
    throw new ApiError(409, "A pending enrollment request already exists for this child.");
  }

  const request = await ZahtjevUpisa.create({
    ...req.body,
    staratelj_id: req.auth.user._id,
  });
  return res.status(201).json(request);
}

async function getMyRequests(req, res) {
  return res.json(await ZahtjevUpisa.find({ staratelj_id: req.auth.user._id }).sort({ createdAt: -1 }));
}

async function getRequests(req, res) {
  const query = {};
  if (["na_cekanju", "odobren", "odbijen"].includes(req.query.status)) {
    query.status = req.query.status;
  }
  return res.json(await ZahtjevUpisa.find(query).sort({ createdAt: -1 }));
}

async function reviewRequest(req, res) {
  const id = getObjectId(req.params.id);
  const request = id ? await ZahtjevUpisa.findById(id) : null;
  if (!request) {
    throw new ApiError(404, "Enrollment request not found.");
  }
  if (request.status !== "na_cekanju") {
    throw new ApiError(409, "Only pending enrollment requests can be reviewed.");
  }

  if (req.body.status === "odobren") {
    if (!req.body.grupa_id) {
      throw new ApiError(422, "A group must be assigned when approving an enrollment request.", {
        grupa_id: ["The grupa_id field is required when approving a request."],
      });
    }

    const grupa = await Grupa.findById(req.body.grupa_id);
    if (!grupa) {
      throw new ApiError(422, "The selected group does not exist.");
    }

    let child = await Dijete.findOne({ zahtjev_upisa_id: request._id });
    if (!child) {
      child = await Dijete.create({
        ime: request.ime,
        prezime: request.prezime,
        datum_rodjenja: request.datum_rodjenja,
        pol: request.pol,
        adresa: request.adresa,
        zdravstvene_napomene: request.zdravstvene_napomene,
        staratelj_id: request.staratelj_id,
        grupa_id: grupa._id,
        upis_status: "odobren",
        zahtjev_upisa_id: request._id,
        status: 1,
      });
    } else {
      child.grupa_id = grupa._id;
      child.upis_status = "odobren";
      await child.save();
    }
    request.dijete_id = child._id;
    request.grupa_id = grupa._id;
    request.status = "odobren";
    request.razlog_odbijanja = undefined;
  } else {
    request.status = "odbijen";
    request.grupa_id = null;
    request.razlog_odbijanja = req.body.razlog_odbijanja || undefined;
  }

  request.pregledao_id = req.auth.user._id;
  request.pregledan_at = new Date();
  await request.save();
  return res.json(request);
}

export { getMyRequests, getRequests, reviewRequest, submitRequest };
