import express from "express";
import * as grupaController from "../controllers/grupaController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { groupWriteRules } from "../middleware/validationRules.js";

const router = express.Router();

router.use(authenticate("admin", "vaspitac"));
router.get("/", grupaController.getGrupa);
router.get("/:id", grupaController.getGrupaById);
router.post("/", authenticate("admin"), validateBody(groupWriteRules), grupaController.createGrupa);
router.put("/:id", authenticate("admin"), validateBody(groupWriteRules), grupaController.updateGrupa);
router.delete("/:id", authenticate("admin"), grupaController.deleteGrupa);

export default router;
