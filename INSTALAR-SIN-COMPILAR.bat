@echo off
chcp 65001 > nul
title NuevoGym - Instalación Sin Compilar
color 0B

echo.
echo ========================================
echo   INSTALACION RAPIDA (SIN COMPILAR)
echo ========================================
echo.
echo Esta instalación usa binarios pre-compilados
echo No requiere Visual Studio ni herramientas de C++
echo.

cd C:\Users\itgym\OneDrive\Escritorio\nuevogym

echo [1/4] Limpiando instalación anterior...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist dist rmdir /s /q dist 2>nul
if exist package-lock.json del /q package-lock.json 2>nul
echo ✅ Limpieza completada
echo.

echo [2/4] Instalando dependencias (usando binarios pre-compilados)...
echo ⏱️  Esto tomará 2-3 minutos...
echo.

REM Configurar para NO compilar desde código fuente
set npm_config_build_from_source=false
set ELECTRON_SKIP_BINARY_DOWNLOAD=0

REM Instalar sin scripts de compilación
call npm install --legacy-peer-deps --prefer-offline --no-audit

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 Intenta ejecutar como Administrador
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Dependencias instaladas correctamente
echo.

echo [3/4] Compilando frontend (React + Vite)...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Error al compilar frontend
    pause
    exit /b 1
)

echo ✅ Frontend compilado
echo.

echo [4/4] Verificando instalación...
if not exist "dist\index.html" (
    echo ❌ ERROR: Frontend no compilado correctamente
    pause
    exit /b 1
)

echo ✅ Verificación completada
echo.

echo ========================================
echo   ✅ INSTALACION EXITOSA
echo ========================================
echo.
echo 🎉 NuevoGym está listo para usar!
echo.
echo 📌 Para iniciar:
echo    Doble clic en: INICIAR-NUEVOGYM.bat
echo.
echo 📌 Credenciales:
echo    Usuario: admin
echo    Contraseña: admin123
echo.

pause

