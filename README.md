# DailySpace — Frontend (Next.js 16 + TypeScript + Tailwind CSS)

**Estudiante:** María Isabel Zuluaga Quintero  
**Curso:** Desarrollo Web · Semestre 2026-2 · Universidad de Medellín  
**Despliegue en Vercel:** [https://dailyspace-front.vercel.app](https://dailyspace-front.vercel.app) *(Pendiente despliegue de entrega)*  
**API Backend Desplegada:** [https://dailyspace-back.onrender.com](https://dailyspace-back.onrender.com) *(Pendiente despliegue de entrega)*  

---

## 📖 1. Descripción del Proyecto
DailySpace es una plataforma web full-stack para la gestión de bitácoras y diarios digitales interactivos. Esta versión (Entrega 3) es la evolución profesional del sitio estático de la Entrega 1 (`hoja-de-vida-web.`), conservando su identidad visual cálida (tonos amarillos pastel `#fff9db`, bordes ámbar `#ffe066` y fondos crema `#fcfbf7`), pero reconstruido con arquitectura moderna: **Next.js 16 (App Router)**, **TypeScript estricto** y **Tailwind CSS**.

### ✨ Características Principales
- **Feed Comunitario "Para ti":** Catálogo de vivencias y reflexiones con paginación reactiva sincronizada con query params (`?page=2`).
- **Filtros Combinados (Bono +2 pts):** Búsqueda de texto en tiempo real sobre títulos y contenidos combinada con filtrado por visibilidad (Público / Privado).
- **Subida de Archivos de Imagen (Bono +4 pts):** Selector y vista previa inmediata para adjuntar imágenes a las entradas del diario.
- **Autenticación y Sesión Persistente:** Formularios validados campo a campo sin uso de `alert()`, gestión centralizada de sesión con `useAuth` y auto-cierre con redirección en respuestas 401.
- **Protección de Rutas en Servidor con Proxy y Cookies (Bono +3 pts):** Implementación de `src/proxy.ts` que valida el token en cookies HTTP antes de renderizar páginas privadas en el servidor.
- **Interacciones:** Sistema de comentarios (`/mis-comentarios`) ligado al usuario en sesión.
- **Panel de Administración (/admin):** Control de acceso exclusivo para rol `admin`, tabla de gestión del catálogo (CRUD) y modal interactivo de confirmación antes de eliminar entradas (**Bono +1 pt**).
- **Página 404 Personalizada:** `src/app/not-found.tsx` adaptada a la estética del proyecto.

---

## 🛠️ 2. Arquitectura de Carpetas por Features
El proyecto sigue estrictamente la arquitectura modular por características (`features`) exigida en clase:

```text
src/
├── app/                           # Rutas Next.js (App Router)
│   ├── page.tsx                   # Feed principal y creación de entradas
│   ├── login/page.tsx             # Inicio de sesión (redirige si hay sesión)
│   ├── registro/page.tsx          # Registro de usuario (redirige si hay sesión)
│   ├── mis-comentarios/page.tsx   # Ruta protegida para usuarios autenticados
│   ├── admin/page.tsx             # Panel protegido exclusivo para rol 'admin'
│   ├── not-found.tsx              # Página 404 propia
│   └── globals.css                # Tokens de diseño DailySpace
├── proxy.ts                       # Protección de rutas en servidor (Bono +3 pts)
└── features/                      # Organización modular por features
    ├── common/                    # Infraestructura transversal
    │   ├── config.ts              # Lectura de NEXT_PUBLIC_API_HOST
    │   ├── http.ts                # Cliente HTTP centralizado (JWT y 401 redirect)
    │   └── components/            # Button, Input, Card, Badge, Modal, Navbar, Footer, Pagination
    ├── auth/                      # Autenticación y sesión
    │   ├── domain/                # Tipos: User, Role, LoginDto, RegisterDto, AuthResponse
    │   ├── services/              # authService y authStorage (localStorage + cookies)
    │   ├── hooks/                 # useAuth
    │   └── components/            # LoginForm, RegisterForm
    ├── posts/                     # Catálogo de vivencias (Posts)
    │   ├── domain/                # Post, CreatePostDto, UpdatePostDto, PostFilters
    │   ├── services/              # postsService (API REST + Mock fallback)
    │   ├── hooks/                 # usePosts
    │   └── components/            # PostCard, PostsGrid, PostFilterTabs, CreatePostSection
    ├── comments/                  # Interacción (Comentarios)
    │   ├── domain/                # Comment, CreateCommentDto
    │   ├── services/              # commentsService
    │   └── hooks/                 # useComments
    └── admin/                     # Módulo administrativo
        └── components/            # ConfirmDeleteModal (Bono +1 pt), EditPostModal
```

---

## 🚀 3. Cómo correr el proyecto en Local

### Prerrequisitos
- Node.js 18+ instalado
- npm o pnpm

### Pasos de Instalación
1. Clona el repositorio e ingresa al directorio:
   ```bash
   git clone https://github.com/Mariaisabel2/dailyspace-front.git
   cd dailyspace-front
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno creando un archivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_HOST=http://localhost:4000
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre en tu navegador [http://localhost:3000](http://localhost:3000).

---

## 🔑 4. Credenciales de Prueba del Seed

Para evaluar los roles del sistema, utiliza las siguientes credenciales generadas en el seed:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador (`admin`)** | `admin@dailyspace.com` | `Admin123!` | Acceso completo a `/admin`, CRUD del catálogo, eliminar entradas y ver métricas. |
| **Usuario Estándar (`user`)** | `user@dailyspace.com` | `User123!` | Publicar comentarios, ver `/mis-comentarios`, dar likes y explorar feed. |

*(En la pantalla de Login hay botones de llenado rápido para cargar estas credenciales en un solo clic).*

---

## 🧠 5. Decisiones Técnicas (En palabras propias)

### 1. Flujo completo de un login: desde el formulario hasta la respuesta de una ruta protegida
1. **Envío del Formulario:** El usuario escribe sus credenciales en `LoginForm`. Se validan sintácticamente en el cliente (formato de correo y contraseña $\ge 6$ caracteres) sin usar `alert()`.
2. **Petición HTTP:** `authService.login` envía un `POST` a `/api/auth/login` a través del cliente centralizado `httpClient`.
3. **Respuesta y Almacenamiento:** El backend verifica con `bcrypt` y retorna un JWT junto a los datos del usuario. El frontend ejecuta `authStorage.setSession`, guardando el token tanto en `localStorage` (para peticiones asíncronas) como en una cookie HTTP (para el middleware del servidor). Se dispara el evento reactivo `dailyspace_auth_change` para actualizar la Navbar inmediatamente.
4. **Redirección:** El hook redirige al usuario a `/` o a la ruta que intentaba visitar.
5. **Acceso a Ruta Protegida (`/mis-comentarios` o `/admin`):**
   - **En el Servidor (`src/proxy.ts`):** Antes de entregar el HTML, Next.js lee la cookie `token`. Si no existe o no tiene el rol adecuado, redirige de inmediato a `/login` o `/` sin exponer el contenido.
   - **En el Cliente (`httpClient.ts`):** Cada llamada a la API inyecta automáticamente el encabezado `Authorization: Bearer <token>`. Si el token expira y el servidor responde `401`, el cliente HTTP limpia la sesión y fuerza la redirección a `/login`.

### 2. ¿Dónde guardas el token en el frontend y qué riesgo tiene esa decisión?
- **Dónde se guarda:** Utilizamos una estrategia dual: en `localStorage` para fácil acceso del cliente HTTP, y en una cookie del navegador (`document.cookie` / cookie de sesión) para que `proxy.ts` de Next.js pueda evaluarlo en el servidor.
- **Riesgo asociado:** Guardar el token accesible en JavaScript (`localStorage` o cookies no `httpOnly`) expone la aplicación a ataques de tipo **XSS (Cross-Site Scripting)**. Si un atacante lograra inyectar un script malicioso en la página, podría leer el token y suplantar la identidad del usuario. La mitigación ideal en un entorno bancario es usar cookies `httpOnly` emitidas directamente por el backend para que JavaScript no pueda leerlas.

### 3. ¿En qué caso tu API responde 401 y en cuál 403? (Ejemplos reales de DailySpace)
- **Código 401 Unauthorized (Falta o falla de autenticación):**
  - *Caso 1:* Un visitante sin sesión intenta enviar un comentario (`POST /api/comments`) sin el header `Authorization`.
  - *Caso 2:* Un usuario envía un token firmado que ya expiró o cuyas credenciales en `/api/auth/login` no coinciden.
- **Código 403 Forbidden (Autenticado pero sin permisos suficientes):**
  - *Caso:* El usuario `carlos_dev` (rol `user`) inicia sesión correctamente y tiene un token válido, pero intenta eliminar una publicación del catálogo enviando `DELETE /api/posts/3` o acceder a `GET /api/comments` (todos los comentarios). Como su rol no es `admin`, el middleware `requireRole("admin")` rechaza la petición con **403 Forbidden**.

### 4. Si usaste IA, ¿para qué la usaste y qué tuviste que corregir?
- **Para qué se usó:** Como asistente de arquitectura para estructurar la separación limpia por features en Next.js, diseñar los contratos de TypeScript basados en la Entrega 1 y configurar las directivas de Tailwind CSS.
- **Qué se tuvo que corregir:** La IA sugirió inicialmente utilizar la convención deprecada `middleware.ts`, la cual en Next.js 16 arrojaba advertencias en consola; se migró a la nueva especificación oficial `proxy.ts` con export nombrado `proxy`. Asimismo, se ajustó la inyección de errores para garantizar que el error de email duplicado (409) se renderizara exactamente bajo el campo de texto en lugar de alertas globales.

---

## 📸 6. Captura de Network mostrando el Header Authorization
> *(Aquí se adjuntará la captura de pantalla de las herramientas de desarrollador del navegador mostrando la petición con `Authorization: Bearer <token>` una vez esté conectado el backend)*:

```http
GET /api/comments/mias HTTP/1.1
Host: localhost:4000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
