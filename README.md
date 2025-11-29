# Rutas de la API
# Usuarios (/api/v1/users)

POST /register — Registrar usuario

POST /login — Iniciar sesión

GET /:id — Obtener usuario por documento

PATCH /:id — Modificar usuario (requiere token y permisos si es otro usuario)

DELETE /:id — Inhabilitar usuario (requiere token y permisos)

# Libros (/api/v1/books)

POST /create — Crear libro (requiere token y permiso create_book)

POST /reservar — Reservar libro (requiere token)

GET / — Listar libros con filtros y paginación

GET /:name — Obtener libro por nombre

PATCH /:name — Modificar libro (requiere token y permiso update_book)

DELETE /:name — Inhabilitar libro (requiere token y permiso disable_book)

# Variables de Entorno (.env)
```env
MONGO_URI=mongodb://localhost:27017/biblioteca
PORT=4000
JWT_SECRET=kjsahdlkjahsdlkjahd8736t3y6t7832t6


