import { Router } from "express";
import {
  actualizar,
  crear,
  eliminar,
  listar,
  obtener,
} from "../controllers/repuestos.controller.js";
import { validarId } from "../middlewares/validarId.js";
import { validarRepuesto } from "../middlewares/validarRepuesto.js";

const router = Router();

router.get("/", listar);
router.get("/:id", validarId, obtener);
router.post("/", validarRepuesto, crear);
router.put("/:id", validarId, validarRepuesto, actualizar);
router.delete("/:id", validarId, eliminar);

export default router;
