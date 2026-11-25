import express from "express";
import * as starateljController from "../controllers/starateljController.js";
import * as enrollmentController from "../controllers/enrollmentController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { enrollmentRequestRules } from "../middleware/validationRules.js";

const router = express.Router();

router.use(authenticate("staratelj"));
router.get("/zahtjevi", enrollmentController.getMyRequests);
router.post(
  "/zahtjevi",
  validateBody(enrollmentRequestRules),
  enrollmentController.submitRequest,
);
router.get("/me", starateljController.mojiPodaci);
router.get("/djeca", starateljController.mojaDjeca);
router.get("/djeca/:id", starateljController.mojeDijete);

export default router;
