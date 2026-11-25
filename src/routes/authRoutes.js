import express from "express";
import * as authController from "../controllers/authController.js";
import validateBody from "../middleware/validateBody.js";
import {
  guardianRegistrationRules,
  loginRules,
} from "../middleware/validationRules.js";

const router = express.Router();

router.post("/vaspitac/login", validateBody(loginRules), authController.loginVaspitac);
router.post("/admin/login", validateBody(loginRules), authController.loginAdmin);
router.post(
  "/staratelj/register",
  validateBody(guardianRegistrationRules),
  authController.registerStaratelj,
);
router.post("/staratelj/login", validateBody(loginRules), authController.loginStaratelj);

export default router;
