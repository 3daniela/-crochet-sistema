# Croché con Amor — Frontend (conectado al backend)

Este es tu frontend original (Angular 22 + SSR), ahora conectado de verdad
al backend Spring Boot: catálogo, categorías, login y registro consultan
la API real en vez de usar datos de ejemplo escritos en el código.

## Qué se modificó respecto a tu proyecto original

| Archivo | Cambio |
|---|---|
| `src/environments/environment.ts` / `.prod.ts` | **Nuevo.** URL del backend (`apiUrl`). |
| `src/app/interceptors/jwt.interceptor.ts` | **Nuevo.** Agrega el JWT a cada petición. |
| `src/app/app.config.ts` | Se agregó `provideHttpClient(...)` con el interceptor. |
| `src/app/services/product.service.ts` | Ahora hace `GET /api/productos` y `GET /api/categorias` al backend en vez de usar `PRODUCTS_DATA`/`CATEGORIES_DATA` estáticos. **La API pública del servicio no cambió**, así que `home.component.ts`, `products.component.ts` y `auth.component.ts` siguen funcionando sin tocarlos. |
| `src/app/services/auth.service.ts` | `login()`/`register()` ahora llaman a `POST /api/auth/login` y `/register` reales y guardan el JWT devuelto. `demoLogin()` inicia sesión con el usuario demo sembrado en la base de datos. |
| `src/app/pages/auth/auth.component.ts` | Se agregó un mensaje de error y estado "cargando" en los formularios (mínimo cambio visual). |

Ningún otro componente fue modificado.

## Instalación

```bash
npm install
```

## Configurar la URL del backend

Edita `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'   // <- cambia si tu backend corre en otro puerto/host
};
```

## Ejecutar

```bash
npm start
```
Abre http://localhost:4200

## Notas importantes

1. **CORS**: el backend (`SecurityConfig`) ya permite peticiones desde cualquier origen (`*`) durante desarrollo. En producción, cambia esa configuración para restringirla a tu dominio real.
2. **Usuario admin**: este frontend **no incluye un panel de administración** (no había ninguna vista de ese tipo en tu proyecto original). El backend sigue teniendo los endpoints de administración (`POST/PUT/DELETE /api/productos`) protegidos con rol `ADMIN`; por ahora se gestionan con Postman, Insomnia, o directamente con SQL (ver `db/schema.sql`). Si más adelante quieres una vista de administración, se puede agregar como una página nueva dentro de este mismo proyecto.
3. **Usuario demo**: el botón "⚡ Acceso Demo Rápido" ahora inicia sesión real contra el backend con el usuario `camila@crocheconamor.com` / `Demo1234!` (creado por el script SQL).
4. **SSR**: el interceptor JWT verifica `isPlatformBrowser` porque `localStorage` no existe durante el renderizado en el servidor.
