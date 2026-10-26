export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "Ya existe un repuesto con ese código.",
    });
  }
  if (err.code === "23514" || err.code === "23502" || err.code === "22P02") {
    return res.status(400).json({
      success: false,
      message: "Los datos no cumplen las reglas de la base de datos.",
    });
  }
  const status = Number(err.status) || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Error interno del servidor." : err.message,
  });
}
