# Guia de instalacion y ejecucion

## 1. Diagnostico del error

Si PowerShell muestra:

```powershell
npm : El termino 'npm' no se reconoce como nombre de un cmdlet...
```

significa que Node.js no esta instalado o que PowerShell aun no actualizo la variable `PATH`.

## 2. Instalar Node.js LTS

Ejecuta:

```powershell
winget install OpenJS.NodeJS.LTS --accept-package-agreements --accept-source-agreements
```

Cuando termine, cierra PowerShell y abre una ventana nueva.

## 3. Verificar herramientas

```powershell
node --version
npm.cmd --version
```

En este proyecto se verifico Node.js `v24.15.0`.

## 4. Instalar dependencias

Ubicate en la carpeta:

```powershell
cd "C:\Users\Edinson\OneDrive - Universidad de la Costa - CUC\Universidad\7mo semestre\ingenieria de software\SISTEMA DE GESTIÓN DE BIBLIOTECA (SGB) – CUC"
```

Instala:

```powershell
npm.cmd install
```

## 5. Ejecutar el frontend

```powershell
npm.cmd run dev
```

Abre `http://localhost:3000`.

## 6. Validar antes de entregar

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run test:e2e
npm.cmd audit
```

## 7. Nota sobre `npm` y PowerShell

Si `npm --version` falla con un mensaje sobre `npm.ps1` y politicas de ejecucion, usa `npm.cmd`.

Ejemplos:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

## 8. Verificar comportamientos de botones

El comando de pruebas E2E abre la aplicacion en Chromium y valida los flujos principales:

```powershell
npm.cmd run test:e2e
```

Antes de ejecutarlo, deja el servidor activo:

```powershell
npm.cmd run dev
```
