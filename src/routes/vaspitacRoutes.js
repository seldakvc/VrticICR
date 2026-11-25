import express from "express";
import * as authController from "../controllers/authController.js";
import * as vaspitacController from "../controllers/vaspitacController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { educatorRegistrationRules } from "../middleware/validationRules.js";

const router = express.Router();

router.get("/", authenticate("admin"), vaspitacController.getVaspitaca);
router.post("/", authenticate("admin"), validateBody(educatorRegistrationRules), authController.createVaspitac);
router.get("/me", authenticate("vaspitac"), vaspitacController.mojiPodaci);
router.get("/grupa-djeca", authenticate("vaspitac"), vaspitacController.mojaGrupaDjeca);
router.get("/:id", authenticate("admin"), vaspitacController.getVaspitacById);
router.put("/:id", authenticate("admin"), vaspitacController.updateVaspitac);
router.delete("/:id", authenticate("admin"), vaspitacController.deleteVaspitac);

export default router;
