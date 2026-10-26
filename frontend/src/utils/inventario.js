export function estadoDe(stock) {
  return stock === 0 ? "Agotado" : stock <= 5 ? "Stock bajo" : "Disponible";
}

function texto(valor) {
  return String(valor ?? "").trim();
}

export function normalizarCodigo(codigo) {
  return texto(codigo).toUpperCase();
}
export const moneda = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor);
export function catalogoValido(datos) {
  return (
    Array.isArray(datos) &&
    datos.every(
      (p) =>
        p &&
        ["codigo", "nombre", "marca", "categoria"].every(
          (k) => typeof p[k] === "string" && p[k].trim(),
        ) &&
        Number.isFinite(p.precio) &&
        p.precio >= 0 &&
        Number.isSafeInteger(p.stock) &&
        p.stock >= 0 &&
        Array.isArray(p.compatibilidad) &&
        p.compatibilidad.every((m) => typeof m === "string"),
    ) &&
    new Set(datos.map((p) => normalizarCodigo(p.codigo))).size === datos.length
  );
}
export function validarRepuesto(datos, productos, editando = false) {
  const errores = {};
  const origen = datos && typeof datos === "object" ? datos : {};
  const lista = Array.isArray(productos) ? productos : [];
  for (const campo of ["codigo", "nombre", "marca", "categoria"])
    if (texto(origen[campo]).length < (["codigo", "nombre"].includes(campo) ? 3 : 1))
      errores[campo] =
        "Complete este campo" +
        (["codigo", "nombre"].includes(campo)
          ? " con al menos 3 caracteres."
          : ".");
  if (
    !editando &&
    lista.some(
      (p) => normalizarCodigo(p?.codigo) === normalizarCodigo(origen.codigo),
    )
  )
    errores.codigo = "Este código ya existe.";
  if (
    origen.precio === "" ||
    origen.precio == null ||
    !Number.isFinite(Number(origen.precio)) ||
    Number(origen.precio) < 0
  )
    errores.precio = "Ingrese un precio mayor o igual a cero.";
  if (
    origen.stock === "" ||
    origen.stock == null ||
    !Number.isSafeInteger(Number(origen.stock)) ||
    Number(origen.stock) < 0
  )
    errores.stock = "Ingrese una cantidad entera mayor o igual a cero.";
  if (!texto(origen.compatibilidad).split(",").some((m) => m.trim()))
    errores.compatibilidad = "Indique al menos un modelo compatible.";
  return errores;
}
export function validarSolicitud(datos) {
  const errores = {};
  const origen = datos && typeof datos === "object" ? datos : {};
  const telefono = texto(origen.telefono);
  if (texto(origen.nombre).length < 3)
    errores.nombre = "Ingrese al menos 3 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto(origen.correo)))
    errores.correo = "Ingrese un correo válido.";
  if (telefono && !/^[0-9 +()-]{7,20}$/.test(origen.telefono))
    errores.telefono = "Ingrese un teléfono válido.";
  else if (telefono && !/^\d{7,10}$/.test(telefono.replace(/\D/g, "")))
    errores.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";
  if (texto(origen.repuesto).length < 3)
    errores.repuesto = "Indique el repuesto solicitado.";
  if (texto(origen.observaciones).length < 10)
    errores.observaciones = "Escriba al menos 10 caracteres.";
  return errores;
}
