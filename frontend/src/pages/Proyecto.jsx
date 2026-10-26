import React from "react";
import Card from "../components/Card";
export default function Proyecto() {
  return (
    <section className="section container">
      <header className="section-header">
        <h1>Sobre el proyecto</h1>
        <p>Una herramienta para organizar los repuestos de la tienda.</p>
      </header>
      <div className="problem-grid">
        <img
          src="/assets/imagenes/problema-manual.svg"
          alt="Comparación entre registros manuales e inventario digital"
        />
        <div className="problem-cards">
          <Card titulo="El problema">
            El inventario manual y las herramientas no integradas generan
            errores, búsquedas lentas y poca trazabilidad de las existencias.
          </Card>
          <Card titulo="A quién está dirigido">
            A la propietaria y al personal de mostrador de Repuestos Pérez,
            quienes atienden a conductores y talleres de motocarros en Remedios,
            Antioquia.
          </Card>
          <Card titulo="La solución">
            Consultar y organizar repuestos por categoría, marca, precio,
            compatibilidad y disponibilidad. Esta entrega es un prototipo
            académico con datos de ejemplo; las solicitudes no se envían a la
            tienda.
          </Card>
        </div>
      </div>
      <header className="section-header">
        <h2>Cómo funciona Repuestos Pérez</h2>
      </header>
      <ol className="flujo">
        <li>React</li>
        <li>Axios</li>
        <li>Express</li>
        <li>PostgreSQL</li>
      </ol>
      <div className="features-grid">
        <Card titulo="Frontend">React + Vite</Card>
        <Card titulo="Comunicación">Axios + REST + JSON</Card>
        <Card titulo="Backend">Node.js + Express</Card>
        <Card titulo="Base de datos">PostgreSQL</Card>
      </div>
    </section>
  );
}
