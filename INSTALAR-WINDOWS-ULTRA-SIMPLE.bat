@echo off
title NuevoGym - Instalacion Ultra Simple

echo ========================================
echo    NUEVOGYM - INSTALACION ULTRA SIMPLE
echo ========================================
echo.

echo Paso 1: Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js no instalado
    echo Ve a: https://nodejs.org/
    pause
    exit
)

echo Paso 2: Verificando Git...
git --version
if %errorlevel% neq 0 (
    echo ERROR: Git no instalado  
    echo Ve a: https://git-scm.com/
    pause
    exit
)

echo Paso 3: Instalando dependencias...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Fallo instalacion
    pause
    exit
)

echo Paso 4: Construyendo...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Fallo construccion
    pause
    exit
)

echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo Para iniciar: npm start
echo Usuario: admin
echo Password: admin123
echo.
pause
