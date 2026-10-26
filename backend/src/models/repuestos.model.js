import { pool } from "../config/database.js";

const COLUMNAS = `id, codigo, nombre, categoria, marca, precio, stock, compatibilidad, created_at, updated_at`;

function fila(row) {
  if (!row) return null;
  return {
    ...row,
    precio: Number(row.precio),
    stock: Number(row.stock),
    compatibilidad: row.compatibilidad ?? [],
  };
}

export async function listarRepuestos() {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM repuestos ORDER BY codigo`,
  );
  return rows.map(fila);
}

export async function buscarRepuestoPorId(id) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS} FROM repuestos WHERE id = $1`,
    [id],
  );
  return fila(rows[0]);
}

export async function crearRepuesto(datos) {
  const { rows } = await pool.query(
    `INSERT INTO repuestos (codigo, nombre, categoria, marca, precio, stock, compatibilidad)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${COLUMNAS}`,
    [
      datos.codigo,
      datos.nombre,
      datos.categoria,
      datos.marca,
      datos.precio,
      datos.stock,
      datos.compatibilidad,
    ],
  );
  return fila(rows[0]);
}

export async function actualizarRepuesto(id, datos) {
  const { rows } = await pool.query(
    `UPDATE repuestos
     SET nombre = $1,
         categoria = $2,
         marca = $3,
         precio = $4,
         stock = $5,
         compatibilidad = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING ${COLUMNAS}`,
    [
      datos.nombre,
      datos.categoria,
      datos.marca,
      datos.precio,
      datos.stock,
      datos.compatibilidad,
      id,
    ],
  );
  return fila(rows[0]);
}

export async function eliminarRepuesto(id) {
  const { rows } = await pool.query(
    `DELETE FROM repuestos WHERE id = $1 RETURNING id, codigo`,
    [id],
  );
  return rows[0] ?? null;
}
