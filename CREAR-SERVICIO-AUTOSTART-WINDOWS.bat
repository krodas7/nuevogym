@echo off
chcp 65001 >nul
title Crear Servicio Autostart - NuevoGym

echo ========================================
echo    🪟 INICIO AUTOMATICO - NUEVOGYM
echo ========================================
echo.

REM Verificar permisos de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Este script requiere permisos de administrador
    echo.
    echo 📋 COMO EJECUTAR:
    echo    1. Click derecho en este archivo
    echo    2. "Ejecutar como administrador"
    echo.
    pause
    exit /b 1
)

echo ✅ Ejecutando como administrador
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"
set "PROJECT_DIR=%CD%"

echo [1/4] Directorio del proyecto: %PROJECT_DIR%
echo.

echo [2/4] Creando script de inicio silencioso...

REM Crear script VBS para inicio silencioso (sin ventana CMD)
(
echo Set WshShell = CreateObject^("WScript.Shell"^)
echo WshShell.CurrentDirectory = "%PROJECT_DIR%"
echo WshShell.Run "cmd /c npm start", 0, False
echo Set WshShell = Nothing
) > "%PROJECT_DIR%\iniciar-silencioso.vbs"

echo ✅ Script silencioso creado
echo.

echo [3/4] Configurando inicio automatico...
echo.
echo OPCIONES:
echo.
echo [1] Inicio de sesion - Se inicia cuando inicias sesion
echo [2] Servicio Windows - Se inicia con el sistema (requiere PM2)
echo [3] Tarea programada - Se inicia al iniciar Windows
echo.
set /p OPCION="Elige una opcion (1/2/3): "

if "%OPCION%"=="1" goto INICIO_SESION
if "%OPCION%"=="2" goto SERVICIO_PM2
if "%OPCION%"=="3" goto TAREA_PROGRAMADA

echo Opcion invalida
pause
exit /b 1

:INICIO_SESION
echo.
echo [4/4] Configurando inicio de sesion...

REM Copiar script VBS a la carpeta de inicio
copy /Y "%PROJECT_DIR%\iniciar-silencioso.vbs" "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\NuevoGym.vbs" >nul

if %errorlevel% equ 0 (
    echo ✅ Inicio automatico configurado
    echo.
    echo ========================================
    echo    ✅ CONFIGURACION COMPLETADA
    echo ========================================
    echo.
    echo 📋 DETALLES:
    echo    • Tipo: Inicio de sesion
    echo    • Se iniciara cuando inicies sesion en Windows
    echo    • Sin ventana visible
    echo.
    echo 🛠️  PARA DESACTIVAR:
    echo    Elimina el archivo:
    echo    %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\NuevoGym.vbs
    echo.
) else (
    echo ❌ Error al configurar inicio automatico
)
pause
exit /b 0

:SERVICIO_PM2
echo.
echo [4/4] Instalando PM2 y configurando servicio...
echo.
echo Instalando PM2 globalmente...
npm install -g pm2
npm install -g pm2-windows-startup

echo.
echo Configurando PM2...
pm2-startup install

echo.
echo Agregando NuevoGym a PM2...
cd /d "%PROJECT_DIR%"
pm2 start npm --name "nuevogym" -- start
pm2 save

echo.
echo ========================================
echo    ✅ SERVICIO CONFIGURADO
echo ========================================
echo.
echo 📋 COMANDOS UTILES:
echo    pm2 status          - Ver estado
echo    pm2 logs nuevogym   - Ver logs
echo    pm2 stop nuevogym   - Detener
echo    pm2 restart nuevogym - Reiniciar
echo    pm2 delete nuevogym - Eliminar servicio
echo.
pause
exit /b 0

:TAREA_PROGRAMADA
echo.
echo [4/4] Creando tarea programada...

REM Crear tarea programada que se ejecuta al iniciar el sistema
schtasks /create /tn "NuevoGym" /tr "%PROJECT_DIR%\iniciar-silencioso.vbs" /sc onlogon /rl highest /f

if %errorlevel% equ 0 (
    echo ✅ Tarea programada creada
    echo.
    echo ========================================
    echo    ✅ CONFIGURACION COMPLETADA
    echo ========================================
    echo.
    echo 📋 DETALLES:
    echo    • Tipo: Tarea programada
    echo    • Se ejecuta al iniciar sesion
    echo    • Con privilegios elevados
    echo.
    echo 🛠️  PARA GESTIONAR:
    echo    1. Abre "Programador de tareas"
    echo    2. Busca "NuevoGym"
    echo    3. Click derecho para opciones
    echo.
    echo 🛠️  PARA DESACTIVAR:
    echo    schtasks /delete /tn "NuevoGym" /f
    echo.
) else (
    echo ❌ Error al crear tarea programada
)
pause
exit /b 0
