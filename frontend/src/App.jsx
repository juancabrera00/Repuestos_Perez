import React, { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Proyecto from "./pages/Proyecto";
import Productos from "./pages/Productos";
import Formulario from "./pages/Formulario";
import useCatalogo from "./hooks/useCatalogo";
export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  const catalogo = useCatalogo();
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                productos={catalogo.productos}
                cargando={catalogo.cargando}
                error={catalogo.error}
                cargar={catalogo.cargar}
              />
            }
          />
          <Route path="/proyecto" element={<Proyecto />} />
          <Route path="/productos" element={<Productos {...catalogo} />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route
            path="*"
            element={
              <section className="section container">
                <h1>Página no encontrada</h1>
                <Link to="/">Volver al inicio</Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer conectado={!catalogo.error} cargando={catalogo.cargando} />
    </>
  );
}
