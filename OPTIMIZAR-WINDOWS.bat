@echo off
chcp 65001 > nul
title NuevoGym - Optimización para Windows
color 0B

echo.
echo ========================================
echo   OPTIMIZAR NUEVOGYM PARA WINDOWS
echo ========================================
echo.
echo Este script preparará el proyecto para Windows
echo.

echo [1/5] Limpiando caché y archivos temporales...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
echo ✅ Limpieza completada
echo.

echo [2/5] Reinstalando dependencias limpias...
if exist node_modules (
    echo ⚠️  Eliminando node_modules...
    rmdir /s /q node_modules
)

REM Configurar para usar binarios pre-compilados
set npm_config_build_from_source=false
set ELECTRON_SKIP_BINARY_DOWNLOAD=0

echo 📦 Instalando con binarios pre-compilados...
echo ⏱️  Esto tomará 2-3 minutos...
echo.

call npm install --legacy-peer-deps --prefer-offline --no-audit

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 Alternativa: Ejecuta INSTALAR-SIN-COMPILAR.bat
    echo.
    pause
    exit /b 1
)
echo ✅ Dependencias instaladas
echo.

echo [3/5] Recompilando módulos nativos para Windows...
call npm run rebuild
if %errorlevel% neq 0 (
    echo ⚠️  Advertencia: No se pudieron recompilar módulos nativos
    echo 💡 Se usarán binarios pre-compilados
    echo.
    REM No detener, continuar con binarios pre-compilados
)
echo ✅ Módulos nativos listos
echo.

echo [4/5] Compilando frontend...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error al compilar frontend
    pause
    exit /b 1
)
echo ✅ Frontend compilado
echo.

echo [5/5] Verificando configuración...
if not exist "dist\index.html" (
    echo ❌ ERROR: Frontend no compilado correctamente
    pause
    exit /b 1
)

if not exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo ❌ ERROR: better-sqlite3 no compilado correctamente
    pause
    exit /b 1
)
echo ✅ Configuración verificada
echo.

echo ========================================
echo   ✅ OPTIMIZACIÓN COMPLETADA
echo ========================================
echo.
echo 🎉 NuevoGym está listo para Windows!
echo.
echo 📌 Opciones disponibles:
echo    1. INICIAR-NUEVOGYM.bat       - Ejecutar en modo desarrollo
echo    2. COMPILAR-INSTALADOR.bat    - Crear instalador .exe
echo.
echo 💡 Recomendación: Usa el instalador para producción
echo.

pause

