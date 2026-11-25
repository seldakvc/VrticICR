import express from "express";
import * as dijeteController from "../controllers/dijeteController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { activityWriteRules, childAdminCreateRules } from "../middleware/validationRules.js";

const router = express.Router();

router.get("/", authenticate("admin", "vaspitac", "staratelj"), dijeteController.getDijete);
router.post("/", authenticate("admin"), validateBody(childAdminCreateRules), dijeteController.createDijete);
router.get("/:id/aktivnosti", authenticate("admin", "vaspitac", "staratelj"), dijeteController.getAktivnosti);
router.post(
  "/:id/aktivnosti",
  authenticate("admin", "vaspitac"),
  validateBody(activityWriteRules),
  dijeteController.createAktivnost,
);
router.put(
  "/:id/aktivnosti/:aktivnostId",
  authenticate("admin", "vaspitac"),
  validateBody(activityWriteRules),
  dijeteController.updateAktivnost,
);
router.delete("/:id/aktivnosti/:aktivnostId", authenticate("admin"), dijeteController.deleteAktivnost);
router.get("/:id", authenticate("admin", "vaspitac", "staratelj"), dijeteController.getDijeteById);
router.put("/:id", authenticate("admin"), dijeteController.updateDijete);
router.delete("/:id", authenticate("admin"), dijeteController.deleteDijete);

export default router;
