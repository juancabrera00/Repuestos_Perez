import React from "react";
import Lista from "../Lista";
import { estadoDe } from "../../utils/inventario";
export default function StockCritico({ productos }) {
  return (
    <div className="panel">
      <h2>Repuestos que requieren atención</h2>
      <Lista
        items={productos.filter((p) => p.stock <= 5)}
        clave={(p) => p.id ?? p.codigo}
        vacio="No hay repuestos con stock bajo o agotado."
        renderItem={(p) => (
          <div className="critico-item">
            <span>
              {p.codigo} · {p.nombre}
            </span>
            <strong>
              {estadoDe(p.stock)} · {p.stock} unidades
            </strong>
          </div>
        )}
      />
    </div>
  );
}
