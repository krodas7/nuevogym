@echo off
echo ========================================
echo    CREAR INSTALADOR WINDOWS - NUEVOGYM
echo ========================================
echo.

echo [1/6] Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado
    echo Descargar desde: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/6] Verificando npm...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm no funciona correctamente
    pause
    exit /b 1
)

echo [3/6] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Fallo al instalar dependencias
    pause
    exit /b 1
)

echo [4/6] Recompilando modulos nativos...
call npm run rebuild
if %errorlevel% neq 0 (
    echo ERROR: Fallo al recompilar modulos
    pause
    exit /b 1
)

echo [5/6] Construyendo aplicacion...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo al construir aplicacion
    pause
    exit /b 1
)

echo [6/6] Creando instalador Windows...
call npm run build:win
if %errorlevel% neq 0 (
    echo ERROR: Fallo al crear instalador
    pause
    exit /b 1
)

echo.
echo ========================================
echo    INSTALADOR CREADO EXITOSAMENTE!
echo ========================================
echo.
echo Ubicacion: dist-electron\NuevoGym-Setup-1.0.0.exe
echo.
echo Presiona cualquier tecla para abrir la carpeta...
pause >nul

explorer dist-electron

echo.
echo Instalador listo para distribuir!
pause
