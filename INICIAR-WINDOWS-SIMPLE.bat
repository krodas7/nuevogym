@echo off
chcp 65001 >nul
title NuevoGym - Windows

echo ========================================
echo    🪟 NUEVOGYM - WINDOWS
echo ========================================
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"

REM Matar procesos anteriores
echo 🧹 Limpiando procesos anteriores...
taskkill /f /im electron.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Iniciar aplicación
echo 🚀 Iniciando NuevoGym...
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
echo.
echo 👤 Usuario: admin
echo 🔑 Contraseña: admin123
echo.
echo 💡 Para detener: Cierra las ventanas o Ctrl+C
echo.
pause
