# Backend SGB CUC

Backend en NestJS conectado a Supabase/PostgreSQL.

## Ejecutar

```powershell
cd backend
npm.cmd install
Copy-Item .env.example .env
npm.cmd run start:dev
```

Antes de iniciar, crea el proyecto en Supabase, ejecuta el SQL de `supabase/schema.sql` y completa `.env`.

API local:

```text
http://localhost:4000/api
```

## Endpoints principales

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
- `GET /api/roles`
- `POST /api/roles`
- `GET /api/loans`
- `POST /api/loans`
- `PATCH /api/loans/:id/return`
- `GET /api/reservations`
- `POST /api/reservations`
- `PATCH /api/reservations/:id/confirm`
