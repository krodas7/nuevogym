@echo off
chcp 65001 >nul
title Crear Acceso Directo - NuevoGym

echo ========================================
echo    🪟 CREAR ACCESO DIRECTO - NUEVOGYM
echo ========================================
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"

echo [1/3] Verificando directorio del proyecto...
set "PROJECT_DIR=%CD%"
echo Directorio: %PROJECT_DIR%
echo.

echo [2/3] Creando script de inicio rapido...

REM Crear INICIAR-RAPIDO.bat en el directorio del proyecto
(
echo @echo off
echo title NuevoGym - Iniciando...
echo cd /d "%PROJECT_DIR%"
echo npm start
) > "%PROJECT_DIR%\INICIAR-RAPIDO.bat"

echo ✅ Script de inicio creado: INICIAR-RAPIDO.bat
echo.

echo [3/3] Creando acceso directo en el Escritorio...

REM Usar PowerShell para crear el acceso directo
powershell -Command "$WshShell = New-Object -ComObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%USERPROFILE%\Desktop\NuevoGym.lnk'); $Shortcut.TargetPath = '%PROJECT_DIR%\INICIAR-RAPIDO.bat'; $Shortcut.WorkingDirectory = '%PROJECT_DIR%'; $Shortcut.Description = 'Sistema de Gestion de Gimnasio'; $Shortcut.Save()"

if %errorlevel% equ 0 (
    echo ✅ Acceso directo creado en el Escritorio
) else (
    echo ❌ Error al crear acceso directo
    pause
    exit /b 1
)
echo.

echo ========================================
echo    ✅ ACCESO DIRECTO CREADO
echo ========================================
echo.
echo 📍 Ubicacion: Escritorio\NuevoGym.lnk
echo.
echo 🎯 COMO USAR:
echo    1. Doble clic en el icono del escritorio
echo    2. El sistema se iniciara automaticamente
echo.
echo Para inicio automatico, ejecuta:
echo    CREAR-SERVICIO-AUTOSTART-WINDOWS.bat
echo.
pause
