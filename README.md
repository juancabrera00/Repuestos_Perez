# Repuestos Pérez

Aplicación web para consultar y administrar el catálogo de repuestos para motocarros de la tienda en Remedios, Antioquia.

El inventario vive en PostgreSQL. React muestra la interfaz y Express responde las peticiones.

## Arquitectura

```text
Navegador (React)
  -> hook useCatalogo
  -> Axios, rutas /api
  -> Express
  -> middleware
  -> controlador
  -> consulta SQL con parámetros
  -> PostgreSQL
```

En desarrollo, Vite reenvía `/api` a `http://localhost:3000`. Los componentes no escriben esa dirección.

## Tecnologías

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express, pg, cors, dotenv
- Base de datos: PostgreSQL

## Requisitos

- Node.js 22 o superior
- PostgreSQL 14 o superior, en marcha
- Dos terminales

## Base de datos

En este equipo el servicio de Windows `postgresql-x64-17` no arranca: pedía permisos de administrador y su carpeta de datos (`C:\Program Files\PostgreSQL\17\data`) no es un clúster (solo tiene carpetas vacías `log` y `pg_wal`, sin `postgresql.conf`).

El servidor que sí está en uso es un clúster local de PostgreSQL 17, en `%LOCALAPPDATA%\repuestos-perez-pg`, puerto 5432, usuario `postgres`, autenticación trust en localhost. La base `repuestos_perez` ya tiene el esquema y los 12 repuestos.

Si el computador se reinicia, vuelva a levantarlo:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D "$env:LOCALAPPDATA\repuestos-perez-pg" -l "$env:LOCALAPPDATA\repuestos-perez-pg\server.log" -o "-p 5432" start
```

En otro equipo, con un PostgreSQL normal ya en marcha:

```sql
CREATE DATABASE repuestos_perez;
```

```bash
psql -U postgres -d repuestos_perez -f database/schema.sql
psql -U postgres -d repuestos_perez -f database/seed.sql
```

`schema.sql` crea `repuestos` y `solicitudes`. `seed.sql` carga los 12 repuestos. Si el código ya existe, no lo duplica.

## Configuración

En este equipo ya existe `backend/.env`. La contraseña queda vacía porque el clúster local acepta conexiones de confianza en localhost. No suba ese archivo. En otro equipo, copie el ejemplo y escriba la contraseña real solo ahí:

```bash
cd backend
copy .env.example .env
```

`.env` no se sube al repositorio. Valores de ejemplo:

```text
DB_HOST=localhost
DB_PORT=5432
DB_NAME=repuestos_perez
DB_USER=postgres
DB_PASSWORD=tu_password
PORT=3000
```

## Cómo iniciarlo

Terminal 1, API:

```bash
cd backend
npm install
npm start
```

Queda en `http://localhost:3000`.

Terminal 2, interfaz:

```bash
cd frontend
npm install
npm run dev
```

Abra la dirección que muestre Vite, por lo general `http://localhost:5173/`.

No abra `index.html` con doble clic.

## Endpoints

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | /api/repuestos | Lista el catálogo |
| GET | /api/repuestos/:id | Un repuesto |
| POST | /api/repuestos | Crea un repuesto. Responde 201 |
| PUT | /api/repuestos/:id | Actualiza. El código no cambia |
| DELETE | /api/repuestos/:id | Elimina. Responde 200 con un mensaje |
| GET | /api/solicitudes | Lista solicitudes |
| POST | /api/solicitudes | Registra una solicitud |

Errores habituales: 400 datos inválidos, 404 no existe, 409 código repetido, 500 fallo del servidor o de la conexión.

## Probar el CRUD

1. Abra Catálogo. Deben verse los 12 repuestos del seed.
2. Agregue uno con un código nuevo.
3. Edite el stock. El código sale deshabilitado.
4. Elimínelo y confirme.
5. Recargue el navegador. El alta y la edición siguen; el eliminado no vuelve.

Eso solo ocurre si PostgreSQL está corriendo y el `.env` es correcto.

## Carpetas

```text
frontend/     React
backend/      Express
database/     schema.sql y seed.sql
docs/         Arquitectura, sustentación y reporte
```

## Pruebas automáticas

```bash
cd frontend
npm test
npm run build

cd backend
npm test
```

Las pruebas del backend revisan validaciones y el código 409. No levantan PostgreSQL.

## Equipo

Daniel Bermúdez Pérez, Sheril Daniela Silva Garcia y Juan Camilo Cabrera Roa.
Tecnológico de Antioquia, Construcción de software 3.

## Errores comunes

- `ECONNREFUSED` en el puerto 5432: el clúster no está levantado. En este equipo use el comando `pg_ctl` de arriba. `net start postgresql-x64-17` pide administrador y, además, ese servicio no tiene un clúster inicializado.
- La página dice que no puede cargar el catálogo: la API no está en el puerto 3000, o el `.env` no coincide con la base.
- Código duplicado: la API responde 409. Cambie el código.
- Al editar, “el código no se puede modificar”: el PUT no cambia `codigo`.
- `npm run dev` desde la carpeta equivocada: los comandos de la interfaz van en `frontend` y los de la API en `backend`.
