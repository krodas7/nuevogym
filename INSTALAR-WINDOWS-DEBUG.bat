@echo off
title NuevoGym - Instalacion con Debug

echo ========================================
echo    NUEVOGYM - INSTALACION DEBUG
echo ========================================
echo.

echo [1/10] Verificando Node.js...
node --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js no instalado
    echo Descarga de: https://nodejs.org/
    pause
    exit /b 1
)
echo OK - Node.js instalado
echo.

echo [2/10] Verificando npm...
npm --version 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm no instalado
    pause
    exit /b 1
)
echo OK - npm instalado
echo.

echo [3/10] Verificando directorio...
if not exist package.json (
    echo ERROR: package.json no encontrado
    echo Estas en el directorio correcto?
    echo Directorio actual: %CD%
    pause
    exit /b 1
)
echo OK - package.json encontrado
echo.

echo [4/10] Limpiando instalacion anterior...
if exist node_modules (
    echo Eliminando node_modules...
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo ADVERTENCIA: No se pudo eliminar node_modules completamente
        echo Continuar? (Ctrl+C para cancelar)
        pause
    )
)
if exist package-lock.json del package-lock.json 2>nul
echo OK - Limpieza completada
echo.

echo [5/10] Instalando dependencias...
echo ESTO PUEDE TOMAR 5-10 MINUTOS
echo NO CIERRES ESTA VENTANA
echo.
npm install --legacy-peer-deps 2>&1
set ERROR_CODE=%errorlevel%
echo.
echo Codigo de salida: %ERROR_CODE%
echo.

if %ERROR_CODE% neq 0 (
    echo ========================================
    echo    ERROR EN INSTALACION
    echo ========================================
    echo.
    echo POSIBLES CAUSAS:
    echo 1. Falta Visual Studio Build Tools
    echo 2. Antivirus bloqueando
    echo 3. Sin permisos de administrador
    echo 4. Sin conexion a internet
    echo.
    echo SOLUCIONES:
    echo.
    echo A. INSTALAR BUILD TOOLS:
    echo    https://visualstudio.microsoft.com/downloads/
    echo    Buscar: "Build Tools for Visual Studio 2022"
    echo    Seleccionar: "Desktop development with C++"
    echo.
    echo B. DESACTIVAR ANTIVIRUS temporalmente
    echo.
    echo C. EJECUTAR COMO ADMINISTRADOR
    echo    Click derecho en el script
    echo    "Ejecutar como administrador"
    echo.
    echo D. INTENTAR SIN COMPILAR:
    echo    npm install --ignore-scripts --legacy-peer-deps
    echo.
    pause
    exit /b 1
)

echo OK - Dependencias instaladas
echo.

echo [6/10] Verificando electron...
if exist node_modules\electron (
    echo OK - Electron instalado
) else (
    echo ADVERTENCIA: Electron no encontrado
)
echo.

echo [7/10] Verificando better-sqlite3...
if exist node_modules\better-sqlite3 (
    echo OK - better-sqlite3 instalado
) else (
    echo ADVERTENCIA: better-sqlite3 no encontrado
)
echo.

echo [8/10] Intentando rebuild...
echo Esto puede fallar, no es critico...
npm run rebuild 2>nul
if %errorlevel% equ 0 (
    echo OK - Rebuild exitoso
) else (
    echo ADVERTENCIA - Rebuild fallo (continuando...)
)
echo.

echo [9/10] Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo construccion del frontend
    pause
    exit /b 1
)
echo OK - Frontend construido
echo.

echo [10/10] Verificacion final...
if exist dist\index.html (
    echo OK - Archivos de produccion generados
) else (
    echo ERROR - Archivos de produccion no encontrados
    pause
    exit /b 1
)
echo.

echo ========================================
echo    INSTALACION COMPLETADA EXITOSAMENTE
echo ========================================
echo.
echo PARA INICIAR:
echo   npm start
echo.
echo O ejecutar:
echo   INICIAR-WINDOWS-SIMPLE.bat
echo.
echo CREDENCIALES:
echo   Usuario: admin
echo   Password: admin123
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
