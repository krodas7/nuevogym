@echo off
echo ========================================
echo   COMPILANDO NUEVOGYM COMPLETO
echo ========================================
echo.

echo [1/5] Limpiando builds anteriores...
if exist dist rmdir /s /q dist
if exist dist-electron rmdir /s /q dist-electron
if exist node_modules\.vite rmdir /s /q node_modules\.vite
echo Limpieza completada.
echo.

echo [2/5] Compilando frontend de React...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al compilar frontend
    pause
    exit /b %errorlevel%
)
echo Frontend compilado exitosamente.
echo.

echo [3/5] Verificando archivos compilados...
if not exist "dist\index.html" (
    echo ERROR: dist\index.html no existe
    pause
    exit /b 1
)
echo Archivos verificados correctamente.
echo.

echo [4/5] Creando instalador de Windows...
call npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Fallo al crear instalador
    pause
    exit /b %errorlevel%
)
echo.

echo [5/5] Compilacion completada!
echo.
echo ========================================
echo   INSTALADORES CREADOS
echo ========================================
echo.
dir dist-electron\*.exe
echo.
echo ========================================
echo Presiona cualquier tecla para salir...
pause >nul

