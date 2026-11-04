import express from "express";
import * as starateljController from "../controllers/starateljController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate("staratelj"));
router.get("/me", starateljController.mojiPodaci);
router.get("/djeca", starateljController.mojaDjeca);
router.get("/djeca/:id", starateljController.mojeDijete);

export default router;
