import React, { useState } from "react";
import Campo from "../components/Campo";
import useSolicitudes from "../hooks/useSolicitudes";
import { validarSolicitud } from "../utils/inventario";
const vacio = {
  nombre: "",
  correo: "",
  telefono: "",
  repuesto: "",
  observaciones: "",
};
export default function Formulario() {
  const { solicitudes, cargando, error, crear } = useSolicitudes();
  const [datos, setDatos] = useState(vacio);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  async function enviar(e) {
    e.preventDefault();
    const resultado = validarSolicitud(datos);
    setErrores(resultado);
    setMensaje("");
    if (Object.keys(resultado).length) return;
    const solicitud = Object.fromEntries(
      Object.entries(datos).map(([k, v]) => [k, v.trim()]),
    );
    try {
      await crear(solicitud);
      setMensaje("Solicitud registrada.");
      setDatos(vacio);
    } catch {
      setMensaje("");
    }
  }
  return (
    <section className="section container">
      <header className="section-header section-header-left">
        <p className="eyebrow">Atención al cliente</p>
        <h1>Solicitud de repuestos</h1>
        <p>
          Cuéntenos qué pieza necesita. La solicitud queda guardada en la base
          de datos; no se envía un correo ni un pedido real.
        </p>
      </header>
      <form className="panel" onSubmit={enviar} noValidate>
        <h2>Datos de la solicitud</h2>
        <p>Los campos con * son obligatorios.</p>
        {Object.keys(errores).length > 0 && (
          <p role="alert">Revise los campos indicados antes de continuar.</p>
        )}
        <div className="filters-grid">
          {[
            ["nombre", "Nombre completo"],
            ["correo", "Correo electrónico"],
            ["telefono", "Teléfono (opcional)"],
            ["repuesto", "Repuesto solicitado"],
            ["observaciones", "Modelo y detalles de la solicitud"],
          ].map(([campo, etiqueta]) => (
            <Campo
              key={campo}
              nombre={"sol-" + campo}
              etiqueta={etiqueta}
              valor={datos[campo]}
              onChange={(_, valor) =>
                setDatos((actual) => ({ ...actual, [campo]: valor }))
              }
              error={errores[campo]}
              type={
                campo === "correo"
                  ? "email"
                  : campo === "telefono"
                    ? "tel"
                    : "text"
              }
              multilinea={campo === "observaciones"}
              rows={4}
              required={campo !== "telefono"}
            />
          ))}
        </div>
        <button className="btn btn-primary" type="submit">
          Registrar solicitud
        </button>
        {error && <p role="alert">{error}</p>}
        <p role="status">{mensaje}</p>
      </form>
      <div className="panel">
        <h2>Solicitudes registradas</h2>
        {cargando ? (
          <div role="status" aria-label="Cargando solicitudes">
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        ) : solicitudes.length === 0 ? (
          <p role="status">Todavía no hay solicitudes registradas.</p>
        ) : (
          <div className="table-wrap">
            <table className="catalog-table solicitudes-table">
              <caption className="visually-hidden">Solicitudes registradas</caption>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Contacto</th>
                  <th scope="col">Repuesto</th>
                  <th scope="col">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((s) => (
                  <tr key={s.id}>
                    <td>{s.nombre}</td>
                    <td>
                      {s.correo}
                      {s.telefono ? " · " + s.telefono : ""}
                    </td>
                    <td>{s.repuesto}</td>
                    <td>
                      {s.created_at
                        ? new Date(s.created_at).toLocaleString("es-CO", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
