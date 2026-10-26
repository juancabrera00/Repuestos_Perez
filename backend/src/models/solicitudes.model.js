import { pool } from "../config/database.js";

function fila(row) {
  if (!row) return null;
  return row;
}

export async function listarSolicitudes() {
  const { rows } = await pool.query(
    `SELECT id, nombre, correo, telefono, repuesto, observaciones, created_at
     FROM solicitudes
     ORDER BY created_at DESC`,
  );
  return rows.map(fila);
}

export async function crearSolicitud(datos) {
  const { rows } = await pool.query(
    `INSERT INTO solicitudes (nombre, correo, telefono, repuesto, observaciones)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, correo, telefono, repuesto, observaciones, created_at`,
    [
      datos.nombre,
      datos.correo,
      datos.telefono || null,
      datos.repuesto,
      datos.observaciones,
    ],
  );
  return fila(rows[0]);
}
