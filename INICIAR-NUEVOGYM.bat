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

echo ✅ Node.js detectado: 
node --version
echo.

REM Verificar si node_modules existe
if not exist "node_modules" (
    echo ⚠️  Dependencias no instaladas. Instalando...
    echo 📦 Esto puede tomar 2-3 minutos...
    echo.
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        echo.
        echo 💡 Intenta ejecutar: OPTIMIZAR-WINDOWS.bat
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dependencias instaladas correctamente
    echo.
)

REM Verificar si better-sqlite3 está compilado
if not exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo 🔨 Recompilando better-sqlite3 para Windows...
    call npm run rebuild
    if %errorlevel% neq 0 (
        echo ⚠️  Advertencia: No se pudo recompilar better-sqlite3
        echo 💡 Intenta ejecutar: OPTIMIZAR-WINDOWS.bat
        echo.
    )
)

REM Verificar si dist existe
if not exist "dist\index.html" (
    echo 📦 Compilando frontend por primera vez...
    echo.
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Error al compilar frontend
        echo.
        echo 💡 Intenta ejecutar: OPTIMIZAR-WINDOWS.bat
        echo.
        pause
        exit /b 1
    )
    echo ✅ Frontend compilado
    echo.
)

echo ========================================
echo   ✅ TODO LISTO
echo ========================================
echo.
echo 📌 CREDENCIALES:
echo    Usuario: admin
echo    Contraseña: admin123
echo.
echo 🔴 Para detener: Presiona Ctrl+C
echo.
echo Iniciando en 3 segundos...
timeout /t 3 /nobreak > nul

REM Iniciar la aplicación
call npm start

pause
