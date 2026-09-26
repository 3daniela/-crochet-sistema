# Crochet API (Backend)

Spring Boot 3 + Spring Security + JPA + JWT + MySQL (Railway) + Docker.

## 1. Requisitos
- Java 17, Maven (o usar el wrapper si lo agregas), Docker.
- Una base de datos MySQL en Railway (https://railway.app).

## 2. Crear la base de datos en Railway
1. Railway → New Project → Database → Add MySQL.
2. En la pestaña **Variables** del servicio MySQL copia: `MYSQLHOST`, `MYSQLPORT`,
   `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`.

## 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con los datos reales de Railway y una clave JWT propia
```

## 4. Ejecutar con Docker (recomendado)
```bash
docker compose up --build
```
La API queda disponible en `http://localhost:8080`.

## 5. Ejecutar sin Docker (desarrollo local)
```bash
export MYSQLHOST=...
export MYSQLPORT=...
export MYSQLDATABASE=...
export MYSQLUSER=...
export MYSQLPASSWORD=...
export JWT_SECRET=clave-larga-y-segura
mvn spring-boot:run
```

## 6. Endpoints principales

| Método | Ruta                  | Acceso        | Descripción                  |
|--------|------------------------|----------------|-------------------------------|
| POST   | `/api/auth/register`    | Público        | Registro de clientes          |
| POST   | `/api/auth/login`       | Público        | Login, devuelve JWT           |
| GET    | `/api/productos`        | Público        | Catálogo                      |
| POST   | `/api/productos`        | ADMIN          | Crear producto                |
| PUT    | `/api/productos/{id}`   | ADMIN          | Editar producto                |
| DELETE | `/api/productos/{id}`   | ADMIN          | Eliminar (lógico)              |
| GET    | `/api/perfil`           | Autenticado    | Perfil propio                  |
| GET    | `/api/usuarios`         | ADMIN          | Listado de usuarios            |

## 7. Script de base de datos
En `db/schema.sql` está el script completo (esquema + datos semilla:
5 categorías, 7 productos y 3 usuarios de prueba) para ejecutar en MySQL
Workbench conectado a Railway. Si prefieres que Hibernate cree las tablas
solo (`ddl-auto: update`), igual puedes correr únicamente la sección 2
del script (los `INSERT`) después de levantar el backend una vez.

Usuarios de prueba ya incluidos en el script (contraseña real entre paréntesis):
- `admin@crocheconamor.com` (`Admin123!`) → rol ADMIN
- `camila@crocheconamor.com` (`Demo1234!`) → rol CLIENTE (usado por el botón "Acceso Demo" del frontend)
- `cliente@correo.com` (`Cliente123!`) → rol CLIENTE

## 8. Crear el primer usuario ADMIN (si no usas el script SQL)
Por diseño, `/api/auth/register` siempre crea usuarios con rol `CLIENTE`
(así nadie se auto-asigna ADMIN desde el frontend). Para tu primer
administrador:
1. Regístrate normalmente como cliente desde el frontend.
2. En MySQL Workbench (conectado a Railway), ejecuta:
   ```sql
   UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'tu-correo@ejemplo.com';
   ```
3. Vuelve a iniciar sesión para obtener un token con el nuevo rol.

## 8. Documento de sustentación técnica
Ver `SUSTENTACION.md` para la explicación detallada de BCrypt (factor de
costo), JWT (estructura, expiración), flujo de login, JPA y Docker —
pensado para responder preguntas de sustentación.
