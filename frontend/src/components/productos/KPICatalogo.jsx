import React from "react";
import Card from "../Card";
export default function KPICatalogo({ productos }) {
  const indicadores = [
    ["Repuestos registrados", productos.length],
    ["Disponibles", productos.filter((p) => p.stock > 5).length],
    [
      "Stock bajo",
      productos.filter((p) => p.stock > 0 && p.stock <= 5).length,
    ],
    ["Agotados", productos.filter((p) => p.stock === 0).length],
  ];
  return (
    <div className="kpi-grid">
      {indicadores.map(([titulo, valor]) => (
        <Card key={titulo} titulo={titulo} className="kpi-card">
          <p className="kpi-value">{valor}</p>
        </Card>
      ))}
    </div>
  );
}
