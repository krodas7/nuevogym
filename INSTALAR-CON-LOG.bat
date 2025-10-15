@echo off
setlocal enabledelayedexpansion
title NuevoGym - Instalacion con Log

REM Crear archivo de log
set LOGFILE=instalacion-log.txt
echo ======================================== > %LOGFILE%
echo NUEVOGYM - LOG DE INSTALACION >> %LOGFILE%
echo Fecha: %date% %time% >> %LOGFILE%
echo ======================================== >> %LOGFILE%
echo. >> %LOGFILE%

echo ========================================
echo    NUEVOGYM - INSTALACION CON LOG
echo ========================================
echo.
echo Todo se guardara en: %LOGFILE%
echo.

echo [1] Verificando Node.js... | tee -a %LOGFILE%
node --version >> %LOGFILE% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no instalado >> %LOGFILE%
    echo ERROR: Node.js no instalado
    echo Revisa el archivo: %LOGFILE%
    pause
    exit /b 1
)
echo OK - Node.js instalado | tee -a %LOGFILE%
echo.

echo [2] Verificando Git... | tee -a %LOGFILE%
git --version >> %LOGFILE% 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git no instalado >> %LOGFILE%
    echo ERROR: Git no instalado
    echo Revisa el archivo: %LOGFILE%
    pause
    exit /b 1
)
echo OK - Git instalado | tee -a %LOGFILE%
echo.

echo [3] Verificando Build Tools... | tee -a %LOGFILE%
where cl >> %LOGFILE% 2>&1
if %errorlevel% equ 0 (
    echo OK - Build Tools encontrado | tee -a %LOGFILE%
) else (
    echo ADVERTENCIA - Build Tools no encontrado en PATH >> %LOGFILE%
    echo ADVERTENCIA - Build Tools no encontrado en PATH
)
echo.

echo [4] Verificando directorio... | tee -a %LOGFILE%
echo Directorio actual: %CD% >> %LOGFILE%
if not exist package.json (
    echo ERROR: package.json no encontrado >> %LOGFILE%
    echo ERROR: package.json no encontrado
    echo Estas en: %CD%
    echo Revisa el archivo: %LOGFILE%
    pause
    exit /b 1
)
echo OK - package.json encontrado | tee -a %LOGFILE%
echo.

echo [5] Limpiando instalacion anterior... | tee -a %LOGFILE%
if exist node_modules (
    echo Eliminando node_modules... >> %LOGFILE%
    rmdir /s /q node_modules >> %LOGFILE% 2>&1
)
if exist package-lock.json (
    echo Eliminando package-lock.json... >> %LOGFILE%
    del package-lock.json >> %LOGFILE% 2>&1
)
echo OK - Limpieza completada | tee -a %LOGFILE%
echo.

echo [6] Instalando dependencias... | tee -a %LOGFILE%
echo ESTO PUEDE TOMAR 5-10 MINUTOS >> %LOGFILE%
echo Todo el output se guarda en: %LOGFILE% >> %LOGFILE%
echo.
echo ESTO PUEDE TOMAR 5-10 MINUTOS
echo NO CIERRES ESTA VENTANA
echo El progreso completo se guarda en: %LOGFILE%
echo.

npm install --legacy-peer-deps >> %LOGFILE% 2>&1
set ERROR_CODE=!errorlevel!

echo. >> %LOGFILE%
echo Codigo de salida de npm install: !ERROR_CODE! >> %LOGFILE%
echo. >> %LOGFILE%

if !ERROR_CODE! neq 0 (
    echo ======================================== >> %LOGFILE%
    echo ERROR EN INSTALACION >> %LOGFILE%
    echo ======================================== >> %LOGFILE%
    
    echo ========================================
    echo    ERROR EN INSTALACION
    echo ========================================
    echo.
    echo REVISA EL ARCHIVO: %LOGFILE%
    echo Ahi esta el error completo
    echo.
    echo Abre el archivo y busca la ultima linea con "npm ERR!"
    echo Copia TODO el contenido y envialo
    echo.
    pause
    exit /b 1
)

echo OK - Dependencias instaladas | tee -a %LOGFILE%
echo.

echo [7] Construyendo frontend... | tee -a %LOGFILE%
npm run build >> %LOGFILE% 2>&1
set BUILD_CODE=!errorlevel!

if !BUILD_CODE! neq 0 (
    echo ERROR: Fallo construccion del frontend >> %LOGFILE%
    echo ERROR: Fallo construccion
    echo REVISA: %LOGFILE%
    pause
    exit /b 1
)
echo OK - Frontend construido | tee -a %LOGFILE%
echo.

echo ======================================== >> %LOGFILE%
echo INSTALACION COMPLETADA EXITOSAMENTE >> %LOGFILE%
echo ======================================== >> %LOGFILE%

echo ========================================
echo    INSTALACION COMPLETADA
echo ========================================
echo.
echo Para iniciar: npm start
echo Usuario: admin
echo Password: admin123
echo.
echo Log guardado en: %LOGFILE%
echo.
pause
