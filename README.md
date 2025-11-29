📚 Biblioteca API – Backend (Node + Express + MongoDB)

Este proyecto es una API REST para la gestión de usuarios y libros de una biblioteca.
Incluye autenticación con JWT, filtros avanzados para libros y sistema de reservas.

🚀 Tecnologías utilizadas

Node.js

Express

TypeScript

MongoDB + Mongoose

JWT (Json Web Token)

Jest + Supertest (Pruebas)

📦 Instalación

Clona el repositorio:

git clone https://github.com/usuario/proyecto.git
cd proyecto


Instala dependencias:

npm install

⚙️ Configuración del entorno

Debes crear un archivo .env en la raíz del proyecto con el siguiente contenido:

MONGO_URI=mongodb://localhost:27017/biblioteca
PORT=4000
JWT_SECRET=kjsahdlkjahsdlkjahd8736t3y6t7832t6


Luego iniciar el servidor:

npm run dev

▶️ Scripts disponibles
Comando	Descripción
npm run dev	Ejecuta el servidor en modo desarrollo (ts-node-dev)
npm run build	Compila TypeScript a JavaScript
npm start	Ejecuta la versión compilada
npm test	Ejecuta todos los test con Jest
🔐 Autenticación

Las rutas protegidas requieren un token JWT en el header:

Authorization: Bearer <token>


Los tokens se obtienen desde:

POST /api/v1/users/login

🛣️ Rutas del Sistema

A continuación están TODAS las rutas reales de tu API.

👤 Rutas de Usuarios (/api/v1/users)
📌 Registrar usuario
POST /api/v1/users/register

Body:

{
  "tdocument": "C.C",
  "ndocument": "123",
  "fname": "Juan",
  "lname": "Perez",
  "username": "juanp",
  "password": "123456"
}

📌 Login
POST /api/v1/users/login

Body:

{
  "username": "juanp",
  "password": "123456"
}

📌 Obtener usuario por ID (documento)
GET /api/v1/users/:id

Opcional:

?includeInactive=true

📌 Actualizar usuario

🔒 Requiere autenticación

PATCH /api/v1/users/:id

Body de ejemplo:

{ "fname": "NuevoNombre" }

📌 Inhabilitar usuario

🔒 Requiere autenticación

DELETE /api/v1/users/:id
📚 Rutas de Libros (/api/v1/books)
📌 Crear libro

🔒 Requiere autenticación

POST /api/v1/books/create

Body:

{
  "name": "El Principito",
  "autor": "Saint-Exupéry",
  "editorial": "Sudamericana",
  "genero": "Fantasía",
  "publicacion": "1943-01-01"
}

📌 Obtener listado de libros
GET /api/v1/books
Parámetros opcionales:
Query	Ejemplo	Descripción
genero	Terror	Filtra por género
autor	García Márquez	Filtra por autor
editorial	Norma	Filtra por editorial
name	principe	Búsqueda por nombre (regex)
reserved	true/false	Libros reservados
includeInactive	true	Incluye los deshabilitados
page	1	Paginación
limit	10	Tamaño de página
📌 Obtener un libro por nombre
GET /api/v1/books/:name

Opcional:

?includeInactive=true

📌 Actualizar un libro

🔒 Requiere autenticación
🔒 Permiso: update_book

PATCH /api/v1/books/:name
📌 Eliminar (inhabilitar) un libro

🔒 Requiere autenticación
🔒 Permiso: disable_book

DELETE /api/v1/books/:name
📌 Reservar un libro

🔒 Requiere usuario autenticado

POST /api/v1/books/reservar

Body:

{
  "userId": "123",
  "bookId": "El Principito"
}

🧪 Ejecutar las pruebas

Las pruebas usan:

Jest

Supertest

MongoMemoryServer

Ejecuta:

npm test

🗂️ Estructura del Proyecto
src/
 ├── book/
 │   ├── book.controller.ts
 │   ├── book.routes.ts
 │   ├── book.model.ts
 │   ├── actions/...
 │   └── book.controller.test.ts   ← pruebas
 ├── user/
 │   ├── v1/
 │   │   ├── user.controller.ts
 │   │   ├── user.routes.ts
 │   │   ├── user.model.ts
 │   │   └── user.controller.test.ts
 ├── middlewares/
 ├── config/
 └── server.ts

📝 Notas finales

No debes subir node_modules. Usa tu .gitignore.

Es compatible con MongoDB local o Atlas (solo cambia MONGO_URI).

Todo está listo para producción o despliegue en Railway/Render.
