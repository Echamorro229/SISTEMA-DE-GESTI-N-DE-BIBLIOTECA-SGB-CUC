# SGB CUC Frontend

Frontend en Next.js para el Sistema de Gestion de Biblioteca de la Universidad de la Costa.

## Requisitos

- Windows 10/11.
- Node.js LTS instalado.
- npm incluido con Node.js.

## Instalacion de Node.js en Windows

La forma recomendada es usar `winget` desde PowerShell:

```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```

Despues de instalar, cierra y abre PowerShell para que Windows actualice el `PATH`.

Verifica la instalacion:

```powershell
node --version
npm.cmd --version
```

> En algunos equipos PowerShell bloquea `npm.ps1` por politica de ejecucion. En ese caso usa `npm.cmd`, por ejemplo `npm.cmd install`.

## Instalacion del proyecto

Desde la carpeta del proyecto:

```powershell
npm.cmd install
```

## Ejecutar en desarrollo

```powershell
npm.cmd run dev
```

Luego abre:

```text
http://localhost:3000
```

## Comandos utiles

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run test:e2e
npm.cmd audit
```

## Pruebas de botones

El proyecto incluye pruebas E2E con Playwright para validar los comportamientos principales de la interfaz:

- Inicio de sesion y cierre de sesion.
- Navegacion entre panel, catalogo, prestamos, reservas y reportes.
- Busqueda y filtro del catalogo.
- Botones de prestar, reservar, actualizar, notificaciones y acciones rapidas.
- Menu movil.

Ejecuta:

```powershell
npm.cmd run test:e2e
```

## Estado actual

- Frontend generado con Next.js, React y TypeScript.
- Pantalla de inicio de sesion.
- Panel principal con indicadores.
- Catalogo con busqueda.
- Modulos visuales de prestamos, reservas y reportes.
- Pruebas automatizadas para comportamientos de botones.
- Datos simulados, sin backend conectado todavia.
