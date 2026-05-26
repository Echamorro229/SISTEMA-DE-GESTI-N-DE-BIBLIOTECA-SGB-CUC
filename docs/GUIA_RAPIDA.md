# Guia Rapida para Companeros

Esta guia es para correr el proyecto sin leer toda la documentacion.

## 1. Clonar

```powershell
git clone URL_DEL_REPOSITORIO
cd "SISTEMA DE GESTION DE BIBLIOTECA"
```

## 2. Instalar

```powershell
npm.cmd install
cd backend
npm.cmd install
cd ..
```

## 3. Configurar Variables

Crear `.env.local` en la raiz:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Crear `backend/.env`:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
PORT=4000
FRONTEND_URL=http://localhost:3000,http://127.0.0.1:3000
```

Si no tienes Supabase configurado, sigue:

```text
backend/supabase/INSTRUCCIONES.md
```

## 4. Ejecutar

Terminal 1:

```powershell
cd backend
npm.cmd run start:dev
```

Terminal 2:

```powershell
npm.cmd run dev
```

Abrir:

```text
http://localhost:3000
```

## 5. Usuarios

Si ejecutaste `backend/supabase/reset-usuarios.sql`:

```text
admin@cuc.edu.co / Admin123
bibliotecario@cuc.edu.co / Biblio123
directivo@cuc.edu.co / Directivo123
estudiante@cuc.edu.co / Estudiante123
```

## 6. Validar

```powershell
npm.cmd run build
npm.cmd run lint
cd backend
npm.cmd run build
npm.cmd run lint
```

## 7. Agregar Libros

Inicia sesion como `Administrador` o `Bibliotecario`, entra a `Catalogo` y presiona `Agregar libro`.
