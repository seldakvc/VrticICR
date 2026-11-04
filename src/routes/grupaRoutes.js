import express from "express";
import * as grupaController from "../controllers/grupaController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate("vaspitac"));
router.get("/", grupaController.getGrupa);
router.get("/:id", grupaController.getGrupaById);
router.post("/", grupaController.createGrupa);
router.put("/:id", grupaController.updateGrupa);
router.delete("/:id", grupaController.deleteGrupa);

export default router;
