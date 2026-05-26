# Backend SGB CUC

API REST en NestJS conectada a Supabase/PostgreSQL.

## Requisitos

- Node.js LTS.
- npm.
- Proyecto Supabase configurado.

## Variables de Entorno

Crea `backend/.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=4000
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
```

## Ejecutar Local

```powershell
cd backend
npm.cmd install
npm.cmd run start:dev
```

API:

```text
http://localhost:4000/api
```

Health check:

```text
http://localhost:4000/api/health
```

## Endpoints

- `GET /`
- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/recover`
- `GET /api/dashboard`
- `GET /api/books`
- `POST /api/books`
- `PATCH /api/books/:id`
- `DELETE /api/books/:id`
- `GET /api/users`
- `POST /api/users`
- `PATCH /api/users/:id/password`
- `GET /api/roles`
- `POST /api/roles`
- `GET /api/loans`
- `POST /api/loans`
- `PATCH /api/loans/:id/return`
- `GET /api/reservations`
- `POST /api/reservations`
- `PATCH /api/reservations/:id/confirm`

## SQL

- `supabase/schema.sql`: crea tablas, funciones y datos semilla.
- `supabase/reset-usuarios.sql`: restablece usuarios principales sin borrar prestamos ni reservas.

## Deploy en Vercel

Este backend incluye:

```text
api/index.ts
vercel.json
```

En Vercel usa `backend` como root directory y configura las variables de entorno.
