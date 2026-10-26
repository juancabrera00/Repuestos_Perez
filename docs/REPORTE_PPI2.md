# Reporte PPI 2 — Repuestos Pérez

## 1. Estado inicial

Había dos aplicaciones. `repuestos-perez/` era una SPA React con el inventario en `localStorage`. `proyecto/` era la versión HTML/CSS/JS, con el mismo catálogo armado mediante `getElementById` e `innerHTML`. No existían Express, Axios ni PostgreSQL.

## 2. Problemas encontrados

- La observación del profesor coincidía con `proyecto/`: esa interfaz nunca se migró porque era otra aplicación, no un componente a medias.
- El CRUD de React no sobrevivía fuera de ese navegador.
- `Productos.jsx` concentraba filtros, indicadores, tabla, formulario y confirmación.
- No había `vite.config.js`.

## 3. Archivos eliminados

- `proyecto/` completo, después de comparar función por función. React ya tenía inicio, problema, saludo, menú, filtros, KPIs, CRUD, alertas, solicitud y pie. La versión HTML no aportaba una función que faltara. Su validación era más débil: un precio vacío se convertía en 0.
- `frontend/src/components/FormularioRepuesto.jsx`, reemplazado por `ProductoForm.jsx`.
- `frontend/src/data/catalogo.js`. Los mismos 12 repuestos quedaron en `database/seed.sql`.

## 4. Archivos modificados

- `frontend/src/pages/Productos.jsx`
- `frontend/src/pages/Formulario.jsx`
- `frontend/src/App.jsx`
- `frontend/src/hooks/useCatalogo.js`
- `frontend/src/components/productos/ConfirmarEliminacion.jsx`
- `frontend/package.json` y `package-lock.json` (Axios)
- `frontend/tests/inventario.test.js` (se agregó un caso; no se borraron los anteriores)
- `.gitignore`
- `README.md`
- `docs/justificacion.txt`

## 5. Archivos creados

Frontend: `vite.config.js`, `services/api.js`, `services/repuestosApi.js`, `services/solicitudesApi.js`, `hooks/useSolicitudes.js`, y los componentes `KPICatalogo`, `FiltrosProductos`, `ProductosTable`, `ProductoForm`, `StockCritico`, `ConfirmarEliminacion`.

Backend: `package.json`, `.env.example`, `src/app.js`, `src/server.js`, `config/database.js`, modelo, controlador y rutas de repuestos y de solicitudes, middlewares y `tests/validaciones.test.js`.

Base: `database/schema.sql`, `database/seed.sql`.

Docs: `ARQUITECTURA.md`, `GUIA_SUSTENTACION_PPI2.md`, este reporte.

## 6 y 7. React

Toda la interfaz sale de componentes. El único `index.html` funcional es el de Vite. El único `getElementById` es el montaje en `main.jsx`. El menú escucha Escape dentro de `useEffect` y quita el listener al cerrar; la interfaz sigue siendo JSX.

`Productos` quedó como página que coordina. Los bloques con responsabilidad propia están en `components/productos/`.

## 8. localStorage

`useCatalogo` ya no lee ni escribe `localStorage`. Crear, editar y borrar pasan por Axios. Las solicitudes también.

## 9 a 15. Backend, endpoints, validación y Axios

Rutas en `backend/src/routes/repuestos.routes.js`:

- GET `/api/repuestos`
- GET `/api/repuestos/:id`
- POST `/api/repuestos`
- PUT `/api/repuestos/:id`
- DELETE `/api/repuestos/:id` responde 200 con JSON

Solicitudes, en segundo lugar: GET y POST `/api/solicitudes`.

Middlewares: `validarId`, `validarRepuesto`, `validarSolicitud`, `notFound`, `errorHandler`.

Controladores: `repuestos.controller.js` y `solicitudes.controller.js`.

El SQL usa `$1`, `$2`, etc. El `UPDATE` no toca `codigo`. Un `23505` se traduce a 409.

PostgreSQL exige código, nombre, categoría y marca no vacíos, precio `NUMERIC(12,2) >= 0`, stock entero `>= 0` y al menos un modelo en `compatibilidad`.

Axios usa `baseURL: "/api"`. El proxy está en `frontend/vite.config.js`. Express mantiene `cors`.

## 16 y 17. Pruebas ejecutadas

Frontend, Node v22:

- `npm test`: 8 pasaron, 0 fallaron. Las 7 anteriores siguen. Se agregó el caso de NaN e Infinity.
- `npm run build`: correcto. Vite avisó de `"use client"` en React Router; el build terminó igual.

