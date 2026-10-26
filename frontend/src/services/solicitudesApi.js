import { api } from "./api.js";

export async function obtenerSolicitudes() {
  const { data } = await api.get("/solicitudes");
  return data.data;
}

export async function crearSolicitud(item) {
  const { data } = await api.post("/solicitudes", item);
  return data.data;
}
