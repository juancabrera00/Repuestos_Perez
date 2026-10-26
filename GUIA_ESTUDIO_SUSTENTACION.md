# Guía de estudio y sustentación — Repuestos Pérez

## 1. Respuesta inicial: ¿qué desarrollaron?

> Repuestos Pérez es una aplicación web para consultar y administrar el inventario de repuestos para motocarros. El frontend está construido con React y Vite, el backend con Node.js y Express, la comunicación se realiza mediante Axios y la información se almacena de forma persistente en PostgreSQL.

La aplicación permite:

- Consultar el catálogo de repuestos.
- Buscar y filtrar por código, nombre, marca, categoría, modelo y disponibilidad.
- Crear, editar y eliminar repuestos.
- Registrar solicitudes de repuestos.
- Validar los datos en frontend, backend y base de datos.

---

## 2. Arquitectura completa

```text
Usuario
  ↓
React
  ↓
Hook useCatalogo
  ↓
Axios
  ↓
API Express
  ↓
Middleware
  ↓
Controlador
  ↓
Modelo con SQL parametrizado
  ↓
PostgreSQL
```

### Ubicación de cada capa

| Parte | Ubicación |
|---|---|
| Entrada de React | `frontend/src/main.jsx` |
| Rutas de pantallas | `frontend/src/App.jsx` |
| Páginas | `frontend/src/pages/` |
| Componentes reutilizables | `frontend/src/components/` |
| Hook del catálogo | `frontend/src/hooks/useCatalogo.js` |
| Hook de solicitudes | `frontend/src/hooks/useSolicitudes.js` |
| Cliente Axios | `frontend/src/services/api.js` |
| Servicios de repuestos | `frontend/src/services/repuestosApi.js` |
| Servicios de solicitudes | `frontend/src/services/solicitudesApi.js` |
| Configuración del proxy | `frontend/vite.config.js` |
| Aplicación Express | `backend/src/app.js` |
| Arranque del servidor | `backend/src/server.js` |
| Rutas REST | `backend/src/routes/` |
| Middlewares | `backend/src/middlewares/` |
| Controladores | `backend/src/controllers/` |
| Modelos SQL | `backend/src/models/` |
| Conexión PostgreSQL | `backend/src/config/database.js` |
| Esquema de base de datos | `database/schema.sql` |
| Datos iniciales | `database/seed.sql` |

---

## 3. Frontend: React + Vite

### Entrada de la aplicación

Archivo: `frontend/src/main.jsx`

Aquí se monta React en el elemento `root` de `frontend/index.html`. También se configura `BrowserRouter` para navegar entre las páginas sin recargar todo el documento.

### Rutas de pantalla

Archivo: `frontend/src/App.jsx`

Las rutas principales son:

- `/` → `Home`
- `/proyecto` → `Proyecto`
- `/productos` → `Productos`
- `/formulario` → `Formulario`

El componente `App` también incluye el menú, el contenido principal y el pie de página.

### Pantallas

| Pantalla | Archivo | Función |
|---|---|---|
| Inicio | `frontend/src/pages/Home.jsx` | Presenta el proyecto y muestra resumen del inventario |
| Proyecto | `frontend/src/pages/Proyecto.jsx` | Explica el problema y la solución |
| Catálogo | `frontend/src/pages/Productos.jsx` | Gestiona el CRUD del inventario |
| Solicitud | `frontend/src/pages/Formulario.jsx` | Registra y consulta solicitudes |

### Componentes importantes del catálogo

| Componente | Archivo | Responsabilidad |
|---|---|---|
| Formulario | `frontend/src/components/productos/ProductoForm.jsx` | Crear y editar repuestos |
| Tabla | `frontend/src/components/productos/ProductosTable.jsx` | Mostrar, ordenar y accionar registros |
| Filtros | `frontend/src/components/productos/FiltrosProductos.jsx` | Buscar y filtrar |
| Indicadores | `frontend/src/components/productos/KPICatalogo.jsx` | Mostrar cantidades por estado |
| Stock crítico | `frontend/src/components/productos/StockCritico.jsx` | Mostrar productos con stock bajo |
| Confirmación | `frontend/src/components/productos/ConfirmarEliminacion.jsx` | Confirmar eliminaciones |

