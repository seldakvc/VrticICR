import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import apiRoutes from "./routes/apiRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import normalizeInput from "./middleware/normalizeInput.js";
import swaggerSpec from "./config/swagger.js";

const app = express();

app.use("/api", cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(normalizeInput);

app.get("/", (req, res) => {
  res.json({ message: "Vrtic backend API" });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Too Many Attempts." },
  }),
  apiRoutes,
);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta nije pronađena." });
});

app.use(errorHandler);

export default app;
