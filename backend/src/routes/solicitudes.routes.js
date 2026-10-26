import { Router } from "express";
import { crear, listar } from "../controllers/solicitudes.controller.js";
import { validarSolicitud } from "../middlewares/validarSolicitud.js";

const router = Router();

router.get("/", listar);
router.post("/", validarSolicitud, crear);

export default router;
