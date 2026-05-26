# Despliegue en GitHub y Vercel

La aplicacion se despliega como dos proyectos Vercel dentro del mismo repositorio:

- Frontend: proyecto Vercel con root directory en la raiz.
- Backend: proyecto Vercel con root directory en `backend/`.
- Base de datos: Supabase.

## 1. Antes de subir a GitHub

Verifica que no existan secretos en el commit:

```powershell
git status --short
```

No subas:

```text
.env
.env.local
backend/.env
```

Estos archivos ya estan ignorados por `.gitignore`.

Valida:

```powershell
npm.cmd run build
npm.cmd run lint
cd backend
npm.cmd run build
npm.cmd run lint
cd ..
```

## 2. Subir a GitHub

Desde la raiz del proyecto:

```powershell
git init
git add .
git commit -m "Configura SGB CUC con frontend, backend y Supabase"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

Si el repositorio ya existe localmente, usa solo:

```powershell
git add .
git commit -m "Prepara despliegue en Vercel"
git push
```

## 3. Deploy del backend en Vercel

1. En Vercel crea un nuevo proyecto desde el repositorio.
2. En `Root Directory` selecciona:

```text
backend
```

3. Framework preset:

```text
Other
```

4. Variables de entorno del backend:

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
FRONTEND_URL=http://localhost:3000
```

5. Deploy.
6. Prueba:

```text
https://tu-backend.vercel.app/api/health
```

Debe responder:

```json
{"ok":true,"service":"sgb-cuc-backend"}
```

## 4. Deploy del frontend en Vercel

1. Crea otro proyecto Vercel desde el mismo repositorio.
2. `Root Directory`:

```text
./
```

3. Framework preset:

```text
Next.js
```

4. Variable de entorno del frontend:

```env
NEXT_PUBLIC_API_URL=https://tu-backend.vercel.app/api
```

5. Deploy.

## 5. Actualizar CORS del backend

Cuando tengas la URL final del frontend, vuelve al proyecto backend en Vercel y cambia `FRONTEND_URL`:

```env
FRONTEND_URL=https://tu-frontend.vercel.app,http://localhost:3000,http://127.0.0.1:3000
```

Redeploy del backend.

El backend tambien acepta dominios terminados en `.vercel.app`, pero es buena practica dejar tu URL final en `FRONTEND_URL`.

## 6. Probar produccion

Entra al frontend desplegado y prueba:

```text
admin@cuc.edu.co / admin123
biblioteca@cuc.edu.co / biblioteca123
directivo@cuc.edu.co / directivo123
estudiante@cuc.edu.co / estudiante123
```

Revisa:

- El login rechaza usuarios inexistentes.
- Cada rol ve modulos distintos.
- Catalogo carga desde Supabase.
- Prestamos, devoluciones y reservas actualizan datos.
- Reportes reflejan los datos reales.

## 7. Cambiar contrasenas

`password_hash` no es la contrasena. Es un hash bcrypt.

La forma mas facil es desde la app:

1. Inicia sesion como `Administrador` o `Bibliotecario`.
2. Ve a `Panel`.
3. Abre `Usuarios`.
4. En `Cambiar contrasena`, selecciona el usuario.
5. Escribe la nueva contrasena.
6. Presiona `Actualizar contrasena`.

Tambien puedes usar el endpoint del backend:

```powershell
Invoke-RestMethod `
  -Uri "https://tu-backend.vercel.app/api/users/ID_DEL_USUARIO/password" `
  -Method Patch `
  -ContentType "application/json" `
  -Body '{"password":"nueva123"}'
```

Tambien puedes crear usuarios desde la app con una `Contrasena inicial`.

## 8. Notas importantes

- `SUPABASE_SERVICE_ROLE_KEY` va solo en el backend.
- `NEXT_PUBLIC_API_URL` si queda visible en el navegador; no pongas secretos ahi.
- Si cambias variables en Vercel, debes hacer redeploy.
- Si reejecutas `backend/supabase/schema.sql`, no duplica usuarios principales gracias a `on conflict`.