---

## 4. El hook `useCatalogo`

Archivo: `frontend/src/hooks/useCatalogo.js`

Este archivo conecta la pantalla del catálogo con los servicios Axios. Mantiene estos estados:

- `productos`: lista de repuestos.
- `cargando`: indica si se están consultando datos.
- `guardando`: indica si se está creando, editando o eliminando.
- `error`: mensaje de error.

Funciones principales:

| Función | Acción |
|---|---|
| `cargar()` | Ejecuta el GET y carga el catálogo |
| `crear(item)` | Ejecuta el POST y agrega el producto a la lista |
| `actualizar(id, item)` | Ejecuta el PUT y reemplaza el producto actualizado |
| `eliminar(id)` | Ejecuta el DELETE y quita el producto de la lista |

Cuando el componente se monta, `useEffect` llama a `cargar()`. Por eso la página consulta automáticamente el catálogo.

Respuesta para explicar:

> El hook centraliza la comunicación y el estado del catálogo. Así, la página `Productos.jsx` no necesita escribir directamente la lógica de Axios ni repetir el manejo de errores.

---

## 5. Axios y el proxy de Vite

Archivo base: `frontend/src/services/api.js`

```javascript
export const api = axios.create({
  baseURL: "/api",
  timeout: 8000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
```

La configuración también incluye `mensajeErrorApi`, que convierte errores de red,
timeout y respuestas HTTP en mensajes claros. `leerDato` comprueba que la
respuesta del servidor tenga la forma esperada antes de entregarla a React.

Los servicios están en:

- `frontend/src/services/repuestosApi.js`
- `frontend/src/services/solicitudesApi.js`

Ejemplos:

```text
api.get("/repuestos")
api.post("/repuestos", item)
api.put(`/repuestos/${id}`, item)
api.delete(`/repuestos/${id}`)
```

Archivo: `frontend/vite.config.js`

```javascript
proxy: {
  "/api": "http://localhost:3000",
}
```

En desarrollo:

- Vite/React funciona normalmente en `http://localhost:5173`.
- Express funciona en `http://localhost:3000`.
- Vite reenvía las peticiones que empiezan por `/api` hacia Express.

Respuesta para explicar:

> Axios es el cliente HTTP usado por el frontend. Se utiliza una URL base `/api` para no acoplar los componentes a una dirección específica. El proxy de Vite envía esas solicitudes al backend durante el desarrollo.

---

## 6. Backend: Node.js + Express

### Aplicación Express

Archivo: `backend/src/app.js`

Aquí se configura:

- `cors()`: permite solicitudes desde el frontend.
- `express.json({ limit: "100kb" })`: permite recibir JSON con un límite de tamaño.
- Rutas de repuestos.
- Rutas de solicitudes.
- Endpoint `/api/health`.
- Middleware para rutas inexistentes.
- Middleware general de errores.

`GET /api/health` responde `200` cuando Express y PostgreSQL están conectados.
Si la base no está disponible, responde `503 Service Unavailable` sin revelar
detalles internos de la conexión.

### Arranque del servidor

Archivo: `backend/src/server.js`

Este archivo importa la aplicación y la deja escuchando en el puerto definido en `PORT`, normalmente el `3000`.

---

## 7. Endpoints RESTful y CRUD

Archivo de rutas: `backend/src/routes/repuestos.routes.js`

| Método | Endpoint | Acción | Respuesta |
|---|---|---|---|
| GET | `/api/repuestos` | Lista todos los repuestos | `200` |
| GET | `/api/repuestos/:id` | Consulta un repuesto | `200` o `404` |
| POST | `/api/repuestos` | Crea un repuesto | `201` |
| PUT | `/api/repuestos/:id` | Actualiza un repuesto | `200` |
| DELETE | `/api/repuestos/:id` | Elimina un repuesto | `200` |
| GET | `/api/health` | Comprueba API y PostgreSQL | `200` o `503` |

Solicitudes:

| Método | Endpoint | Acción |
|---|---|---|
| GET | `/api/solicitudes` | Lista solicitudes |
| POST | `/api/solicitudes` | Crea una solicitud |

### Flujo del CRUD

#### GET

