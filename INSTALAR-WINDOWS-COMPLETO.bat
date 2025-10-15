@echo off
chcp 65001 >nul
title NuevoGym - Instalación Completa Windows

echo ========================================
echo    🪟 NUEVOGYM - INSTALACIÓN COMPLETA WINDOWS
echo ========================================
echo.

REM Verificar si Node.js está instalado
echo 🔍 Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo 📥 Descargando Node.js...
    echo 🌐 Abriendo https://nodejs.org/
    start https://nodejs.org/
    echo ⏳ Por favor instala Node.js LTS y reinicia este script
    echo.
    echo 💡 Pasos para instalar Node.js:
    echo    1. Descargar desde https://nodejs.org/
    echo    2. Ejecutar el instalador
    echo    3. Marcar "Add to PATH"
    echo    4. Reiniciar PC
    echo    5. Ejecutar este script nuevamente
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js: 
node --version
echo ✅ npm: 
npm --version
echo.

REM Verificar si Git está instalado
echo 🔍 Verificando Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git no está instalado
    echo 📥 Descargando Git...
    echo 🌐 Abriendo https://git-scm.com/
    start https://git-scm.com/
    echo ⏳ Por favor instala Git y reinicia este script
    echo.
    echo 💡 Pasos para instalar Git:
    echo    1. Descargar desde https://git-scm.com/
    echo    2. Ejecutar el instalador
    echo    3. Usar configuración por defecto
    echo    4. Reiniciar PC
    echo    5. Ejecutar este script nuevamente
    echo.
    pause
    exit /b 1
)

echo ✅ Git instalado
echo.

REM Verificar Visual Studio Build Tools
echo 🔍 Verificando Visual Studio Build Tools...
where cl >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Visual Studio Build Tools no encontrado
    echo 📥 Descargando Visual Studio Build Tools...
    echo 🌐 Abriendo https://visualstudio.microsoft.com/downloads/
    start https://visualstudio.microsoft.com/downloads/
    echo.
    echo 💡 Pasos para instalar Build Tools:
    echo    1. Descargar "Build Tools for Visual Studio 2022"
    echo    2. Ejecutar el instalador
    echo    3. Marcar "Desktop development with C++"
    echo    4. Instalar
    echo    5. Reiniciar PC
    echo    6. Ejecutar este script nuevamente
    echo.
    pause
    exit /b 1
) else (
    echo ✅ Visual Studio Build Tools encontrado
)
echo.

REM Ir al directorio del proyecto
cd /d "%~dp0"

echo.
echo 📦 Instalando dependencias del proyecto...

REM Limpiar instalación anterior
echo 🧹 Limpiando instalación anterior...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Configurar npm para evitar compilación local
echo 🔧 Configurando npm...
set npm_config_build_from_source=false
set npm_config_cache_max=0

REM Instalar dependencias
echo 📦 Instalando dependencias...
echo ⏱️  Esto puede tomar 3-5 minutos...

npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    echo 🔄 Intentando con --force...
    npm install --legacy-peer-deps --force
    if %errorlevel% neq 0 (
        echo ❌ Error persistente al instalar dependencias
        echo 💡 Soluciones:
        echo    1. Ejecutar como administrador
        echo    2. Desactivar antivirus temporalmente
        echo    3. Usar: npm install --legacy-peer-deps --force --verbose
        pause
        exit /b 1
    )
)

echo ✅ Dependencias instaladas
echo.

REM Recompilar módulos nativos
echo 🔧 Recompilando módulos nativos para Electron...
npm run rebuild
if %errorlevel% neq 0 (
    echo ⚠️  Error al recompilar, continuando...
)

echo ✅ Módulos recompilados
echo.

REM Construir frontend
echo 🏗️  Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error al construir frontend
    pause
    exit /b 1
)

echo ✅ Frontend construido
echo.

REM Crear scripts de inicio
echo 📝 Creando scripts de inicio...

REM Script principal
echo @echo off > INICIAR-NUEVOGYM.bat
echo chcp 65001 ^>nul >> INICIAR-NUEVOGYM.bat
echo title NuevoGym >> INICIAR-NUEVOGYM.bat
echo echo 🚀 Iniciando NuevoGym... >> INICIAR-NUEVOGYM.bat
echo cd /d "%%~dp0" >> INICIAR-NUEVOGYM.bat
echo npm start >> INICIAR-NUEVOGYM.bat
echo pause >> INICIAR-NUEVOGYM.bat

REM Script con sensor
echo @echo off > INICIAR-CON-SENSOR.bat
echo chcp 65001 ^>nul >> INICIAR-CON-SENSOR.bat
echo title NuevoGym con Sensor >> INICIAR-CON-SENSOR.bat
echo echo 🚀 Iniciando NuevoGym con Sensor... >> INICIAR-CON-SENSOR.bat
echo echo 📡 Iniciando sensor API... >> INICIAR-CON-SENSOR.bat
echo start /min "Sensor API" "api.exe" >> INICIAR-CON-SENSOR.bat
echo timeout /t 3 /nobreak ^>nul >> INICIAR-CON-SENSOR.bat
echo echo 🖥️  Iniciando NuevoGym... >> INICIAR-CON-SENSOR.bat
echo cd /d "%%~dp0" >> INICIAR-CON-SENSOR.bat
echo npm start >> INICIAR-CON-SENSOR.bat
echo pause >> INICIAR-CON-SENSOR.bat

REM Script para compilar .exe
echo @echo off > COMPILAR-EXE.bat
echo chcp 65001 ^>nul >> COMPILAR-EXE.bat
echo title Compilar NuevoGym >> COMPILAR-EXE.bat
echo echo 🔨 Compilando NuevoGym... >> COMPILAR-EXE.bat
echo cd /d "%%~dp0" >> COMPILAR-EXE.bat
echo npm run build:win >> COMPILAR-EXE.bat
echo echo ✅ Compilación completada >> COMPILAR-EXE.bat
echo pause >> COMPILAR-EXE.bat

echo ✅ Scripts creados
echo.

echo ========================================
echo    ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo 🎯 FORMAS DE INICIAR NUEVOGYM:
echo.
echo 1️⃣  Inicio normal:
echo     INICIAR-NUEVOGYM.bat
echo.
echo 2️⃣  Con sensor de huellas:
echo     INICIAR-CON-SENSOR.bat
echo     (Asegúrate de tener api.exe en el directorio)
echo.
echo 3️⃣  Comando directo:
echo     npm start
echo.
echo 4️⃣  Compilar .exe:
echo     COMPILAR-EXE.bat
echo.
echo 👤 Usuario: admin
echo 🔑 Contraseña: admin123
echo.
echo 🌐 Web: http://localhost:4000
echo 📡 Webhook: http://localhost:9000/webhook
echo.
echo 💡 Para el sensor: Coloca api.exe en este directorio
echo 💡 Ejecuta INICIAR-CON-SENSOR.bat para usar el sensor
echo.
pause
