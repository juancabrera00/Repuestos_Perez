import React from "react";
export default function ConfirmarEliminacion({
  producto,
  onConfirmar,
  onCancelar,
}) {
  return (
    <section className="panel" aria-label="Confirmar eliminación">
      <h2 id="titulo-eliminar">Eliminar repuesto</h2>
      <p>¿Deseas eliminar “{producto.nombre}”?</p>
      <p>Código: {producto.codigo}</p>
      <p>Esta acción no se puede deshacer.</p>
      <div className="form-actions">
        <button className="btn btn-secondary" type="button" onClick={onCancelar}>
          Cancelar
        </button>
        <button className="btn btn-danger" type="button" onClick={onConfirmar}>
          Eliminar
        </button>
      </div>
    </section>
  );
}
