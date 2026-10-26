import {
  crearSolicitud,
  listarSolicitudes,
} from "../models/solicitudes.model.js";

export async function listar(req, res, next) {
  try {
    const data = await listarSolicitudes();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const data = await crearSolicitud(req.solicitud);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}
