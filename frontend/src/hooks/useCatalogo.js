import { useCallback, useEffect, useState } from "react";
import {
  actualizarRepuesto,
  crearRepuesto,
  eliminarRepuesto,
  obtenerRepuestos,
} from "../services/repuestosApi";

function mensajeDe(err, respaldo) {
  return err?.response?.data?.message || respaldo;
}

export default function useCatalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    setError("");
    try {
      setProductos(await obtenerRepuestos());
    } catch (err) {
      setProductos([]);
      setError(
        mensajeDe(
          err,
          "No se pudo cargar el catálogo. Compruebe que la API y PostgreSQL estén en marcha.",
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
    setGuardando(true);
    setError("");
    try {
      const creado = await crearRepuesto(item);
      setProductos((actual) =>
        [...actual, creado].sort((a, b) => a.codigo.localeCompare(b.codigo)),
      );
      return creado;
    } catch (err) {
      setError(mensajeDe(err, "No se pudo guardar el repuesto."));
      throw err;
    } finally {
      setGuardando(false);
    }
  }

  async function actualizar(id, item) {
    setGuardando(true);
    setError("");
    try {
      const actualizado = await actualizarRepuesto(id, item);
      setProductos((actual) =>
        actual.map((p) => (p.id === id ? actualizado : p)),
      );
      return actualizado;
    } catch (err) {
      setError(mensajeDe(err, "No se pudo actualizar el repuesto."));
      throw err;
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(id) {
    setGuardando(true);
    setError("");
    try {
      await eliminarRepuesto(id);
      setProductos((actual) => actual.filter((p) => p.id !== id));
    } catch (err) {
      setError(mensajeDe(err, "No se pudo eliminar el repuesto."));
      throw err;
    } finally {
      setGuardando(false);
    }
  }

  return {
    productos,
    cargando,
    guardando,
    error,
    crear,
    actualizar,
    eliminar,
    cargar,
  };
}
