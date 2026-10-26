import React from "react";
export default function Lista({
  items,
  renderItem,
  clave,
  vacio = "No hay registros.",
}) {
  return items.length ? (
    <ul className="record-list">
      {items.map((item) => (
        <li key={clave(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  ) : (
    <p role="status">{vacio}</p>
  );
}
