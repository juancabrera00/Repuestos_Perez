import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  useEffect(() => {
    if (!abierto) return;
    function cerrar(e) {
      if (e.key === "Escape") setAbierto(false);
    }
    document.addEventListener("keydown", cerrar);
    return () => document.removeEventListener("keydown", cerrar);
  }, [abierto]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          className="brand"
          to="/"
          aria-label="Repuestos Pérez, inicio"
          onClick={() => setAbierto(false)}
        >
          <img src="/assets/imagenes/logo.png" alt="Repuestos Pérez" />
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={abierto}
          aria-controls="menuPrincipal"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="visually-hidden">Menú</span>
        </button>
        <nav
          id="menuPrincipal"
          className={abierto ? "is-open" : ""}
          aria-label="Navegación principal"
        >
          <ul className="nav-list">
            {[
              ["/", "Inicio"],
              ["/proyecto", "Sobre el proyecto"],
              ["/productos", "Catálogo"],
              ["/formulario", "Solicitud"],
            ].map(([ruta, nombre]) => (
              <li key={ruta}>
                <NavLink
                  to={ruta}
                  end={ruta === "/"}
                  onClick={() => setAbierto(false)}
                >
                  {nombre}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
