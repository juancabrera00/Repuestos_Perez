function texto(valor) {
  return String(valor ?? "").trim();
}

function error(res, message) {
  return res.status(400).json({ success: false, message });
}

export function validarSolicitud(req, res, next) {
  const origen = req.body && typeof req.body === "object" ? req.body : {};
  const nombre = texto(origen.nombre);
  const correo = texto(origen.correo);
  const telefono = texto(origen.telefono);
  const repuesto = texto(origen.repuesto);
  const observaciones = texto(origen.observaciones);
  if (nombre.length < 3) return error(res, "Ingrese al menos 3 caracteres en el nombre.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return error(res, "Ingrese un correo válido.");
  }
  if (telefono && !/^[0-9 +()-]{7,20}$/.test(telefono)) {
    return error(res, "Ingrese un teléfono válido.");
  }
  if (telefono && !/^\d{7,10}$/.test(telefono.replace(/\D/g, ""))) {
    return error(res, "El teléfono debe tener entre 7 y 10 dígitos.");
  }
  if (repuesto.length < 3) return error(res, "Indique el repuesto solicitado.");
  if (observaciones.length < 10) {
    return error(res, "Escriba al menos 10 caracteres en el detalle.");
  }
  req.solicitud = { nombre, correo, telefono, repuesto, observaciones };
  next();
}
