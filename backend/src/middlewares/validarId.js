export function validarId(req, res, next) {
  const texto = String(req.params.id ?? "");
  if (!/^[1-9]\d*$/.test(texto)) {
    return res.status(400).json({
      success: false,
      message: "El id debe ser un entero positivo.",
    });
  }
  req.id = Number(texto);
  next();
}
