@echo off
chcp 65001 >nul
title NuevoGym - Instalación Simple

echo.
echo ========================================
echo    NUEVOGYM - INSTALACIÓN SIMPLE
echo ========================================
echo.

REM Verificar Node.js
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Descarga Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detectado
echo.

REM Limpiar instalación anterior
echo 🧹 Limpiando instalación anterior...
if exist "node_modules" rmdir /s /q node_modules 2>nul
if exist "package-lock.json" del package-lock.json 2>nul
if exist "dist" rmdir /s /q dist 2>nul
echo ✅ Limpieza completada
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
echo ⏱️  Esto puede tomar 2-3 minutos...
npm install --legacy-peer-deps

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.

REM Construir frontend
echo 🔨 Construyendo frontend...
npm run build

if %errorlevel% neq 0 (
    echo ❌ Error construyendo frontend
    pause
    exit /b 1
)

echo ✅ Frontend construido
echo.

REM Crear script de inicio
echo 🔗 Creando script de inicio...
echo @echo off > INICIAR.bat
echo title NuevoGym >> INICIAR.bat
echo echo 🚀 Iniciando NuevoGym... >> INICIAR.bat
echo echo 🌐 Abriendo http://localhost:4000 >> INICIAR.bat
echo start http://localhost:4000 >> INICIAR.bat
echo node server.js >> INICIAR.bat
echo pause >> INICIAR.bat

echo ✅ Script de inicio creado
echo.

echo ========================================
echo    ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo 🎉 ¡NuevoGym está listo!
echo.
echo 📋 INFORMACIÓN:
echo    • Usuario: admin
echo    • Contraseña: admin123
echo    • URL: http://localhost:4000
echo.
echo 🚀 PARA INICIAR:
echo    Doble clic en: INICIAR.bat
echo.

pause
