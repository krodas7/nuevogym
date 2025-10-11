@echo off
chcp 65001 > nul
title NuevoGym - Sistema de Gestión de Gimnasio
color 0A

echo.
echo ========================================
echo   NUEVOGYM - SISTEMA DE GESTION
echo ========================================
echo.
echo 🚀 Iniciando aplicación...
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo 📥 Por favor instala Node.js desde: https://nodejs.org
    echo.
    pause
    exit /b 1
)

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ⚠️  node_modules no encontrado
    echo 📦 Instalando dependencias...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
)

REM Verificar si better-sqlite3 está compilado
if not exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo 🔨 Recompilando better-sqlite3 para Windows...
    call npm run rebuild
    if %errorlevel% neq 0 (
        echo ❌ Error al recompilar better-sqlite3
        pause
        exit /b 1
    )
)

REM Verificar si dist existe
if not exist "dist" (
    echo 📦 Compilando frontend por primera vez...
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Error al compilar frontend
        pause
        exit /b 1
    )
)

echo ✅ Todo listo. Iniciando NuevoGym...
echo.
echo 📌 IMPORTANTE:
echo    - La aplicación se abrirá automáticamente
echo    - Usuario: admin
echo    - Contraseña: admin123
echo.
echo 🔴 Para detener: Presiona Ctrl+C en esta ventana
echo.

REM Iniciar la aplicación
call npm start

pause

