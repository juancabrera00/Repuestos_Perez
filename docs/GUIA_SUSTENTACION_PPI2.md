# Guía breve para la sustentación PPI 2

## Preguntas y respuestas

**¿Qué es React?**
Una biblioteca para construir la interfaz con componentes. Cuando cambia el estado, React vuelve a dibujar esa parte. En este proyecto el arranque está en `frontend/src/main.jsx`.

**¿Qué es un componente?**
Una función que devuelve la interfaz. Ejemplos: `Navbar`, `ProductoForm`, `ProductosTable`, `KPICatalogo`, `Footer`.

**¿Qué es una SPA?**
Una sola página HTML (`frontend/index.html`, solo el `div#root`). Al ir a Catálogo o Solicitud no se carga otro HTML: React Router cambia la vista.

**¿Qué es Axios y dónde está?**
Es el cliente HTTP. Está en `frontend/src/services/api.js`, con `baseURL: "/api"`. `repuestosApi.js` llama a obtener, crear, actualizar y eliminar. Los componentes no usan Axios directamente: pasan por el hook.

**¿Qué es una API y qué es REST?**
La API es el programa Express que responde en el puerto 3000. REST organiza esas respuestas en recursos y verbos. El recurso es `/api/repuestos`.

**¿Dónde están GET, POST, PUT y DELETE?**
En `backend/src/routes/repuestos.routes.js`. GET lista o busca por id. POST crea y responde 201. PUT actualiza y responde 200. DELETE borra y responde 200 con un JSON. No hay PATCH.

**¿Qué es Express y dónde está?**
El framework del servidor. `backend/src/app.js` arma la aplicación. `backend/src/server.js` la pone a escuchar.

**¿Qué es un middleware?**
Una función que corre antes del controlador. Archivos en `backend/src/middlewares/`: `validarId`, `validarRepuesto`, `validarSolicitud`, `notFound` y `errorHandler`.

**¿Qué es un controlador?**
Traduce la petición HTTP a una acción. `backend/src/controllers/repuestos.controller.js`. No escribe el SQL: llama al modelo.

**¿Qué es PostgreSQL y dónde está la conexión?**
La base de datos. La conexión está en `backend/src/config/database.js` y lee `.env`. Las tablas están en `database/schema.sql`. En este computador el servicio de Windows no tiene un clúster válido. El servidor que responde en el puerto 5432 es el clúster de `%LOCALAPPDATA%\repuestos-perez-pg`. Si el equipo se reinicia, hay que iniciarlo con `pg_ctl`, como dice el README.

**¿Qué es un endpoint?**
Una ruta más un método. Por ejemplo `GET /api/repuestos`.

**¿Cómo funciona el CRUD?**
Listar: la página Catálogo monta `useCatalogo`, que hace GET. Crear: el formulario llama a `crear`, POST. Editar: PUT con el id, sin cambiar el código. Eliminar: DELETE. Al recargar, el GET vuelve a leer la base.

**¿Dónde se validan los datos?**
En `frontend/src/utils/inventario.js`, otra vez en `validarRepuesto.js` del backend, y con `CHECK` en PostgreSQL. Están repetidas a propósito: el navegador se puede saltar.

**¿Dónde se maneja un código duplicado?**
El middleware no consulta la base. El `INSERT` choca con `UNIQUE` o con el índice de mayúsculas. El error `23505` llega a `errorHandler.js` y sale como 409.

**¿Dónde está el 404?**
Si el id no existe, el controlador responde 404. Si la ruta no existe, `notFound.js` responde 404. En la interfaz, una ruta desconocida muestra “Página no encontrada”.

**¿Dónde está el 500?**
En `errorHandler.js`, cuando la falla no es de validación ni de duplicado. El mensaje al cliente es “Error interno del servidor.” No se envía la consulta SQL.

**¿Por qué el código no se edita?**
El campo va deshabilitado en `ProductoForm`. Además, el controlador compara el código recibido con el guardado y, si difieren, responde 400. El `UPDATE` no incluye `codigo`.

## Recorrido para mostrar en la feria

1. Enseñe `schema.sql` y un `SELECT` en la base.
2. Abra `repuestos.routes.js` y siga GET hasta el modelo.
3. Abra `api.js` y muestre que la ruta es `/api/repuestos`.
4. En el navegador, cree, edite y borre un repuesto.
5. Recargue y muestre que el cambio sigue.
6. Envíe un stock `1.5` y muestre el 400 del middleware.
