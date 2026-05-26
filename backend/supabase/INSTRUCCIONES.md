# Instrucciones para configurar Supabase

Estas instrucciones dejan alineados frontend, backend NestJS y Supabase.

## 1. Crear el proyecto

1. Entra a `https://supabase.com`.
2. Crea un proyecto nuevo.
3. Espera a que Supabase termine de aprovisionarlo.

## 2. Ejecutar el SQL

1. En Supabase abre `SQL Editor`.
2. Crea una consulta nueva.
3. Copia y ejecuta completo el contenido de:

```text
backend/supabase/schema.sql
```

Ese archivo crea:

- Tablas: `roles`, `users`, `books`, `loans`, `reservations`, `activities`.
- Funciones transaccionales: `create_loan`, `return_loan`, `create_reservation`, `confirm_reservation`, `dashboard_summary`.
- Datos semilla para roles, usuarios, libros, prestamos, reservas y actividad reciente.

## 3. Copiar credenciales

Ve a `Project Settings > API` y copia:

- `Project URL`
- `service_role key`

Usa la `service_role key` solo en el backend. No la pongas en el frontend.

El `Project URL` debe verse asi:

```text
https://xxxxxxxxxxxxxxxxxxxx.supabase.co
```

No uses una URL como estas:

```text
https://supabase.com/dashboard/...
https://app.supabase.com/...
```

## 4. Configurar backend

Crea `backend/.env` a partir de `backend/.env.example`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=4000
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
```

Instala y ejecuta:

```powershell
cd backend
npm.cmd install
npm.cmd run start:dev
```

Prueba:

```text
http://localhost:4000/api/health
```

## 5. Configurar frontend

En la raiz del proyecto crea `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Ejecuta el frontend desde la raiz:

```powershell
npm.cmd install
npm.cmd run dev
```

Abre:

```text
http://localhost:3000
```

Si el backend no esta encendido, el frontend entra en modo demo local. Si `NEXT_PUBLIC_API_URL` apunta al backend y `/api/health` responde, usa Supabase.

## Usuarios iniciales

El SQL crea estos usuarios para probar la distincion por rol:

```text
Administrador
correo: admin@cuc.edu.co
contrasena: admin123

Bibliotecario
correo: biblioteca@cuc.edu.co
contrasena: biblioteca123

Directivo
correo: directivo@cuc.edu.co
contrasena: directivo123

Estudiante
correo: estudiante@cuc.edu.co
contrasena: estudiante123
```

Para produccion cambia estas claves o elimina los usuarios de prueba.

Si ya habias ejecutado el SQL antes de estos usuarios, vuelve a ejecutar `backend/supabase/schema.sql`. Los `on conflict` actualizan las contrasenas semilla sin duplicar usuarios.

## Distincion por rol en la app

- `Administrador`: ve todos los modulos y puede administrar roles.
- `Bibliotecario`: gestiona catalogo operativo, prestamos, devoluciones, reservas, usuarios y reportes; no administra roles.
- `Directivo`: ve panel, catalogo y reportes; no ejecuta operaciones.
- `Estudiante`: ve panel, catalogo y reservas; puede crear reservas con su propio usuario.

## Validar todo

Desde la raiz:

```powershell
npm.cmd run build
```

Desde `backend/`:

```powershell
npm.cmd run build
npm.cmd run lint
```
