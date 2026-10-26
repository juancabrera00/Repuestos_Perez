import React from "react";
export default function FiltrosProductos({
  filtros,
  opciones,
  onCambiar,
  onLimpiar,
  onAgregar,
  total,
  visibles,
}) {
  return (
    <div className="panel">
      <h2>Buscar repuestos</h2>
      <div className="filters-grid">
        <div className="field">
          <label htmlFor="buscar">Código, nombre o marca</label>
          <input
            id="buscar"
            value={filtros.texto}
            onChange={(e) => onCambiar("texto", e.target.value)}
          />
        </div>
        {[
          ["marca", "Marca"],
          ["categoria", "Categoría"],
          ["modelo", "Modelo de motocarro"],
          ["estado", "Disponibilidad"],
        ].map(([campo, etiqueta]) => (
          <div className="field" key={campo}>
            <label htmlFor={"f-" + campo}>{etiqueta}</label>
            <select
              id={"f-" + campo}
              value={filtros[campo]}
              onChange={(e) => onCambiar(campo, e.target.value)}
            >
              <option value="">Todos</option>
              {opciones[campo].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <p role="status">
        {visibles} de {total} repuestos
      </p>
      <div className="form-actions">
        <button className="btn btn-secondary" type="button" onClick={onLimpiar}>
          Limpiar búsqueda y filtros
        </button>
        <button className="btn btn-primary" type="button" onClick={onAgregar}>
          + Nuevo repuesto
        </button>
      </div>
    </div>
  );
}
