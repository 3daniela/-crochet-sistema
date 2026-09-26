# Sustentación técnica — Sistema de Crochet (Backend + Frontend)

## 1. Arquitectura general

```
Angular (SPA, 5 vistas)  <-- HTTP/JSON + JWT -->  Spring Boot (API REST, dockerizado)  <-->  MySQL en Railway
```

- **Backend:** Spring Boot 3 + Spring Security + Spring Data JPA (Hibernate) + JWT (jjwt) + MySQL.
- **Frontend:** Angular 18 (standalone components), Reactive Forms, HttpClient con interceptor JWT.
- **Base de datos:** MySQL alojado en Railway (nube), visible desde MySQL Workbench mediante conexión remota.
- **Contenedor:** el backend corre dentro de un contenedor Docker (build multi-stage).

---

## 2. Hasheo de contraseñas: BCrypt

### ¿Por qué BCrypt y no MD5/SHA-256 a secas?
MD5 y SHA-256 son funciones de hash **rápidas**, diseñadas para integridad de datos, no para contraseñas: eso las hace vulnerables a ataques de fuerza bruta con GPU (miles de millones de intentos por segundo). BCrypt es una función de **derivación de claves** diseñada específicamente para contraseñas:

- Es **lenta a propósito** (parámetro de costo configurable).
- Genera automáticamente un **salt aleatorio** de 16 bytes por cada hash, por lo que dos usuarios con la misma contraseña obtienen hashes completamente distintos, y evita ataques de tablas precalculadas (rainbow tables).
- El salt se guarda **dentro del mismo hash resultante** (no en una columna aparte), en un string de 60 caracteres con este formato:

```
$2a$12$N9qo8uLOickgx2ZMRZoMye.IjZAgcfl7p92ldGxad68LJZdL17lhW
 \_/\_/\____________________/\_____________________________/
  |  |         salt                        hash
  |  costo (12 = 2^12 = 4096 iteraciones)
  algoritmo (2a = variante bcrypt)
```

### Factor de costo usado en el proyecto: **12**
Configurado en `SecurityConfig`:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
}
```
- El costo es un exponente de base 2: costo 12 = 2¹² = 4096 rondas internas de cifrado Blowfish.
- Cada +1 en el costo **duplica** el tiempo de cómputo.
- Costo 10 es el default de Spring Security; **12** es el estándar recomendado desde 2023-2024 en adelante para producción, porque el hardware actual (GPUs) es más rápido y hace falta más costo computacional para seguir siendo impráctico de romper por fuerza bruta.
- En este proyecto, generar un hash con costo 12 toma aproximadamente 250-400 ms, un tiempo imperceptible para un login humano pero costoso de escalar para un atacante que intente millones de combinaciones.

### Flujo de verificación
El backend **nunca desencripta** el hash (BCrypt no es reversible). En el login:
```java
passwordEncoder.matches(passwordEnTextoPlano, hashGuardadoEnBD)
```
Internamente, `matches()` extrae el salt del hash guardado, vuelve a aplicar el algoritmo sobre la contraseña recibida con ese mismo salt y costo, y compara los resultados byte a byte.

---

## 3. Sistema de login y JSON Web Tokens (JWT)

### Flujo completo de autenticación

1. El cliente (Angular) envía `POST /api/auth/login` con `{ email, password }`.
2. `AuthService.login()` delega en el `AuthenticationManager` de Spring Security, que usa `DaoAuthenticationProvider` para:
   - Buscar el usuario por email (`UsuarioDetailsService`).
   - Verificar la contraseña con `passwordEncoder.matches(...)`.
3. Si las credenciales son correctas, `JwtService.generateToken()` construye un JWT firmado.
4. El backend responde con `{ token, tipo: "Bearer", nombre, email, rol, expiraEnMs }`.
5. Angular guarda el token en `localStorage` y lo agrega automáticamente en cada request posterior vía el interceptor `jwtInterceptor`:
   ```
   Authorization: Bearer <token>
   ```
6. En cada petición protegida, `JwtAuthenticationFilter` (backend) intercepta el request, valida el token y coloca la identidad del usuario en el `SecurityContext` de Spring, para que las reglas `hasRole("ADMIN")` funcionen.

### Estructura del JWT emitido

Un JWT tiene 3 partes separadas por puntos: `HEADER.PAYLOAD.SIGNATURE`

- **Header:** algoritmo usado → `{"alg":"HS256"}`
- **Payload (claims):**
  ```json
  {
    "sub": "cliente@correo.com",
    "rol": "CLIENTE",
    "iat": 1732450000,
    "exp": 1732453600
  }
  ```
  - `sub` (subject): identifica al usuario (usamos el email).
  - `rol`: claim personalizado, usado para autorización por rol.
  - `iat` (issued at): momento de emisión.
  - `exp` (expiration): momento de expiración.
- **Signature:** firma HMAC-SHA256 calculada sobre header+payload usando una clave secreta simétrica (`jwt.secret`) que **solo el backend conoce**. Esto es lo que hace al token **infalsificable**: si alguien modifica el payload (por ejemplo, cambia `"rol":"CLIENTE"` a `"rol":"ADMIN"`), la firma ya no coincide y `Jwts.parser()` rechaza el token con una excepción.

### ¿Por qué JWT y no sesiones tradicionales?
- **Stateless:** el servidor no guarda sesiones en memoria/BD, lo que facilita escalar horizontalmente (varias instancias del backend detrás de un balanceador, sin sesiones pegajosas).
- El propio token lleva la información de identidad y rol, autocontenida y verificable con solo la clave secreta.

### Tiempos de expiración (`exp`)
Configurado en `application.yml`:
```yaml
jwt:
  expiration-ms: ${JWT_EXPIRATION_MS:3600000}   # 3,600,000 ms = 1 hora
