import test from "node:test";
import assert from "node:assert/strict";
import { validarRepuesto } from "../src/middlewares/validarRepuesto.js";
import { validarId } from "../src/middlewares/validarId.js";
import { validarSolicitud } from "../src/middlewares/validarSolicitud.js";
import { errorHandler } from "../src/middlewares/errorHandler.js";

function correr(middleware, req) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        resolve({ status: this.statusCode, body, next: false });
      },
    };
    middleware(req, res, () => {
      resolve({ status: 200, body: null, next: true, req });
    });
  });
}

const valido = {
  codigo: "abc-01",
  nombre: "Filtro",
  categoria: "Filtros",
  marca: "NGK",
  precio: 15000,
  stock: 2,
  compatibilidad: ["Bajaj RE"],
};

test("Acepta un repuesto válido y normaliza el código", async () => {
  const resultado = await correr(validarRepuesto, { body: valido });
  assert.equal(resultado.next, true);
  assert.equal(resultado.req.repuesto.codigo, "ABC-01");
  assert.equal(resultado.req.repuesto.stock, 2);
});

test("Rechaza precio negativo, NaN, Infinity y stock decimal", async () => {
  for (const precio of [-1, "NaN", "Infinity", ""]) {
    const resultado = await correr(validarRepuesto, {
      body: { ...valido, precio },
    });
    assert.equal(resultado.status, 400, String(precio));
    assert.equal(resultado.next, false);
  }
  for (const stock of [-1, 1.5, "1.5", "Infinity", ""]) {
    const resultado = await correr(validarRepuesto, {
      body: { ...valido, stock },
    });
    assert.equal(resultado.status, 400, String(stock));
  }
});

test("Rechaza textos vacíos y compatibilidad vacía", async () => {
  const vacio = await correr(validarRepuesto, {
    body: { ...valido, nombre: "   ", compatibilidad: ["  "] },
  });
  assert.equal(vacio.status, 400);
});

test("El id debe ser un entero positivo", async () => {
  const bueno = await correr(validarId, { params: { id: "12" } });
  assert.equal(bueno.next, true);
  assert.equal(bueno.req.id, 12);
  for (const id of ["0", "-3", "1.5", "abc"]) {
    const malo = await correr(validarId, { params: { id } });
    assert.equal(malo.status, 400, id);
  }
});

test("Una solicitud incompleta responde 400", async () => {
  const resultado = await correr(validarSolicitud, { body: {} });
  assert.equal(resultado.status, 400);
  assert.equal(resultado.next, false);
});

test("Un código duplicado de PostgreSQL responde 409", () => {
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
  errorHandler({ code: "23505" }, {}, res, () => {});
  assert.equal(res.statusCode, 409);
  assert.equal(res.body.success, false);
});
