import express from "express";
import * as dijeteController from "../controllers/dijeteController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/", authenticate("vaspitac"), dijeteController.getDijete);
router.post("/", authenticate("vaspitac", "staratelj"), dijeteController.createDijete);
router.get("/:id", authenticate("vaspitac"), dijeteController.getDijeteById);
router.put("/:id", authenticate("vaspitac"), dijeteController.updateDijete);
router.delete("/:id", authenticate("vaspitac"), dijeteController.deleteDijete);

export default router;
