import express from "express";
import authRoutes from "./authRoutes.js";
import dijeteRoutes from "./dijeteRoutes.js";
import grupaRoutes from "./grupaRoutes.js";
import requireDatabase from "../middleware/requireDatabase.js";
import starateljRoutes from "./starateljRoutes.js";
import starateljiRoutes from "./starateljiRoutes.js";
import upisiRoutes from "./upisiRoutes.js";
import vaspitacRoutes from "./vaspitacRoutes.js";

const router = express.Router();

router.use(requireDatabase);
router.use("/", authRoutes);
router.use("/dijete", dijeteRoutes);
router.use("/grupa", grupaRoutes);
router.use("/staratelj", starateljRoutes);
router.use("/staratelji", starateljiRoutes);
router.use("/upisi", upisiRoutes);
router.use("/vaspitac", vaspitacRoutes);

export default router;
