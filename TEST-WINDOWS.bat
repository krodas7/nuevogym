@echo off
title Test Windows - NuevoGym

echo ========================================
echo    🪟 TEST WINDOWS - NUEVOGYM
echo ========================================
echo.

echo 📍 Directorio actual:
echo %CD%
echo.

echo 📍 Variables de entorno:
echo USERPROFILE=%USERPROFILE%
echo PATH=%PATH%
echo.

echo 📍 Archivos en directorio:
dir /b
echo.

echo 📍 Verificando Node.js:
where node
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado
    node --version
) else (
    echo ❌ Node.js NO encontrado
)
echo.

echo 📍 Verificando npm:
where npm
if %errorlevel% equ 0 (
    echo ✅ npm encontrado
    npm --version
) else (
    echo ❌ npm NO encontrado
)
echo.

echo 📍 Verificando Git:
where git
if %errorlevel% equ 0 (
    echo ✅ Git encontrado
    git --version
) else (
    echo ❌ Git NO encontrado
)
echo.

echo 📍 Verificando package.json:
if exist package.json (
    echo ✅ package.json existe
    echo Contenido:
    type package.json | findstr "name"
) else (
    echo ❌ package.json NO existe
)
echo.

echo 📍 Verificando permisos:
net session >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ejecutando como administrador
) else (
    echo ❌ NO ejecutando como administrador
)
echo.

echo ========================================
echo    📊 TEST COMPLETADO
echo ========================================
echo.

echo 💡 Si este script se cierra, hay un problema grave
echo 💡 Copia y pega TODO este output en el chat
echo.

echo Presiona cualquier tecla para cerrar...
pause >nul
