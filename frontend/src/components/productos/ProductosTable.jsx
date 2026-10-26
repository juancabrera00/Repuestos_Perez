import React from "react";
import { moneda } from "../../utils/inventario";

function textoStock(stock) {
  if (stock === 0) return "× Agotado — 0 unidades";
  if (stock <= 5) return `! Stock bajo — ${stock} unidades`;
  return `✓ Disponible — ${stock} unidades`;
}

function Encabezado({ campo, etiqueta, orden, onOrdenar }) {
  const activo = orden.campo === campo;
  const flecha = activo && orden.dir === "desc" ? "↓" : "↑";
  return (
    <th scope="col">
      <button
        type="button"
        className="sort-button"
        aria-pressed={activo}
        onClick={() => onOrdenar(campo)}
      >
        {etiqueta} {activo ? flecha : ""}
      </button>
    </th>
  );
}

function Acciones({ producto, onEditar, onEliminar }) {
  return (
    <div className="row-actions">
      <button
        className="btn btn-secondary btn-small"
        type="button"
        aria-label={"Editar " + producto.codigo}
        onClick={() => onEditar(producto)}
      >
        Editar
      </button>
      <button
        className="btn btn-danger btn-small"
        type="button"
        aria-label={"Eliminar " + producto.codigo}
        onClick={() => onEliminar(producto)}
      >
        Eliminar
      </button>
    </div>
  );
}

export default function ProductosTable({
  productos,
  orden,
  onOrdenar,
  onEditar,
  onEliminar,
}) {
  if (productos.length === 0) {
    return (
      <div className="panel">
        <p role="status">
          No se encontraron repuestos. Cambie los filtros o agregue uno nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="table-wrap catalog-desktop">
        <table className="catalog-table">
          <caption className="visually-hidden">
            Catálogo de repuestos y existencias
          </caption>
          <thead>
            <tr>
              <th scope="col">Código</th>
              <Encabezado campo="nombre" etiqueta="Nombre" orden={orden} onOrdenar={onOrdenar} />
              <th scope="col">Categoría</th>
              <th scope="col">Marca</th>
              <Encabezado campo="precio" etiqueta="Precio" orden={orden} onOrdenar={onOrdenar} />
              <Encabezado campo="stock" etiqueta="Stock" orden={orden} onOrdenar={onOrdenar} />
              <th scope="col">Compatibilidad</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id ?? p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.marca}</td>
                <td>{moneda(p.precio)}</td>
                <td>{textoStock(p.stock)}</td>
                <td>
                  <span className="chip-row">
                    {p.compatibilidad.map((modelo) => (
                      <span className="chip" key={modelo}>
                        {modelo}
                      </span>
                    ))}
                  </span>
                </td>
                <td>
                  <Acciones producto={p} onEditar={onEditar} onEliminar={onEliminar} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="catalog-cards">
        {productos.map((p) => (
          <article className="catalog-card" key={p.id ?? p.codigo}>
            <p className="eyebrow">{p.codigo}</p>
            <h3>{p.nombre}</h3>
            <p>
              {p.categoria} · {p.marca}
            </p>
            <p>{moneda(p.precio)}</p>
            <p>{textoStock(p.stock)}</p>
            <span className="chip-row">
              {p.compatibilidad.map((modelo) => (
                <span className="chip" key={modelo}>
                  {modelo}
                </span>
              ))}
            </span>
            <Acciones producto={p} onEditar={onEditar} onEliminar={onEliminar} />
          </article>
        ))}
      </div>
    </div>
  );
}
