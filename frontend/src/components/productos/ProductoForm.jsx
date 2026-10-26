import React, { useState } from "react";
import Campo from "../Campo";
import { normalizarCodigo, validarRepuesto } from "../../utils/inventario";
export default function ProductoForm({
  producto,
  productos,
  onGuardar,
  onCancelar,
}) {
  const [datos, setDatos] = useState(
    producto
      ? { ...producto, compatibilidad: producto.compatibilidad.join(", ") }
      : {
          codigo: "",
          nombre: "",
          categoria: "",
          marca: "",
          precio: "",
          stock: "",
          compatibilidad: "",
        },
  );
  const [errores, setErrores] = useState({});
  const cambiar = (campo, valor) =>
    setDatos((actual) => ({ ...actual, [campo]: valor }));
  function enviar(e) {
    e.preventDefault();
    const encontrados = validarRepuesto(datos, productos, !!producto);
    setErrores(encontrados);
    if (Object.keys(encontrados).length) return;
    onGuardar({
      ...datos,
      id: producto?.id,
      codigo: producto ? producto.codigo : normalizarCodigo(datos.codigo),
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      categoria: datos.categoria.trim(),
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      compatibilidad: [
        ...new Set(
          datos.compatibilidad
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
        ),
      ],
    });
  }
  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <h2 id="titulo-repuesto">
        {producto ? "Editar repuesto" : "Nuevo repuesto"}
      </h2>
      <p>Los campos marcados con * son obligatorios.</p>
      {Object.keys(errores).length > 0 && (
        <p role="alert">Revise los campos indicados.</p>
      )}
      <div className="filters-grid">
        {[
          ["codigo", "Código"],
          ["nombre", "Nombre"],
          ["categoria", "Categoría"],
          ["marca", "Marca"],
          ["precio", "Precio (COP)"],
          ["stock", "Unidades"],
          ["compatibilidad", "Modelos compatibles (separados por coma)"],
        ].map(([campo, etiqueta]) => (
          <Campo
            key={campo}
            nombre={campo}
            etiqueta={etiqueta}
            valor={datos[campo]}
            onChange={cambiar}
            error={errores[campo]}
            required
            autoFocus={producto ? campo === "nombre" : campo === "codigo"}
            disabled={campo === "codigo" && !!producto}
            type={["precio", "stock"].includes(campo) ? "number" : "text"}
            min={["precio", "stock"].includes(campo) ? 0 : undefined}
            step={
              campo === "stock" ? 1 : campo === "precio" ? "0.01" : undefined
            }
          />
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" type="submit">
          Guardar repuesto
        </button>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancelar}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
