import test from "node:test";
import assert from "node:assert/strict";
import {
  catalogoValido,
  validarRepuesto,
  validarSolicitud,
  estadoDe,
  normalizarCodigo,
} from "../src/utils/inventario.js";
const producto = {
  codigo: "ABC",
  nombre: "Filtro",
  marca: "Marca",
  categoria: "Filtros",
  precio: 100,
  stock: 2,
  compatibilidad: ["Bajaj RE"],
};
const formulario = {
  ...producto,
  precio: "100",
  stock: "2",
  compatibilidad: "Bajaj RE",
};
test("El catálogo vacío es válido; registros corruptos y duplicados no", () => {
  assert.equal(catalogoValido([]), true);
  assert.equal(catalogoValido([producto]), true);
  assert.equal(
    catalogoValido([producto, { ...producto, codigo: "abc" }]),
    false,
  );
  assert.equal(catalogoValido([{ ...producto, stock: -1 }]), false);
  assert.equal(catalogoValido([null]), false);
});
test("Código duplicado sin distinción de mayúsculas; edición permitida", () => {
  assert.ok(
    validarRepuesto({ ...formulario, codigo: "abc" }, [producto]).codigo,
  );
  assert.deepEqual(validarRepuesto(formulario, [producto], true), {});
});
test("Código duplicado ignora espacios laterales", () => {
  assert.equal(normalizarCodigo("  abc  "), "ABC");
  assert.ok(
    validarRepuesto({ ...formulario, codigo: "  ABC  " }, [producto]).codigo,
  );
  assert.equal(
    catalogoValido([producto, { ...producto, codigo: " ABC " }]),
    false,
  );
});
test("No permite cantidades negativas, fraccionarias o campos vacíos", () => {
  assert.ok(validarRepuesto({ ...formulario, stock: "1.5" }, []).stock);
  assert.ok(validarRepuesto({ ...formulario, stock: "-1" }, []).stock);
  assert.ok(validarRepuesto({ ...formulario, precio: "" }, []).precio);
  assert.ok(validarRepuesto({ ...formulario, precio: "-10" }, []).precio);
  assert.ok(
    validarRepuesto({ ...formulario, compatibilidad: " , " }, [])
      .compatibilidad,
  );
});
test("Rechaza NaN e Infinity", () => {
  assert.ok(validarRepuesto({ ...formulario, precio: "NaN" }, []).precio);
  assert.ok(validarRepuesto({ ...formulario, precio: "Infinity" }, []).precio);
  assert.ok(validarRepuesto({ ...formulario, stock: "Infinity" }, []).stock);
});
test("Límites de las alertas", () => {
  assert.equal(estadoDe(0), "Agotado");
  assert.equal(estadoDe(5), "Stock bajo");
  assert.equal(estadoDe(6), "Disponible");
});
test("Un formulario incompleto devuelve errores y no se cae", () => {
  const repuesto = validarRepuesto({}, undefined);
  assert.ok(repuesto.codigo);
  assert.ok(repuesto.nombre);
  assert.ok(repuesto.marca);
  assert.ok(repuesto.categoria);
  assert.ok(repuesto.precio);
  assert.ok(repuesto.stock);
  assert.ok(repuesto.compatibilidad);
  const solicitud = validarSolicitud(null);
  assert.ok(solicitud.nombre);
  assert.ok(solicitud.correo);
  assert.ok(solicitud.repuesto);
  assert.ok(solicitud.observaciones);
  assert.equal(solicitud.telefono, undefined);
});
test("Solicitud requiere correo, nombre, repuesto y detalle; teléfono opcional", () => {
  const datos = {
    nombre: "Daniel",
    correo: "daniel@example.com",
    telefono: "",
    repuesto: "Filtro",
    observaciones: "Para Bajaj RE",
  };
  assert.deepEqual(validarSolicitud(datos), {});
  assert.ok(validarSolicitud({ ...datos, correo: "invalido" }).correo);
  assert.ok(validarSolicitud({ ...datos, nombre: "   " }).nombre);
  assert.ok(validarSolicitud({ ...datos, telefono: "abcdefghi" }).telefono);
});
