import express from "express";
import * as enrollmentController from "../controllers/enrollmentController.js";
import authenticate from "../middleware/authenticate.js";
import validateBody from "../middleware/validateBody.js";
import { enrollmentReviewRules } from "../middleware/validationRules.js";

const router = express.Router();

router.use(authenticate("admin"));
router.get("/", enrollmentController.getRequests);
router.patch("/:id", validateBody(enrollmentReviewRules), enrollmentController.reviewRequest);

export default router;