1. `useCatalogo` llama a `obtenerRepuestos()`.
2. Axios hace `GET /api/repuestos`.
3. La ruta llama a `listar`.
4. El controlador llama a `listarRepuestos`.
5. El modelo consulta PostgreSQL.
6. La respuesta vuelve a React.

#### POST

1. El usuario llena `ProductoForm`.
2. React valida el formulario.
3. Axios envía `POST /api/repuestos`.
4. `validarRepuesto` revisa el cuerpo.
5. El controlador llama a `crearRepuesto`.
6. El modelo ejecuta `INSERT`.
7. PostgreSQL devuelve el registro creado.

#### PUT

1. El usuario edita un repuesto.
2. Axios envía `PUT /api/repuestos/:id`.
3. Se valida el ID y el cuerpo.
4. El controlador verifica que exista.
5. El modelo actualiza nombre, categoría, marca, precio, stock y compatibilidad.
6. El código no se modifica.

#### DELETE

1. La interfaz pide confirmación.
2. Axios envía `DELETE /api/repuestos/:id`.
3. El modelo elimina el registro.
4. React lo quita de la lista.

---

## 8. Middlewares y validaciones

Ubicación: `backend/src/middlewares/`

### `validarId.js`

Comprueba que el ID sea un entero positivo. Rechaza:

```text
0, -1, 1.5, abc
```

### `validarRepuesto.js`

Valida:

- Código de mínimo 3 caracteres.
- Código de máximo 40 caracteres.
- Nombre de mínimo 3 caracteres.
- Nombre de máximo 120 caracteres.
- Categoría obligatoria.
- Categoría de máximo 80 caracteres.
- Marca obligatoria.
- Marca de máximo 80 caracteres.
- Precio numérico y mayor o igual a cero.
- Precio con máximo dos decimales y dentro del rango de PostgreSQL.
- Stock entero y mayor o igual a cero.
- Al menos un modelo compatible, máximo 20 modelos y 80 caracteres por modelo.

También normaliza el código:

```text
abc-01 → ABC-01
```

### `validarSolicitud.js`

Valida:

- Nombre de mínimo 3 caracteres.
- Correo válido.
- Teléfono opcional con formato correcto.
- Repuesto solicitado.
- Observaciones de mínimo 10 caracteres.

### `notFound.js`

Responde `404` cuando la ruta no existe.

### `errorHandler.js`

Convierte errores técnicos en respuestas HTTP:

| Código PostgreSQL | Significado | HTTP |
|---|---|---|
| `23505` | Código duplicado | `409` |
| `23514` | No se cumple un `CHECK` | `400` |
| `23502` | Campo obligatorio ausente | `400` |
| `22001`, `22003` | Texto demasiado largo o número fuera de rango | `400` |
| Error de conexión | PostgreSQL no disponible | `503` |
| Otros | Error no controlado | `500` |

Respuesta para explicar:

> Un middleware se ejecuta durante el procesamiento de la petición. En este proyecto permite validar datos antes del controlador y centralizar el manejo de errores.

---

## 9. Controladores y modelos

### Controladores

Ubicación: `backend/src/controllers/`

- `repuestos.controller.js`
- `solicitudes.controller.js`

El controlador coordina la petición y la respuesta. No contiene directamente las consultas SQL.

### Modelos

Ubicación: `backend/src/models/`

- `repuestos.model.js`
- `solicitudes.model.js`

Los modelos ejecutan las consultas contra PostgreSQL.

Ejemplo de consulta parametrizada:

```javascript
pool.query(
  "SELECT ... FROM repuestos WHERE id = $1",
  [id],
);
```

Respuesta para explicar:

> La separación entre rutas, middlewares, controladores y modelos facilita el mantenimiento. Cada capa tiene una responsabilidad específica.

---

## 10. PostgreSQL e integridad de datos

### Conexión

Archivo: `backend/src/config/database.js`

Utiliza `pg` y un `Pool` de conexiones. Las credenciales se leen desde `backend/.env`, que no se sube al repositorio.

### Tablas

Archivo: `database/schema.sql`

Tablas:

- `repuestos`
- `solicitudes`

Reglas importantes de `repuestos`:

