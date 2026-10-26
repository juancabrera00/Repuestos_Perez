import React, { useCallback, useEffect, useRef, useState } from "react";
import ConfirmarEliminacion from "../components/productos/ConfirmarEliminacion";
import FiltrosProductos from "../components/productos/FiltrosProductos";
import KPICatalogo from "../components/productos/KPICatalogo";
import ProductoForm from "../components/productos/ProductoForm";
import ProductosTable from "../components/productos/ProductosTable";
import StockCritico from "../components/productos/StockCritico";
import Toast from "../components/Toast";
import { estadoDe } from "../utils/inventario";

const inicial = { texto: "", marca: "", categoria: "", modelo: "", estado: "" };

export default function Productos({
  productos,
  cargando,
  error,
  cargar,
  guardando,
  crear,
  actualizar,
  eliminar,
}) {
  const [filtros, setFiltros] = useState(inicial);
  const [orden, setOrden] = useState({ campo: "nombre", dir: "asc" });
  const [editor, setEditor] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const dialogRef = useRef(null);
  const cerrarAviso = useCallback(() => setMensaje(""), []);

  const resultados = productos.filter(
    (p) =>
      (!filtros.texto ||
        `${p.codigo} ${p.nombre} ${p.marca}`
          .toLowerCase()
          .includes(filtros.texto.toLowerCase().trim())) &&
      (!filtros.marca || p.marca === filtros.marca) &&
      (!filtros.categoria || p.categoria === filtros.categoria) &&
      (!filtros.modelo || p.compatibilidad.includes(filtros.modelo)) &&
      (!filtros.estado || estadoDe(p.stock) === filtros.estado),
  );
  const ordenados = [...resultados].sort((a, b) => {
    const direccion = orden.dir === "asc" ? 1 : -1;
    if (orden.campo === "nombre") {
      return a.nombre.localeCompare(b.nombre, "es") * direccion;
    }
    return (Number(a[orden.campo]) - Number(b[orden.campo])) * direccion;
  });
  const opciones = {
    marca: [...new Set(productos.map((p) => p.marca))].sort(),
    categoria: [...new Set(productos.map((p) => p.categoria))].sort(),
    modelo: [...new Set(productos.flatMap((p) => p.compatibilidad))].sort(),
    estado: ["Disponible", "Stock bajo", "Agotado"],
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (editor && !dialog.open) {
      dialog.showModal();
      const campo = dialog.querySelector(editor.producto ? "#nombre" : "#codigo");
      campo?.focus();
    }
    if (!editor && dialog.open) dialog.close();
  }, [editor]);

  function abrirNuevo() {
    setEditor({ producto: null });
    setPorEliminar(null);
  }

  async function guardar(item) {
    try {
      if (editor.producto) {
        await actualizar(editor.producto.id, item);
        setMensaje("✓ Repuesto actualizado correctamente");
      } else {
        await crear(item);
        setMensaje("✓ Repuesto creado correctamente");
      }
      setEditor(null);
    } catch {
      setMensaje("");
    }
  }

  async function confirmarEliminacion() {
    try {
      await eliminar(porEliminar.id);
      setMensaje("✓ Repuesto eliminado correctamente");
      setPorEliminar(null);
      setEditor(null);
    } catch {
      setMensaje("");
    }
  }

  return (
    <section className="section container">
      <header className="section-header section-header-left">
        <p className="eyebrow">Inventario</p>
        <h1>Catálogo de repuestos</h1>
        <p>Los cambios se guardan en la base de datos.</p>
      </header>
      {error && (
        <p className="notice" role="alert">
          {error}{" "}
          <button className="btn btn-secondary btn-small" type="button" onClick={cargar}>
            Reintentar
          </button>
        </p>
      )}
      {cargando ? (
        <div role="status" aria-label="Cargando catálogo">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : (
        <>
          <KPICatalogo productos={productos} />
          <FiltrosProductos
            filtros={filtros}
            opciones={opciones}
            total={productos.length}
            visibles={resultados.length}
            onCambiar={(campo, valor) =>
              setFiltros((f) => ({ ...f, [campo]: valor }))
            }
            onLimpiar={() => setFiltros(inicial)}
            onAgregar={abrirNuevo}
          />
          <p role="status">{guardando ? "Guardando…" : ""}</p>
          <dialog
            ref={dialogRef}
            className="modal"
            aria-labelledby="titulo-repuesto"
            onClose={() => setEditor(null)}
          >
            <button
              className="modal-close"
              type="button"
              aria-label="Cerrar"
              onClick={() => setEditor(null)}
            >
              ×
            </button>
            {editor && (
              <ProductoForm
                key={editor.producto?.codigo || "nuevo"}
                producto={editor.producto}
                productos={productos}
                onGuardar={guardar}
                onCancelar={() => setEditor(null)}
              />
            )}
          </dialog>
          {porEliminar && (
            <ConfirmarEliminacion
              producto={porEliminar}
              onConfirmar={confirmarEliminacion}
              onCancelar={() => setPorEliminar(null)}
            />
          )}
          {error && productos.length === 0 ? null : !error && productos.length === 0 ? (
            <div className="panel empty-state">
              <h2>No hay repuestos registrados</h2>
              <p>Agrega el primer repuesto para comenzar a gestionar el inventario.</p>
              <button className="btn btn-primary" type="button" onClick={abrirNuevo}>
                + Agregar repuesto
              </button>
            </div>
          ) : (
            <ProductosTable
              productos={ordenados}
              orden={orden}
              onOrdenar={(campo) =>
                setOrden((actual) =>
                  actual.campo === campo
                    ? { campo, dir: actual.dir === "asc" ? "desc" : "asc" }
                    : { campo, dir: "asc" },
                )
              }
              onEditar={(p) => {
                setEditor({ producto: p });
                setPorEliminar(null);
              }}
              onEliminar={(p) => {
                setPorEliminar(p);
                setEditor(null);
              }}
            />
          )}
          <StockCritico productos={productos} />
        </>
      )}
      <Toast mensaje={mensaje} onCerrar={cerrarAviso} />
    </section>
  );
}
