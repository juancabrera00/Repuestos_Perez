import { useCallback, useEffect, useState } from "react";
import { crearSolicitud, obtenerSolicitudes } from "../services/solicitudesApi";

function mensajeDe(err, respaldo) {
  return err?.response?.data?.message || respaldo;
}

export default function useSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setSolicitudes(await obtenerSolicitudes());
    } catch (err) {
      setSolicitudes([]);
      setError(
        mensajeDe(
          err,
          "No se pudieron cargar las solicitudes. Compruebe que la API esté en marcha.",
        ),
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(item) {
    setError("");
    try {
      const creada = await crearSolicitud(item);
      setSolicitudes((actual) => [creada, ...actual]);
      return creada;
    } catch (err) {
      setError(mensajeDe(err, "No se pudo registrar la solicitud."));
      throw err;
    }
  }

  return { solicitudes, cargando, error, crear };
}
