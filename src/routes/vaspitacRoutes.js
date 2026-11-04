import express from "express";
import * as vaspitacController from "../controllers/vaspitacController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", vaspitacController.getVaspitaca);
router.get("/me", authenticate("vaspitac"), vaspitacController.mojiPodaci);
router.get("/grupa-djeca", authenticate("vaspitac"), vaspitacController.mojaGrupaDjeca);
router.get("/:id", authenticate("vaspitac"), vaspitacController.getVaspitacById);
router.put("/:id", authenticate("vaspitac"), vaspitacController.updateVaspitac);
router.delete("/:id", authenticate("vaspitac"), vaspitacController.deleteVaspitac);

export default router;
