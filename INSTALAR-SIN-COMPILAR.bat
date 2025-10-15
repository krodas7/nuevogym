@echo off
title NuevoGym - Instalacion SIN compilar

echo ========================================
echo    NUEVOGYM - INSTALACION SIN COMPILAR
echo ========================================
echo.
echo Esta version NO compila modulos nativos
echo Puede que algunas funciones no trabajen
echo.

echo [1/5] Verificando Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no instalado
    pause
    exit /b 1
)
echo OK
echo.

echo [2/5] Limpiando...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist package-lock.json del package-lock.json 2>nul
echo OK
echo.

echo [3/5] Instalando SIN compilar...
echo Esto puede tomar 3-5 minutos...
echo.
npm install --ignore-scripts --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Fallo instalacion
    echo.
    echo Posibles causas:
    echo - Sin conexion a internet
    echo - Antivirus bloqueando
    echo - Sin permisos
    echo.
    pause
    exit /b 1
)
echo OK
echo.

echo [4/5] Instalando Electron...
npm install electron --save-dev --ignore-scripts
echo OK
echo.

echo [5/5] Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo construccion
    pause
    exit /b 1
)
echo OK
echo.

echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo ADVERTENCIA:
echo - Base de datos puede no funcionar
echo - Puerto serial puede no funcionar
echo.
echo PARA INICIAR:
echo   npm start
echo.
echo Usuario: admin
echo Password: admin123
echo.
pause