```
- Se eligió **1 hora** como balance entre seguridad y experiencia de usuario:
  - Un token con vida muy larga (ej. 30 días) amplía la ventana de daño si es robado (XSS, dispositivo comprometido, etc.).
  - Un token con vida muy corta (ej. 1 minuto) obligaría a reautenticar constantemente.
- Al expirar, `jwtService.isTokenExpired()` detecta que `exp < ahora` y el filtro rechaza el token → el backend responde `401 Unauthorized` → el interceptor de Angular detecta el 401, limpia la sesión local y redirige a `/login`.
- El valor es 100% configurable por variable de entorno (`JWT_EXPIRATION_MS`) sin tocar código ni recompilar, útil para demostrar en sustentación cómo cambia el comportamiento (por ejemplo, bajarlo a `60000` = 1 minuto para ver la expiración en vivo).
- **Nota de diseño:** este proyecto usa un solo access token (sin refresh token). En un sistema de producción más grande normalmente se añadiría un *refresh token* de vida más larga, guardado de forma más segura (cookie httpOnly), para renovar el access token sin pedir credenciales de nuevo — quedó fuera del alcance para mantener el proyecto claro y sustentable.

---

## 4. Autorización por roles

`SecurityConfig` define reglas declarativas por ruta y método HTTP:

| Ruta                          | Método | Quién puede acceder          |
|-------------------------------|--------|-------------------------------|
| `/api/auth/**`                | *      | Público                       |
| `/api/productos`               | GET    | Público (catálogo)            |
| `/api/productos/**`            | POST/PUT/DELETE | Solo `ROLE_ADMIN`    |
| `/api/usuarios/**`             | GET    | Solo `ROLE_ADMIN`             |
| `/api/perfil`                  | GET    | Cualquier usuario autenticado |

Doble capa de defensa: la regla también se puede reforzar a nivel de método con `@PreAuthorize("hasRole('ADMIN')")` gracias a `@EnableMethodSecurity`.

---

## 5. Manejo de base de datos con JPA/Hibernate

- Entidades `Usuario` y `Producto` mapeadas con anotaciones JPA (`@Entity`, `@Table`, `@Id`, `@GeneratedValue`, `@Enumerated`, etc.).
- `spring.jpa.hibernate.ddl-auto: update` → Hibernate crea/actualiza automáticamente las tablas `usuarios` y `productos` a partir de las entidades Java, sin necesidad de escribir SQL manualmente.
- Repositorios (`UsuarioRepository`, `ProductoRepository`) extienden `JpaRepository`, obteniendo automáticamente CRUD + métodos derivados por nombre (`findByEmail`, `existsByEmail`, `findByActivoTrue`).
- El borrado de productos es **lógico** (`activo = false`) en vez de físico, práctica común para no perder históricos.

---

## 6. Base de datos en la nube (Railway) + MySQL Workbench

### Paso a paso para sustentar en vivo

1. En Railway, crear un servicio **MySQL** (New Project → Database → MySQL).
2. Railway genera automáticamente las variables: `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD` (visibles en la pestaña **Variables** del servicio).
3. **Conectar MySQL Workbench a Railway:**
   - Abrir Workbench → *"+"* junto a MySQL Connections.
   - Connection Name: `Crochet DB - Railway`.
   - Hostname: valor de `MYSQLHOST`.
   - Port: valor de `MYSQLPORT` (Railway no usa el 3306 por defecto, usa un puerto público distinto).
   - Username: valor de `MYSQLUSER` (normalmente `root`).
   - Password: valor de `MYSQLPASSWORD` (guardarlo en el "Store in Vault").
   - Test Connection → debe conectar correctamente.
4. Con la conexión abierta, se puede mostrar en vivo:
   - El esquema generado automáticamente por Hibernate (tablas `usuarios`, `productos`).
   - Una consulta `SELECT * FROM usuarios;` mostrando que las contraseñas están **hasheadas con BCrypt** (nunca en texto plano).
   - Una consulta `SELECT * FROM productos;`.
5. **Conectar el backend a esa misma base:** las variables `MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD` se pasan como variables de entorno al contenedor Docker (ver `.env` / `docker-compose.yml`), y `application.yml` las inyecta en la URL JDBC:
   ```
   jdbc:mysql://${MYSQLHOST}:${MYSQLPORT}/${MYSQLDATABASE}?useSSL=true...
   ```

---

## 7. Backend dockerizado

`Dockerfile` (multi-stage):
1. **Etapa build:** imagen `maven:3.9-eclipse-temurin-17`, compila el proyecto y genera `crochet-api.jar`.
2. **Etapa runtime:** imagen liviana `eclipse-temurin:17-jre-alpine`, copia solo el `.jar` compilado (no el código fuente ni Maven), corre como usuario no-root (`spring`), expone el puerto `8080`.

Comandos para sustentar en vivo:
```bash
# Construir la imagen
docker build -t crochet-api .

# Ejecutar el contenedor, inyectando las credenciales de Railway
docker run -p 8080:8080 \
  -e MYSQLHOST=... -e MYSQLPORT=... -e MYSQLDATABASE=... \
  -e MYSQLUSER=... -e MYSQLPASSWORD=... \
  -e JWT_SECRET=mi-clave-secreta-larga \
  crochet-api

# O con docker-compose (usa el archivo .env)
docker compose up --build
```
Ventajas a mencionar en la sustentación: portabilidad (corre igual en cualquier máquina con Docker), aislamiento de dependencias (no depende de tener Java/Maven instalados en el host), y facilidad de despliegue en cualquier proveedor cloud que acepte contenedores.

---

## 8. Las 5 vistas del frontend (Angular)

| # | Vista                | Ruta                | Acceso              | Función |
|---|-----------------------|----------------------|----------------------|---------|
| 1 | Login                 | `/login`             | Público              | Autenticación, obtiene y guarda el JWT |
| 2 | Registro               | `/registro`          | Público              | Alta de nuevos clientes (rol CLIENTE por defecto) |
| 3 | Catálogo               | `/catalogo`          | Público              | Lista de productos activos |
| 4 | Gestión de productos    | `/admin/productos`   | Solo ADMIN (`adminGuard`) | CRUD completo de productos |
| 5 | Perfil / Usuarios       | `/perfil`             | Autenticado (`authGuard`) | Datos propios; si es ADMIN, también lista todos los usuarios |

El `jwtInterceptor` adjunta el token a cada petición, y si el backend responde `401` (token vencido o inválido), cierra la sesión local y redirige a `/login` — esto es lo ideal para demostrar en vivo la expiración del JWT bajando `JWT_EXPIRATION_MS` a un valor pequeño.

---

## 9. Posibles preguntas frecuentes en la sustentación (con respuesta corta)

**¿Qué pasa si alguien roba el JWT?**
Puede usarlo hasta que expire (máx. 1 hora en este proyecto) o hasta que se invalide manualmente. Por eso el tiempo de expiración corto es una medida de mitigación, no de prevención total; para invalidación inmediata se necesitaría una blacklist de tokens o pasar a sesiones con estado.

**¿Por qué no guardar el JWT en una cookie en vez de localStorage?**
localStorage es más simple para una SPA separada del backend (distintos dominios/puertos) y evita configurar CSRF; su contrapartida es la exposición a XSS. Una alternativa más segura en producción sería una cookie `httpOnly` + `SameSite=strict`.

**¿Cómo se evita que un CLIENTE llame a los endpoints de ADMIN?**
Doble validación: en el frontend el `adminGuard` oculta/bloquea la navegación, pero la seguridad real está en el backend (`SecurityConfig` + JWT con claim `rol`), que es lo que no se puede burlar manipulando el navegador.

**¿Por qué BCrypt y no Argon2?**
Argon2 es más moderno y ganador del *Password Hashing Competition*, pero BCrypt sigue siendo ampliamente usado, está probado por más de 20 años, y Spring Security lo soporta de forma nativa y sencilla (`BCryptPasswordEncoder`), lo cual lo hace ideal para el alcance de este proyecto académico.

**¿Qué significa "costo 12" en términos prácticos?**
Que el algoritmo ejecuta 2¹²=4096 rondas internas antes de producir el hash final, haciendo cada intento de fuerza bruta computacionalmente costoso, sin afectar perceptiblemente la experiencia de un usuario real (~decenas/centenas de milisegundos por intento).

---

## 10. Integración con el frontend "Croché con Amor" (entregado por el cliente)

El frontend fue reemplazado por uno entregado por el cliente (Angular 22 +
SSR: Home, Catálogo, Nosotros, Encargos, Contacto y Cuenta). Para que
calzara sin fricción, el backend se ajustó así:

- **`Producto`** ahora tiene los mismos campos que la interfaz TypeScript
  `Product` del frontend (`category`, `categoryLabel`, `image`,
  `shortDescription`, `fullDescription`, `materials[]`, `dimensions`,
  `timeToMake`, `inStock`, `featured`, `colors[]`, `rating`,
  `reviewsCount`), y `ProductoResponse` expone esos nombres en inglés
  exactamente como el frontend los espera — cero mapeo manual en Angular.
- **`Usuario`** ganó `phone` y `city` para calzar con la interfaz `User`.
- Se agregó la entidad **`Categoria`** y el endpoint público
  `GET /api/categorias`, porque el frontend pinta una sección de
  categorías aparte del catálogo de productos.
- `AuthResponse` ahora anida el usuario (`{ token, tipo, expiraEnMs, usuario }`)
  para que el frontend guarde directamente el objeto `User` que espera su
  propio `AuthService`.
- Se configuró `spring.jackson.deserialization.fail-on-unknown-properties: false`
  porque el frontend envía campos que el backend no persiste (`acceptTerms`
  en el registro, `rememberMe` en el login).
- En el propio frontend, solo se tocaron `product.service.ts` y
  `auth.service.ts` (para llamar al backend real en vez de usar datos
  mock) y `app.config.ts` (para registrar `HttpClient` + interceptor JWT).
  Ningún componente (`home`, `products`, `auth`, `header`, etc.) se
  modificó, porque ambos servicios conservaron exactamente la misma API
  pública que tenían con los datos mock.

**Nota:** ese frontend no incluye ninguna vista de administración, así
que los endpoints `POST/PUT/DELETE /api/productos` (protegidos con rol
`ADMIN`) se siguen usando vía Postman/Insomnia o SQL directo, no desde
una interfaz visual. Ver `db/schema.sql` para los datos semilla, y
`CONEXION-BACKEND.md` (en el proyecto frontend) para el detalle completo.