- `id` es clave primaria.
- `codigo` es obligatorio y único.
- Nombre, categoría y marca no pueden estar vacíos.
- `precio >= 0`.
- `stock >= 0`.
- Debe existir al menos un modelo compatible.
- `created_at` y `updated_at` se generan automáticamente.

También existe un índice sobre `upper(codigo)` para evitar que convivan códigos como `ABC-01` y `abc-01`.

Archivo: `database/seed.sql`

Carga los 12 repuestos iniciales y evita duplicarlos mediante `ON CONFLICT`.

### Tres niveles de validación

1. **Frontend**: muestra errores rápidamente al usuario.
2. **Backend**: protege la API aunque alguien evite el formulario.
3. **PostgreSQL**: garantiza la integridad definitiva de los datos.

Respuesta clave:

> No se confía únicamente en el frontend porque el navegador puede ser manipulado. Por eso el backend vuelve a validar y PostgreSQL aplica restricciones permanentes.

---

## 11. Demostración recomendada en la feria

### Preparación

Terminal 1:

```powershell
cd backend
npm start
```

Terminal 2:

```powershell
cd frontend
npm run dev
```

Si la base local se detuvo, iniciar PostgreSQL según las instrucciones de `README.md`.

### Orden de demostración

1. Mostrar Inicio y explicar el objetivo.
2. Entrar a Catálogo y mostrar los 12 registros.
3. Explicar que la carga inicial ejecuta un GET.
4. Crear un repuesto de prueba.
5. Editar su stock.
6. Mostrar que el código está bloqueado al editar.
7. Filtrar por modelo o disponibilidad.
8. Eliminar el registro y confirmar.
9. Recargar la página para demostrar persistencia.
10. Intentar un precio negativo o stock decimal para mostrar validación.
11. Registrar una solicitud desde la pantalla Solicitud.

Datos de prueba sugeridos:

```text
Código: DEMO-PPI-01
Nombre: Filtro de prueba
Categoría: Filtros
Marca: Bosch
Precio: 25000
Stock: 10
Compatibilidad: Bajaj RE
```

Después de la demostración, se puede eliminar el registro de prueba.

---

## 12. Preguntas frecuentes

### ¿Por qué React no se conecta directamente a PostgreSQL?

Porque el navegador no debe conocer las credenciales de la base de datos. Express funciona como intermediario seguro.

### ¿Qué es REST?

Es un estilo para construir APIs usando recursos y métodos HTTP. El recurso principal es `repuestos`.

### ¿Qué significa `201`?

Que se creó correctamente un recurso.

### ¿Qué significa `404`?

Que la ruta o el registro solicitado no existe.

### ¿Qué significa `409`?

Que existe un conflicto; en este caso, un código de repuesto repetido.

### ¿Cómo se evita SQL Injection?

Usando consultas parametrizadas con `$1`, `$2`, etc., en lugar de concatenar datos del usuario dentro del SQL.

### ¿Por qué el código no se puede cambiar al editar?

Porque el campo se deshabilita en `ProductoForm.jsx`, el controlador lo verifica y el `UPDATE` del modelo no incluye la columna `codigo`.

### ¿Las solicitudes envían correo?

No. En este prototipo académico se guardan en PostgreSQL, pero no se envía correo real.

### ¿Qué pruebas existen?

Frontend:

```powershell
cd frontend
npm test
npm run build
```

Backend:

```powershell
cd backend
npm test
```

Las pruebas están en:

- `frontend/tests/inventario.test.js`
- `backend/tests/validaciones.test.js`

---

## 13. Cierre de la sustentación

> En conclusión, el proyecto integra frontend, backend y base de datos. React y Vite manejan la interfaz, Axios comunica el frontend con la API, Express organiza las rutas, middlewares y controladores, y PostgreSQL almacena y protege la información. El resultado es un CRUD persistente con endpoints RESTful, validaciones en varias capas y una aplicación lista para demostración.

---

## 14. Respuestas cortas para memorizar

### ¿Dónde está creada la API?

> La API está creada en el backend con Node.js y Express. La configuración principal está en `backend/src/app.js` y el servidor se inicia desde `backend/src/server.js`, normalmente en `http://localhost:3000`.

### ¿Dónde están los endpoints?

