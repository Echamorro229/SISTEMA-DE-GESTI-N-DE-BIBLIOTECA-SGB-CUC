# Arquitectura

## Vista General

SGB CUC esta dividido en tres capas:

```text
Frontend Next.js -> Backend NestJS -> Supabase/PostgreSQL
```

## Frontend

Ubicacion:

```text
app/
components/
hooks/
lib/
```

Responsabilidades:

- Renderizar la interfaz.
- Aplicar permisos visuales por rol.
- Consumir la API REST.
- Mostrar notificaciones y formularios.

Archivos importantes:

- `components/library-app.tsx`: orquestador principal.
- `hooks/use-library-data.ts`: estado y acciones de negocio del frontend.
- `lib/library/api.ts`: cliente HTTP.
- `lib/library/permissions.ts`: permisos por rol.

## Backend

Ubicacion:

```text
backend/src/
```

Modulos:

- `auth`: login y recuperacion.
- `users`: usuarios y cambio de contrasena.
- `roles`: roles.
- `books`: catalogo.
- `loans`: prestamos y devoluciones.
- `reservations`: reservas.
- `dashboard`: health check y resumen.
- `supabase`: cliente de base de datos.

## Base de Datos

Ubicacion de scripts:

```text
backend/supabase/
```

Tablas:

- `roles`
- `users`
- `books`
- `loans`
- `reservations`
- `activities`

Funciones SQL:

- `create_loan`
- `return_loan`
- `create_reservation`
- `confirm_reservation`
- `dashboard_summary`

## Permisos por Rol

- Administrador: todo.
- Bibliotecario: operaciones de biblioteca y reportes.
- Directivo: consulta y reportes.
- Estudiante: catalogo y reservas propias.

Nota: actualmente los permisos se aplican principalmente en la interfaz. Para produccion real, el siguiente paso recomendado es agregar JWT y guards en NestJS.
