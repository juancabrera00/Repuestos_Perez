import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Campo from "../components/Campo";
import { estadoDe, moneda } from "../utils/inventario";

function porcentaje(parte, total) {
  if (!total) return 0;
  return Math.round((parte / total) * 100);
}

export default function Home({ productos = [], cargando, error, cargar }) {
  const [nombre, setNombre] = useState("");
  const [saludo, setSaludo] = useState("");
  const disponibles = productos.filter((p) => estadoDe(p.stock) === "Disponible").length;
  const bajos = productos.filter((p) => estadoDe(p.stock) === "Stock bajo").length;
  const agotados = productos.filter((p) => estadoDe(p.stock) === "Agotado").length;
  const valor = productos.reduce((suma, p) => suma + Number(p.precio) * Number(p.stock), 0);
  const criticos = productos.filter((p) => p.stock <= 5).slice(0, 5);
  const barras = [
    ["Disponible", disponibles, "ok"],
    ["Stock bajo", bajos, "warn"],
    ["Agotado", agotados, "bad"],
  ];
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Proyecto Pedagógico Integrador</p>
            <h1>Repuestos Pérez</h1>
            <p className="hero-lead">
              El repuesto correcto, con el inventario a la mano. Consulte
              existencias y compatibilidad para su motocarro.
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/productos">
                Consultar catálogo
              </Link>
              <Link className="btn btn-secondary" to="/formulario">
                Solicitar un repuesto
              </Link>
            </div>
          </div>
          <figure className="hero-media">
            <img
              src="/assets/imagenes/hero-inventario.svg"
              alt="Motocarro e inventario de repuestos"
            />
          </figure>
        </div>
      </section>
      <section className="section container">
        <header className="section-header section-header-left">
          <h2>Inventario de la tienda</h2>
          <p>Resumen de los repuestos cargados.</p>
        </header>
        {cargando && (
          <div role="status" aria-label="Cargando inventario">
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </div>
        )}
        {error && (
          <p className="notice" role="alert">
            {error}{" "}
            <button className="btn btn-secondary btn-small" type="button" onClick={cargar}>
              Reintentar
            </button>
          </p>
        )}
        {!cargando && !error && (
          <>
            <div className="kpi-grid home-kpis">
              {[
                ["Total de repuestos", productos.length],
                ["Disponibles", disponibles],
                ["Stock bajo", bajos],
                ["Agotados", agotados],
                ["Valor del inventario", moneda(valor)],
              ].map(([etiqueta, valorKpi]) => (
                <Card key={etiqueta} titulo={etiqueta} className="kpi-card">
                  <p className="kpi-value">{valorKpi}</p>
                </Card>
              ))}
            </div>
            <div className="panel">
              <h3>Proporción del inventario</h3>
              {barras.map(([etiqueta, cantidad, tono]) => {
                const pct = porcentaje(cantidad, productos.length);
                return (
                  <div className="barra" key={etiqueta}>
                    <div className="barra-label">
                      <span>
                        {tono === "ok" ? "✓" : tono === "warn" ? "!" : "×"} {etiqueta}
                      </span>
                      <span>
                        {cantidad} · {pct}%
                      </span>
                    </div>
                    <div className="barra-track" aria-hidden="true">
                      <div className={"barra-fill barra-" + tono} style={{ width: pct + "%" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="panel">
              <h3>Repuestos críticos</h3>
              {criticos.length === 0 ? (
                <p>No hay repuestos con stock de 5 unidades o menos.</p>
              ) : (
                <ul className="critico-list">
                  {criticos.map((p) => (
                    <li key={p.id ?? p.codigo}>
                      {p.codigo} · {p.nombre} · {p.stock === 0 ? "× Agotado" : "! Stock bajo"} — {p.stock} unidades
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>
      <section className="section container">
        <header className="section-header">
          <h2>Todo en un solo lugar</h2>
          <p>Consulta, organización y seguimiento de las existencias.</p>
        </header>
        <div className="features-grid">
          {[
            [
              "Catálogo e inventario",
              "icono-inventario.svg",
              "Registre y edite sus repuestos.",
            ],
            [
              "Consulta y filtros",
              "icono-consulta.svg",
              "Busque por código, nombre, marca y categoría.",
            ],
            [
              "Compatibilidad",
              "icono-compatibilidad.svg",
              "Encuentre piezas para cada modelo.",
            ],
            [
              "Alertas de stock",
              "icono-alertas.svg",
              "Identifique las piezas agotadas o con pocas unidades.",
            ],
          ].map(([titulo, imagen, texto]) => (
            <Card key={titulo} titulo={titulo} imagen={imagen}>
              <p>{texto}</p>
            </Card>
          ))}
        </div>
        <form
          className="panel welcome-panel"
          onSubmit={(e) => {
            e.preventDefault();
            setSaludo(
              nombre.trim()
                ? `Bienvenido, ${nombre.trim()}. Gracias por visitar nuestro sistema.`
                : "Ingrese su nombre.",
            );
          }}
        >
          <h2>Bienvenido a la tienda</h2>
          <Campo
            nombre="visitante"
            etiqueta="Su nombre"
            valor={nombre}
            onChange={(_, v) => setNombre(v)}
            required
          />
          <button className="btn btn-secondary">Saludar</button>
          <p role="status">{saludo}</p>
        </form>
      </section>
    </>
  );
}
