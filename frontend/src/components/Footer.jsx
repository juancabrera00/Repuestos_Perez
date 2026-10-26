import React from "react";
export default function Footer({ conectado, cargando }) {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-title">Repuestos Pérez</p>
          <p>
            Tienda de repuestos para motocarros.
            <br />
            Remedios, Antioquia.
          </p>
        </div>
        <div>
          <p>
            <strong>Tecnológico de Antioquia</strong>
          </p>
          <p>Construcción de software 3 · 2026</p>
          <p>Prototipo académico. Datos de demostración.</p>
          {!cargando && (
            <p role="status">
              {conectado ? "✓ API conectada" : "× Sin conexión"}
            </p>
          )}
        </div>
        <div>
          <strong>Integrantes del equipo</strong>
          <ul>
            <li>Daniel Bermúdez Pérez</li>
            <li>Sheril Daniela Silva Garcia</li>
            <li>Juan Camilo Cabrera Roa</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
