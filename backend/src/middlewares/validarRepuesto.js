function texto(valor) {
  return String(valor ?? "").trim();
}

function error(res, message) {
  return res.status(400).json({ success: false, message });
}

export function validarRepuesto(req, res, next) {
  const origen = req.body && typeof req.body === "object" ? req.body : {};
  const codigo = texto(origen.codigo).toUpperCase();
  const nombre = texto(origen.nombre);
  const categoria = texto(origen.categoria);
  const marca = texto(origen.marca);
  if (codigo.length < 3) return error(res, "El código debe tener al menos 3 caracteres.");
  if (nombre.length < 3) return error(res, "El nombre debe tener al menos 3 caracteres.");
  if (!categoria) return error(res, "La categoría es obligatoria.");
  if (!marca) return error(res, "La marca es obligatoria.");

  const precio = Number(origen.precio);
  if (
    origen.precio === "" ||
    origen.precio == null ||
    !Number.isFinite(precio) ||
    precio < 0
  ) {
    return error(res, "Ingrese un precio mayor o igual a cero.");
  }

  const stockTexto = String(origen.stock ?? "").trim();
  if (!/^\d+$/.test(stockTexto)) {
    return error(res, "Ingrese una cantidad entera mayor o igual a cero.");
  }
  const stock = Number(stockTexto);
  if (!Number.isSafeInteger(stock) || stock < 0) {
    return error(res, "Ingrese una cantidad entera mayor o igual a cero.");
  }

  const lista = Array.isArray(origen.compatibilidad)
    ? origen.compatibilidad
    : texto(origen.compatibilidad).split(",");
  const compatibilidad = [
    ...new Set(lista.map((m) => texto(m)).filter(Boolean)),
  ];
  if (!compatibilidad.length) {
    return error(res, "Indique al menos un modelo compatible.");
  }

  req.repuesto = {
    codigo,
    nombre,
    categoria,
    marca,
    precio,
    stock,
    compatibilidad,
  };
  next();
}