> Los endpoints de repuestos están en `backend/src/routes/repuestos.routes.js` y los de solicitudes en `backend/src/routes/solicitudes.routes.js`. Allí se definen los métodos GET, POST, PUT y DELETE.

### ¿Dónde está la conexión a PostgreSQL?

> Está en `backend/src/config/database.js`. Allí se importa `pg`, se crea un `Pool` de conexiones y se leen las variables de entorno del archivo `backend/.env`.

### ¿Dónde se utiliza esa conexión?

> Los modelos `backend/src/models/repuestos.model.js` y `backend/src/models/solicitudes.model.js` importan el `pool` y ejecutan consultas con `pool.query()`.

### ¿Dónde está implementado Axios?

> Axios está implementado en `frontend/src/services/api.js`, donde se crea la instancia con `baseURL: "/api"`. Las peticiones de repuestos están en `frontend/src/services/repuestosApi.js` y las de solicitudes en `frontend/src/services/solicitudesApi.js`.

### ¿Cómo llega Axios al backend?

> Axios usa rutas como `/api/repuestos`. El proxy de `frontend/vite.config.js` reenvía esas peticiones hacia `http://localhost:3000`, donde las recibe Express.

### ¿Dónde están los middlewares?

> Están en `backend/src/middlewares/`. `validarId` valida identificadores, `validarRepuesto` valida los datos del CRUD, `validarSolicitud` valida solicitudes, `notFound` maneja rutas inexistentes y `errorHandler` centraliza los errores.

### ¿Qué hace un middleware?

> Un middleware se ejecuta durante el procesamiento de una petición. Puede validar datos, modificar `req`, responder con un error o llamar a `next()` para continuar hacia el controlador.

### ¿Dónde están las validaciones que no son middlewares?

> En el frontend están principalmente en `frontend/src/utils/inventario.js`, mediante `validarRepuesto`, `validarSolicitud` y `catalogoValido`. También se controla el envío en `ProductoForm.jsx` y `Formulario.jsx`. En el backend, los controladores validan reglas de negocio, como comprobar que exista un repuesto y evitar que cambie su código. PostgreSQL aplica las restricciones definitivas en `database/schema.sql`.

### ¿Dónde están los controladores?

> Están en `backend/src/controllers/`. `repuestos.controller.js` contiene `listar`, `obtener`, `crear`, `actualizar` y `eliminar`. `solicitudes.controller.js` contiene las funciones para listar y crear solicitudes.

### ¿Qué hace un controlador?

> Recibe la petición después de los middlewares, llama al modelo que ejecuta el SQL y devuelve una respuesta JSON con el código HTTP correspondiente. Si ocurre un error, usa `next(err)` para enviarlo a `errorHandler`.

### ¿Cuál es la diferencia entre ruta, middleware, controlador y modelo?

> La ruta define el método y la URL; el middleware valida o prepara la petición; el controlador coordina la operación y la respuesta; y el modelo ejecuta las consultas contra PostgreSQL.

### ¿Por qué hay validaciones en varias capas?

> La validación del frontend mejora la experiencia del usuario, el backend protege la API aunque alguien evite el formulario y PostgreSQL garantiza la integridad definitiva de los datos.

### ¿Por qué React no se conecta directamente a PostgreSQL?

> Porque el navegador no debe conocer las credenciales de la base de datos. Express funciona como intermediario entre React y PostgreSQL.

### ¿Cómo se evita SQL Injection?

> Las consultas usan parámetros como `$1`, `$2` y no concatenan directamente los datos del usuario dentro del SQL.

### ¿Por qué el código no se puede modificar?

> En el frontend el campo queda deshabilitado al editar; el controlador compara el código recibido con el almacenado; y el `UPDATE` del modelo no incluye la columna `codigo`.

### ¿Qué ocurre si se repite un código?

> PostgreSQL genera el error `23505`. `errorHandler.js` lo convierte en una respuesta `409 Conflict` con el mensaje de código duplicado.

### ¿Qué significan los códigos HTTP principales?

> `200` indica una operación exitosa, `201` que se creó un recurso, `400` que los datos son inválidos, `404` que no existe la ruta o el registro, `409` que hay un conflicto, `503` que PostgreSQL no está disponible y `500` que ocurrió un error interno.

### ¿Las solicitudes envían correos?

