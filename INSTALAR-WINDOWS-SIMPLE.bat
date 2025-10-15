@echo off
chcp 65001 >nul
title NuevoGym - Instalación Simple Windows

echo ========================================
echo    🪟 NUEVOGYM - INSTALACIÓN SIMPLE
echo ========================================
echo.

echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo.
    echo 📥 INSTALA NODE.JS PRIMERO:
    echo    1. Ve a: https://nodejs.org/
    echo    2. Descarga la versión LTS
    echo    3. Instala con configuración por defecto
    echo    4. Reinicia tu PC
    echo    5. Ejecuta este script nuevamente
    echo.
    echo 🌐 Abriendo Node.js...
    start https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js instalado: 
node --version
echo ✅ npm: 
npm --version
echo.

echo 🔍 Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no está instalado
    echo.
    echo 📥 INSTALA GIT PRIMERO:
    echo    1. Ve a: https://git-scm.com/
    echo    2. Descarga Git para Windows
    echo    3. Instala con configuración por defecto
    echo    4. Reinicia tu PC
    echo    5. Ejecuta este script nuevamente
    echo.
    echo 🌐 Abriendo Git...
    start https://git-scm.com/
    echo.
    pause
    exit /b 1
)

echo ✅ Git instalado
echo.

echo 📦 Instalando dependencias...
echo ⏱️  Esto puede tomar unos minutos...
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"

REM Limpiar instalación anterior
echo 🧹 Limpiando instalación anterior...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Instalar dependencias
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 SOLUCIONES:
    echo    1. Ejecutar como administrador
    echo    2. Desactivar antivirus temporalmente
    echo    3. Verificar conexión a internet
    echo.
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas
echo.

echo 🔧 Recompilando módulos...
npm run rebuild
if %errorlevel% neq 0 (
    echo ⚠️  Error al recompilar, continuando...
)

echo ✅ Módulos recompilados
echo.

echo 🏗️  Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error al construir frontend
    pause
    exit /b 1
)

echo ✅ Frontend construido
echo.

echo ========================================
echo    ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.

echo 🎯 PARA INICIAR NUEVOGYM:
echo.
echo 1️⃣  Comando directo:
echo     npm start
echo.
echo 2️⃣  O ejecutar:
echo     INICIAR-WINDOWS-SIMPLE.bat
echo.
echo 👤 Usuario: admin
echo 🔑 Contraseña: admin123
echo 🌐 Web: http://localhost:4000
echo.

echo Presiona cualquier tecla para cerrar...
pause >nul
