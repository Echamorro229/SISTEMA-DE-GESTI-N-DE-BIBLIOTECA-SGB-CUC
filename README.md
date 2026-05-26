# SGB CUC

Sistema de Gestion de Biblioteca para la Universidad de la Costa. Incluye frontend en Next.js, backend en NestJS y base de datos en Supabase/PostgreSQL.

## Tecnologias

- Frontend: Next.js, React, TypeScript.
- Backend: NestJS, TypeScript.
- Base de datos: Supabase/PostgreSQL.
- Pruebas E2E: Playwright.
- Deploy: Vercel.

## Funcionalidades

- Inicio de sesion con usuarios y roles.
- Catalogo de libros con busqueda y disponibilidad.
- Registro de nuevos libros en el catalogo.
- Prestamos y devoluciones.
- Reservas y confirmacion de reservas.
- Gestion de usuarios, roles y contrasenas.
- Reportes operativos.
- Interfaz responsive.

## Roles

- `Administrador`: acceso completo, incluyendo roles.
- `Bibliotecario`: prestamos, devoluciones, reservas, usuarios y reportes.
- `Directivo`: panel, catalogo y reportes.
- `Estudiante`: panel, catalogo y reservas propias.

## Estructura

```text
app/                 Pantallas Next.js
components/          Componentes React
hooks/               Hooks de frontend
lib/                 Tipos, API y utilidades del frontend
tests/               Pruebas Playwright
backend/             API NestJS
backend/src/         Modulos del backend
backend/supabase/    SQL de base de datos
docs/                Documentacion
```

## Requisitos

- Node.js LTS.
- npm.
- Cuenta/proyecto en Supabase.

En Windows, si PowerShell bloquea `npm`, usa `npm.cmd`.

## Configuracion Local

1. Instala dependencias del frontend:

```powershell
npm.cmd install
```

2. Instala dependencias del backend:

```powershell
cd backend
npm.cmd install
cd ..
```

3. Configura Supabase siguiendo:

```text
backend/supabase/INSTRUCCIONES.md
```

4. Crea `.env.local` en la raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

5. Crea `backend/.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=4000
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
```

## Ejecutar

Backend:

```powershell
cd backend
npm.cmd run start:dev
```

Frontend, en otra terminal:

```powershell
npm.cmd run dev
```

Abrir:

```text
http://localhost:3000
```

Probar backend:

```text
http://localhost:4000/api/health
```

## Usuarios de Prueba

Si ejecutaste `backend/supabase/reset-usuarios.sql`, puedes entrar con:

```text
admin@cuc.edu.co / Admin123
bibliotecario@cuc.edu.co / Biblio123
directivo@cuc.edu.co / Directivo123
estudiante@cuc.edu.co / Estudiante123
```

## Comandos

Frontend:

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
npm.cmd run test:e2e
```

Backend:

```powershell
cd backend
npm.cmd run start:dev
npm.cmd run build
npm.cmd run lint
```

## Deploy

La guia para GitHub y Vercel esta en:

```text
docs/DESPLIEGUE_GITHUB_VERCEL.md
```

## Seguridad

- No subir `.env`, `.env.local` ni `backend/.env`.
- `SUPABASE_SERVICE_ROLE_KEY` solo debe estar en el backend.
- Si una llave fue compartida por error, rotarla en Supabase y actualizar Vercel.
