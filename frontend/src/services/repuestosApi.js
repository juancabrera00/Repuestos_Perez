import { api } from "./api.js";

export async function obtenerRepuestos() {
  const { data } = await api.get("/repuestos");
  return data.data;
}

export async function obtenerRepuestoPorId(id) {
  const { data } = await api.get(`/repuestos/${id}`);
  return data.data;
}

export async function crearRepuesto(item) {
  const { data } = await api.post("/repuestos", item);
  return data.data;
}

export async function actualizarRepuesto(id, item) {
  const { data } = await api.put(`/repuestos/${id}`, item);
  return data.data;
}

export async function eliminarRepuesto(id) {
  const { data } = await api.delete(`/repuestos/${id}`);
  return data.data;
}
