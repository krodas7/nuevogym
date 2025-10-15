@echo off
chcp 65001 >nul
title Desinstalar Autostart - NuevoGym

echo ========================================
echo    🪟 DESINSTALAR INICIO AUTOMATICO
echo ========================================
echo.

echo [1/3] Eliminando de carpeta de Inicio...
if exist "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\NuevoGym.vbs" (
    del "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\NuevoGym.vbs"
    echo ✅ Eliminado de carpeta de Inicio
) else (
    echo ℹ️  No encontrado en carpeta de Inicio
)
echo.

echo [2/3] Eliminando tarea programada...
schtasks /query /tn "NuevoGym" >nul 2>&1
if %errorlevel% equ 0 (
    schtasks /delete /tn "NuevoGym" /f >nul 2>&1
    echo ✅ Tarea programada eliminada
) else (
    echo ℹ️  No hay tarea programada
)
echo.

echo [3/3] Verificando servicio PM2...
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    pm2 delete nuevogym >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Servicio PM2 eliminado
    ) else (
        echo ℹ️  No hay servicio PM2
    )
) else (
    echo ℹ️  PM2 no instalado
)
echo.

echo ========================================
echo    ✅ LIMPIEZA COMPLETADA
echo ========================================
echo.
echo El inicio automatico ha sido desactivado
echo.
pause
