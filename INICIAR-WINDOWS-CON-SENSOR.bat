@echo off
chcp 65001 >nul
title NuevoGym con Sensor - Windows

echo ========================================
echo    🪟 NUEVOGYM CON SENSOR - WINDOWS
echo ========================================
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"

REM Verificar si api.exe existe
if not exist "api.exe" (
    echo ❌ No se encontró api.exe en este directorio
    echo 💡 Copia api.exe desde:
    echo    ZKTecoFingerPrintScanner-Implementation-master\api\bin\x86\Release\
    echo.
    echo 🔄 Buscando api.exe en el sistema...
    
    REM Buscar api.exe en el sistema
    for /r C:\ %%i in (api.exe) do (
        echo ✅ Encontrado en: %%i
        echo 📋 Copia este archivo a: %~dp0
        goto :notfound
    )
    
    :notfound
    echo ❌ No se encontró api.exe
    echo 💡 NuevoGym funcionará sin sensor de huellas
    echo.
    echo ⏳ Iniciando sin sensor en 5 segundos...
    timeout /t 5 /nobreak >nul
    goto :start_nuevogym
)

echo ✅ api.exe encontrado
echo.

REM Matar procesos anteriores
echo 🧹 Limpiando procesos anteriores...
taskkill /f /im api.exe >nul 2>&1
taskkill /f /im electron.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Iniciar sensor API
echo 📡 Iniciando sensor API...
echo 🔧 Ejecutando como administrador...
start /min "Sensor API" api.exe

REM Esperar a que el sensor se inicie
echo ⏳ Esperando que el sensor se inicie...
timeout /t 5 /nobreak >nul

REM Verificar si el sensor está corriendo
tasklist /fi "imagename eq api.exe" 2>nul | find /i "api.exe" >nul
if %errorlevel% equ 0 (
    echo ✅ Sensor API iniciado correctamente
    echo 🌐 Webhook: http://localhost:9000/webhook
) else (
    echo ⚠️  Sensor API no se inició correctamente
    echo 💡 NuevoGym funcionará sin sensor
)
echo.

REM Iniciar NuevoGym
:start_nuevogym
echo 🖥️  Iniciando NuevoGym...

REM Matar procesos de React/Electron anteriores
taskkill /f /im "node.exe" >nul 2>&1
timeout /t 2 /nobreak >nul

REM Iniciar aplicación
echo 📱 Iniciando servidor React...
start /min "React Server" cmd /c "npm run start:react"

REM Esperar a que React esté listo
echo ⏳ Esperando que React esté listo...
timeout /t 8 /nobreak >nul

REM Verificar que React esté corriendo
powershell -command "try { Invoke-WebRequest -Uri 'http://localhost:4000' -TimeoutSec 5 | Out-Null; Write-Host '✅ React iniciado correctamente' } catch { Write-Host '❌ Error al iniciar React' }"

REM Iniciar Electron
echo 🖥️  Iniciando Electron...
timeout /t 2 /nobreak >nul
npm run start:electron

echo.
echo ========================================
echo    ✅ NUEVOGYM INICIADO
echo ========================================
echo 🌐 Web: http://localhost:4000
echo 🖥️  Electron: Ventana de aplicación
echo 📡 Webhook: http://localhost:9000/webhook
echo.
echo 👤 Usuario: admin
echo 🔑 Contraseña: admin123
echo.
echo 💡 Para detener: Cierra las ventanas o Ctrl+C
echo.
pause
