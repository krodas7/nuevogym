@echo off
chcp 65001 >nul
title NuevoGym - Instalación para Windows

echo.
echo ========================================
echo    NUEVOGYM - INSTALACIÓN WINDOWS
echo ========================================
echo.
echo 🚀 Preparando instalación optimizada para Windows...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado
    echo.
    echo 📥 DESCARGANDO NODE.JS...
    echo.
    echo 1. Ve a: https://nodejs.org/
    echo 2. Descarga la versión LTS (recomendada)
    echo 3. Instala con las opciones por defecto
    echo 4. Reinicia esta ventana después de instalar
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version
echo.

REM Crear estructura de directorios
echo 📁 Creando estructura de directorios...
if not exist "dist" mkdir dist
if not exist "logs" mkdir logs
echo ✅ Directorios creados
echo.

REM Limpiar instalación anterior si existe
echo 🧹 Limpiando instalación anterior...
if exist "node_modules" (
    echo ⚠️  Eliminando node_modules anterior...
    rmdir /s /q node_modules 2>nul
)
if exist "package-lock.json" del package-lock.json 2>nul
echo ✅ Limpieza completada
echo.

REM Configurar npm para Windows
echo ⚙️  Configurando npm para Windows...
call npm config set registry https://registry.npmjs.org/
call npm config set cache "%APPDATA%\npm-cache"
call npm config set prefix "%APPDATA%\npm"
echo ✅ Configuración completada
echo.

REM Instalar dependencias optimizadas
echo 📦 Instalando dependencias optimizadas para Windows...
echo ⏱️  Esto puede tomar 2-3 minutos...
echo.

REM Usar package.json (ya está configurado)

call npm install --legacy-peer-deps --no-optional --no-audit

if %errorlevel% neq 0 (
    echo ❌ Error al instalar dependencias
    echo.
    echo 💡 Soluciones:
    echo    1. Ejecuta como administrador
    echo    2. Desactiva temporalmente el antivirus
    echo    3. Verifica tu conexión a internet
    echo.
    pause
    exit /b 1
)

echo ✅ Dependencias instaladas correctamente
echo.

REM Construir frontend
echo 🔨 Construyendo frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Error construyendo frontend
    echo.
    echo 💡 Soluciones:
    echo    1. Verifica que todas las dependencias estén instaladas
    echo    2. Revisa los errores de compilación arriba
    echo.
    pause
    exit /b 1
)

echo ✅ Frontend construido correctamente
echo.

REM Crear acceso directo
echo 🔗 Creando acceso directo...
echo @echo off > "INICIAR-NUEVOGYM.bat"
echo title NuevoGym >> "INICIAR-NUEVOGYM.bat"
echo echo. >> "INICIAR-NUEVOGYM.bat"
echo echo 🚀 Iniciando NuevoGym... >> "INICIAR-NUEVOGYM.bat"
echo echo 🌐 La aplicación se abrirá en: http://localhost:4000 >> "INICIAR-NUEVOGYM.bat"
echo echo. >> "INICIAR-NUEVOGYM.bat"
echo echo ⚠️  IMPORTANTE: No cierres esta ventana >> "INICIAR-NUEVOGYM.bat"
echo echo. >> "INICIAR-NUEVOGYM.bat"
echo start http://localhost:4000 >> "INICIAR-NUEVOGYM.bat"
echo node server.js >> "INICIAR-NUEVOGYM.bat"
echo pause >> "INICIAR-NUEVOGYM.bat"

echo ✅ Acceso directo creado: INICIAR-NUEVOGYM.bat
echo.

REM Crear archivo de configuración
echo ⚙️  Creando configuración...
echo { > config.json
echo   "version": "1.0.0", >> config.json
echo   "platform": "windows", >> config.json
echo   "database_path": "%APPDATA%\\NuevoGym\\database.db", >> config.json
echo   "port": 4000, >> config.json
echo   "installed": true, >> config.json
echo   "install_date": "%date%" >> config.json
echo } >> config.json

echo ✅ Configuración creada
echo.

REM Verificar instalación
echo 🔍 Verificando instalación...
if exist "node_modules" (
    echo ✅ node_modules - OK
) else (
    echo ❌ node_modules - FALTANTE
)

if exist "dist\index.html" (
    echo ✅ Frontend - OK
) else (
    echo ❌ Frontend - FALTANTE
)

if exist "server.js" (
    echo ✅ Servidor - OK
) else (
    echo ❌ Servidor - FALTANTE
)

echo.
echo ========================================
echo    ✅ INSTALACIÓN COMPLETADA
echo ========================================
echo.
echo 🎉 ¡NuevoGym está listo para usar!
echo.
echo 📋 INFORMACIÓN:
echo    • Usuario: admin
echo    • Contraseña: admin123
echo    • URL: http://localhost:4000
echo    • Base de datos: %APPDATA%\NuevoGym\database.db
echo.
echo 🚀 PARA INICIAR:
echo    1. Doble clic en: INICIAR-NUEVOGYM.bat
echo    2. O ejecuta: npm start
echo.
echo 📞 SOPORTE:
echo    • Revisa README.md para más información
echo    • Los logs se guardan en la carpeta 'logs'
echo.
echo ¿Quieres iniciar NuevoGym ahora? (S/N)
set /p iniciar=

if /i "%iniciar%"=="S" (
    echo.
    echo 🚀 Iniciando NuevoGym...
    start http://localhost:4000
    node server.js
) else (
    echo.
    echo 👋 Instalación completada. Ejecuta INICIAR-NUEVOGYM.bat cuando quieras usar la aplicación.
)

pause
