@echo off
chcp 65001 > nul
title NuevoGym - Compilar Instalador
color 0E

echo.
echo ========================================
echo   COMPILAR INSTALADOR DE NUEVOGYM
echo ========================================
echo.

REM Verificar Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js no está instalado
    pause
    exit /b 1
)

echo [1/6] Limpiando builds anteriores...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo ✅ Limpieza completada
echo.

echo [2/6] Verificando dependencias...
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Error al instalar dependencias
        pause
        exit /b 1
    )
)
echo ✅ Dependencias verificadas
echo.

echo [3/6] Recompilando módulos nativos...
call npm run rebuild
if %errorlevel% neq 0 (
    echo ❌ Error al recompilar módulos nativos
    pause
    exit /b 1
)
echo ✅ Módulos nativos recompilados
echo.

echo [4/6] Compilando frontend (React + Vite)...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Error al compilar frontend
    pause
    exit /b 1
)
echo ✅ Frontend compilado
echo.

echo [5/6] Verificando archivos compilados...
if not exist "dist\index.html" (
    echo ❌ ERROR: dist\index.html no existe
    pause
    exit /b 1
)
echo ✅ Archivos verificados
echo.

echo [6/6] Creando instalador de Windows...
echo.
echo 📦 Esto puede tomar varios minutos...
echo.
call npm run build:win
if %errorlevel% neq 0 (
    echo ❌ Error al crear instalador
    pause
    exit /b 1
)
echo.

echo ========================================
echo   ✅ INSTALADOR CREADO EXITOSAMENTE
echo ========================================
echo.
echo 📁 Los instaladores están en: dist-electron\
echo.

if exist "dist-electron" (
    echo 📋 Archivos generados:
    dir /b dist-electron\*.exe
    echo.
)

echo 🎉 ¡Todo listo para instalar!
echo.
echo 📌 Próximos pasos:
echo    1. Ve a la carpeta dist-electron\
echo    2. Ejecuta el archivo .exe para instalar
echo    3. Inicia NuevoGym desde el menú de inicio
echo.

pause

