import React from "react";
export default function Card({
  titulo,
  imagen,
  children,
  className = "info-card",
}) {
  return (
    <article className={className}>
      {imagen && (
        <img src={"/assets/imagenes/" + imagen} width="56" height="56" alt="" />
      )}
      <h3>{titulo}</h3>
      {children}
    </article>
  );
}
