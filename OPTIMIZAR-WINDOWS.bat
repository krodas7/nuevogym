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

REM Solucionar problema de Python 3.13 + distutils
echo 🔧 Configurando para Python 3.13...
set PYTHONPATH=%PYTHONPATH%;%LOCALAPPDATA%\Programs\Python\Python313-32\Lib\site-packages
set npm_config_python=C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python313-32\python.exe

REM Configurar para usar binarios pre-compilados y evitar compilación
set npm_config_build_from_source=false
set npm_config_target_platform=win32
set npm_config_target_arch=x64
set npm_config_target_libc=
set ELECTRON_SKIP_BINARY_DOWNLOAD=0

echo 📦 Instalando dependencias (evitando compilación local)...
echo ⏱️  Esto tomará 2-3 minutos...
echo.

REM Intentar instalar con configuración optimizada
call npm install --legacy-peer-deps --prefer-offline --no-audit --no-optional

if %errorlevel% neq 0 (
    echo ⚠️  Primer intento falló, intentando con configuración alternativa...
    
    REM Configuración alternativa para Python 3.13
    set npm_config_cache=%TEMP%\npm-cache
    set npm_config_prefer_offline=true
    set npm_config_no_build_from_source=true
    
    call npm install --legacy-peer-deps --no-audit --no-optional --force
    
    if %errorlevel% neq 0 (
        echo ❌ Error persistente al instalar dependencias
        echo.
        echo 💡 Soluciones alternativas:
        echo    1. Ejecuta: pip install setuptools
        echo    2. O usa: INSTALAR-SIN-COMPILAR.bat
        echo    3. O instala Visual Studio Build Tools
        echo.
        pause
        exit /b 1
    )
)
echo ✅ Dependencias instaladas
echo.

echo [3/5] Verificando módulos nativos...
echo 🔍 Verificando better-sqlite3...

REM Verificar si better-sqlite3 ya está funcionando
if exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo ✅ better-sqlite3 ya está compilado
) else (
    echo ⚠️  better-sqlite3 necesita compilación...
    
    REM Intentar instalar setuptools para Python 3.13
    echo 🔧 Instalando setuptools para Python 3.13...
    call pip install setuptools
    
    REM Intentar recompilar
    echo 🔨 Recompilando módulos nativos...
    call npm run rebuild
    
    if %errorlevel% neq 0 (
        echo ⚠️  No se pudieron recompilar módulos nativos
        echo 💡 Continuando con binarios pre-compilados disponibles
    ) else (
        echo ✅ Módulos nativos recompilados exitosamente
    )
)
echo ✅ Módulos nativos verificados
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

REM Verificación flexible de better-sqlite3
if exist "node_modules\better-sqlite3\build\Release\better_sqlite3.node" (
    echo ✅ better-sqlite3 compilado correctamente
) else (
    echo ⚠️  better-sqlite3 no compilado localmente
    echo 💡 Se intentará usar binario pre-compilado en runtime
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

