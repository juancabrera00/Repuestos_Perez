import {
  actualizarRepuesto,
  buscarRepuestoPorId,
  crearRepuesto,
  eliminarRepuesto,
  listarRepuestos,
} from "../models/repuestos.model.js";

export async function listar(req, res, next) {
  try {
    const data = await listarRepuestos();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function obtener(req, res, next) {
  try {
    const data = await buscarRepuestoPorId(req.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No existe un repuesto con ese id.",
      });
    }
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function crear(req, res, next) {
  try {
    const data = await crearRepuesto(req.repuesto);
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req, res, next) {
  try {
    const actual = await buscarRepuestoPorId(req.id);
    if (!actual) {
      return res.status(404).json({
        success: false,
        message: "No existe un repuesto con ese id.",
      });
    }
    if (req.repuesto.codigo !== actual.codigo.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: "El código no se puede modificar.",
      });
    }
    const data = await actualizarRepuesto(req.id, req.repuesto);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req, res, next) {
  try {
    const data = await eliminarRepuesto(req.id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No existe un repuesto con ese id.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Repuesto eliminado.",
      data,
    });
  } catch (err) {
    next(err);
  }
}
