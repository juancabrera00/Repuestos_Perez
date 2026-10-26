import express from "express";
import cors from "cors";
import repuestosRoutes from "./routes/repuestos.routes.js";
import solicitudesRoutes from "./routes/solicitudes.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { pool } from "./config/database.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/repuestos", repuestosRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      message: "No fue posible consultar la base de datos.",
    });
  }
});
app.use(notFound);
app.use(errorHandler);

export default app;
