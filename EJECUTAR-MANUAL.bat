@echo off
title NuevoGym - Ejecucion Manual

echo ========================================
echo    NUEVOGYM - EJECUCION MANUAL
echo ========================================
echo.
echo Este script abre una ventana CMD
echo donde puedes ejecutar comandos manualmente
echo.
echo COMANDOS SUGERIDOS:
echo.
echo 1. node --version
echo 2. npm --version
echo 3. git --version
echo 4. npm install --legacy-peer-deps
echo 5. npm run build
echo 6. npm start
echo.
echo Presiona cualquier tecla para abrir CMD...
pause >nul

cd /d "%~dp0"
cmd /k "echo Estas en: %CD% && echo. && echo Ejecuta: npm install --legacy-peer-deps"