Backend:

- `npm test`: 6 pasaron, 0 fallaron. Cubren código, precio, stock, id, solicitud vacía y el 409 del error `23505`.

Con la API encendida y PostgreSQL detenido se llamó en vivo:

- GET `/api/repuestos` → 500, JSON `Error interno del servidor.`
- POST con código corto → 400
- POST con cuerpo válido → 500, porque no hay conexión a la base
- PUT `/api/repuestos/3` con cuerpo válido → 500, el middleware dejó pasar y falló la base
- DELETE `/api/repuestos/3` → 500, por la misma razón
- GET `/api/repuestos/0` → 400
- GET `/api/no-existe` → 404
- POST `/api/solicitudes` vacío → 400

## 18. PostgreSQL, verificado el 7 de octubre de 2026

El servicio `postgresql-x64-17` sigue detenido. `net start` responde error 5 (acceso denegado) y la carpeta `C:\Program Files\PostgreSQL\17\data` no es un clúster: solo contiene `log` y `pg_wal`, sin `PG_VERSION` ni `postgresql.conf`.

Se creó un clúster local con `initdb` en `%LOCALAPPDATA%\repuestos-perez-pg` y se inició con `pg_ctl` en el puerto 5432. Sobre esa base se ejecutaron `schema.sql` y `seed.sql`. `information_schema` mostró las tablas `repuestos` y `solicitudes`, los `CHECK`, el `UNIQUE` de `codigo` y el índice `upper(codigo)`. `SELECT COUNT(*)` devolvió 12.

Con Express conectado a esa base:

- GET `/api/repuestos` → 200 y 12 registros.
- POST `TEST-PPI-CRUD-01` → 201, id 18. GET por id → 200.
- PUT cambió nombre, precio 18000 y stock 4. El código no cambió. GET posterior → 200 con esos datos.
- DELETE → 200. GET del mismo id → 404.
- Segundo POST `test-ppi-dup-01` → 409.
- Precio −1, stock −1, stock 1.5, NaN e Infinity → 400.
- Textos vacíos → 400. Ids `0`, `abc` y `-1` → 400.
- POST de solicitud válido → 201. GET la devolvió. POST vacío → 400.
- Inserciones SQL directas de precio negativo, stock negativo, código en blanco, código repetido y `buj-ngk-01` fallaron por `CHECK` o `UNIQUE`. El conteo siguió en 12.

En Chrome, contra `http://127.0.0.1:5173/productos`:

- Se vieron 12 filas y KPIs 12/6/4/2.
- Se creó `TEST-PPI-UI-01`, se recargó y seguía.
- Se editó el stock a 1 (Stock bajo) y, tras recargar, seguía en 1 unidad.
- El filtro por modelo Bajaj RE dejó 9 filas y el repuesto apareció en alertas.
- Se eliminó. Una carga nueva mostró otra vez 12 filas y ya no el código de prueba.
- La solicitud vacía marcó errores. Una solicitud válida seguía después de recargar.

Los registros de prueba se borraron. Quedan 12 repuestos y 0 solicitudes.

## 19. Riesgos

- Si se reinicia el computador hay que volver a ejecutar `pg_ctl`. El servicio de Windows no sustituye a ese clúster.
- `npm install` de Axios avisó una vulnerabilidad alta. No se cambió la versión.
- Las solicitudes no tienen edición ni borrado.

## 20. Checklist

- [x] React + Vite
- [x] Todo el frontend migrado a React
- [x] Node.js
- [x] Express
- [x] Axios
- [x] PostgreSQL levantado (clúster local, no el servicio de Windows)
- [x] Schema ejecutado
- [x] Seed ejecutado (12 filas)
- [x] GET, POST, PUT y DELETE reales
- [x] CRUD persistente y recarga en el navegador
- [x] Middlewares y controladores
- [x] Validaciones de frontend, backend y CHECK/UNIQUE de PostgreSQL
- [x] 409, 404 y 500
- [x] Solicitud persistente
- [x] Tests frontend: 8 pasaron, 0 fallaron
- [x] Build de Vite correcto
- [x] Tests backend: 6 pasaron, 0 fallaron
- [x] README actualizado
- [x] Listo para demostrar con el clúster local en marcha

Los endpoints quedaron marcados porque la API respondió esos métodos con el código HTTP esperado cuando la base no está. El CRUD persistente y las restricciones de PostgreSQL no se marcan: el servidor de base de datos no llegó a ejecutar el SQL.
