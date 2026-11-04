import express from "express";
import * as starateljController from "../controllers/starateljController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { guardianRegistrationRules } from "../middleware/validationRules.js";

const router = express.Router();

router.use(authenticate("vaspitac"));
router.get("/", starateljController.getStarateljs);
router.get("/:id", starateljController.getStarateljById);
router.post("/", validateBody(guardianRegistrationRules), starateljController.createStaratelj);
router.put("/:id", starateljController.updateStaratelj);
router.delete("/:id", starateljController.deleteStaratelj);

export default router;