> No. Este prototipo académico guarda las solicitudes en PostgreSQL, pero no envía correos ni crea pedidos reales.

---

## 15. Actualización de la última versión

La versión nueva conserva la arquitectura principal:

```text
React + Vite → Axios → Express → controladores → modelos SQL → PostgreSQL
```

Pero incorpora mejoras importantes para la demostración y la sustentación.

### Backend reforzado

Archivos relacionados:

- `backend/src/app.js`
- `backend/src/middlewares/validarRepuesto.js`
- `backend/src/middlewares/validarSolicitud.js`
- `backend/src/middlewares/errorHandler.js`

Cambios:

- `express.json` limita el cuerpo recibido a `100kb`.
- `GET /api/health` informa si la API y PostgreSQL están conectados.
- Una base caída responde `503`, no `500`.
- Se controlan errores de conexión como `ECONNREFUSED`, `ETIMEDOUT` y otros.
- Se controlan textos demasiado largos (`22001`) y números fuera de rango (`22003`).
- Los textos ahora respetan los tamaños máximos de las columnas.
- El precio acepta máximo dos decimales.
- El stock respeta el rango de un entero de PostgreSQL.
- La compatibilidad permite hasta 20 modelos de máximo 80 caracteres cada uno.

### Axios más seguro y claro

Archivo: `frontend/src/services/api.js`

La instancia ahora incluye:

- `baseURL: "/api"`.
- Timeout de 8 segundos.
- Cabeceras JSON.
- `mensajeErrorApi` para mostrar mensajes según el tipo de error.
- `leerDato` para verificar que las respuestas sean listas u objetos válidos.

Los servicios que utilizan estas funciones están en:

- `frontend/src/services/repuestosApi.js`
- `frontend/src/services/solicitudesApi.js`

### Mejoras de los hooks

Archivos:

- `frontend/src/hooks/useCatalogo.js`
- `frontend/src/hooks/useSolicitudes.js`

Los hooks ahora centralizan los mensajes de error mediante `mensajeErrorApi`.
Además, `useSolicitudes` tiene el estado `enviando` para evitar dobles envíos
cuando se registra una solicitud.

### Mejoras visuales

Se agregó la dependencia `lucide-react` en `frontend/package.json`.

Se utiliza en:

- `frontend/src/components/productos/ProductosTable.jsx`: estados de stock,
  editar y eliminar.
- `frontend/src/components/Toast.jsx`: iconos de éxito, advertencia y error.
- `frontend/src/pages/Productos.jsx`: aviso de error y estado vacío.

También se deshabilitan botones durante las operaciones:

- `Guardando…`
- `Eliminando…`
- `Registrando…`

Esto evita solicitudes duplicadas y hace visible el estado del sistema.

### Pruebas actualizadas

La versión nueva tiene:

- 9 pruebas frontend exitosas.
- 8 pruebas backend exitosas.
- Build de Vite exitoso.

Se añadieron pruebas para longitudes máximas, precios con más de dos decimales,
notación científica, errores de PostgreSQL y conexión caída.

### Postman

La colección está en:

`postman/Repuestos-Perez.postman_collection.json`

También existe la estructura de carpetas en:

`postman/collections/Repuestos Perez/`

Incluye:

- `Salud`: `GET /api/health`.
- `CRUD`: GET, POST, PUT y DELETE.
- `Errores`: respuestas 400, 404 y 409.
- `Solicitudes`: GET y POST.

El entorno local está en:

`postman/environments/Local.environment.yaml`

La variable `baseUrl` vale:

```text
http://localhost:3000
```

Para demostrar el CRUD en Postman:

1. Ejecuta `POST crear repuesto`.
2. La colección guarda automáticamente el `id`.
3. Ejecuta el `PUT actualizar repuesto`.
4. Ejecuta el `DELETE eliminar repuesto`.

### Documentación nueva

La versión nueva también agrega:

- `docs/AUDITORIA_REQUISITOS.md`: revisión requisito por requisito.
- `docs/GUIA_SUSTENTACION.md`: guía técnica enfocada en la entrega.

Tu guía actual sigue siendo la referencia principal para estudiar, porque reúne
las explicaciones y respuestas cortas de esta sustentación.
