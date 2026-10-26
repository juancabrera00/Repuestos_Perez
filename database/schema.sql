-- Repuestos Pérez. Ejecutar sobre una base vacía llamada repuestos_perez.

CREATE TABLE IF NOT EXISTS repuestos (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(40) NOT NULL UNIQUE,
  nombre VARCHAR(120) NOT NULL,
  categoria VARCHAR(80) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  precio NUMERIC(12, 2) NOT NULL,
  stock INTEGER NOT NULL,
  compatibilidad TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT codigo_no_vacio CHECK (btrim(codigo) <> ''),
  CONSTRAINT nombre_no_vacio CHECK (btrim(nombre) <> ''),
  CONSTRAINT categoria_no_vacia CHECK (btrim(categoria) <> ''),
  CONSTRAINT marca_no_vacia CHECK (btrim(marca) <> ''),
  CONSTRAINT precio_no_negativo CHECK (precio >= 0),
  CONSTRAINT stock_no_negativo CHECK (stock >= 0),
  CONSTRAINT compatibilidad_con_modelo CHECK (cardinality(compatibilidad) >= 1)
);

CREATE UNIQUE INDEX IF NOT EXISTS repuestos_codigo_mayusculas
  ON repuestos (upper(codigo));

CREATE TABLE IF NOT EXISTS solicitudes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL,
  telefono VARCHAR(20),
  repuesto VARCHAR(120) NOT NULL,
  observaciones TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT solicitud_nombre CHECK (char_length(btrim(nombre)) >= 3),
  CONSTRAINT solicitud_correo CHECK (correo LIKE '%@%.%'),
  CONSTRAINT solicitud_repuesto CHECK (char_length(btrim(repuesto)) >= 3),
  CONSTRAINT solicitud_detalle CHECK (char_length(btrim(observaciones)) >= 10)
);
