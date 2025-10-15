@echo off
chcp 65001 >nul
title Diagnóstico Windows - NuevoGym

echo ========================================
echo    🔍 DIAGNÓSTICO WINDOWS - NUEVOGYM
echo ========================================
echo.

echo 📋 Verificando requisitos del sistema...
echo.

REM Verificar Node.js
echo 🔍 Node.js:
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js instalado: 
    node --version
    npm --version
) else (
    echo ❌ Node.js NO instalado
)
echo.

REM Verificar Git
echo 🔍 Git:
git --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Git instalado: 
    git --version
) else (
    echo ❌ Git NO instalado
)
echo.

REM Verificar Visual Studio Build Tools
echo 🔍 Visual Studio Build Tools:
where cl >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Build Tools encontrado
) else (
    echo ❌ Build Tools NO encontrado
)
echo.

REM Verificar Python
echo 🔍 Python:
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python instalado: 
    python --version
) else (
    echo ❌ Python NO instalado
)
echo.

REM Verificar permisos de administrador
echo 🔍 Permisos de administrador:
net session >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Ejecutando como administrador
) else (
    echo ❌ NO ejecutando como administrador
)
echo.

REM Verificar directorio actual
echo 🔍 Directorio actual:
echo %CD%
echo.

REM Verificar archivos del proyecto
echo 🔍 Archivos del proyecto:
if exist package.json (
    echo ✅ package.json encontrado
) else (
    echo ❌ package.json NO encontrado
)

if exist src (
    echo ✅ Carpeta src encontrada
) else (
    echo ❌ Carpeta src NO encontrada
)

if exist electron (
    echo ✅ Carpeta electron encontrada
) else (
    echo ❌ Carpeta electron NO encontrada
)
echo.

REM Verificar conexión a internet
echo 🔍 Conexión a internet:
ping -n 1 google.com >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Conexión a internet OK
) else (
    echo ❌ Sin conexión a internet
)
echo.

REM Verificar antivirus (común)
echo 🔍 Antivirus detectado:
if exist "C:\Program Files\Windows Defender" (
    echo ✅ Windows Defender activo
)
if exist "C:\Program Files\Avast" (
    echo ✅ Avast detectado
)
if exist "C:\Program Files\AVG" (
    echo ✅ AVG detectado
)
if exist "C:\Program Files\Norton" (
    echo ✅ Norton detectado
)
echo.

echo ========================================
echo    📊 RESUMEN DEL DIAGNÓSTICO
echo ========================================
echo.

echo 💡 PRÓXIMOS PASOS:
echo.
echo 1. Si falta Node.js: https://nodejs.org/
echo 2. Si falta Git: https://git-scm.com/
echo 3. Si falta Build Tools: https://visualstudio.microsoft.com/downloads/
echo 4. Si no eres admin: Clic derecho → "Ejecutar como administrador"
echo 5. Si hay antivirus: Desactivar temporalmente
echo.

pause
