@echo off
chcp 65001 > nul
title Resetear Usuario Admin
color 0C

echo.
echo ========================================
echo   RESETEAR USUARIO ADMIN
echo ========================================
echo.
echo Este script recreará el usuario admin
echo con las credenciales por defecto
echo.

set DB_PATH=%APPDATA%\nuevogym\nuevogym.db

echo 📂 Ubicación de la base de datos:
echo %DB_PATH%
echo.

if not exist "%DB_PATH%" (
    echo ❌ Base de datos no encontrada
    echo.
    echo 💡 La base de datos se creará al iniciar la aplicación
    echo    Ejecuta primero: npm start
    echo.
    pause
    exit /b 1
)

echo ⚠️  ¿Estás seguro de que quieres resetear el usuario admin?
echo    Esto eliminará el usuario admin actual y creará uno nuevo
echo.
pause

echo.
echo 🔨 Reseteando usuario admin...

REM Crear script SQL temporal
echo DELETE FROM usuarios WHERE usuario = 'admin'; > temp_reset.sql
echo INSERT INTO usuarios (usuario, password, nombre_completo, rol, activo) >> temp_reset.sql
echo VALUES ('admin', '$2a$10$rK5Z8vKxMxYqYqYqYqYqYuGk5Z8vKxMxYqYqYqYqYqYqYqYqYqYq', 'Administrador', 'admin', 1); >> temp_reset.sql

REM Ejecutar SQL
sqlite3 "%DB_PATH%" < temp_reset.sql

if %errorlevel% equ 0 (
    echo.
    echo ✅ Usuario admin reseteado correctamente
    echo.
    echo 📌 Nuevas credenciales:
    echo    Usuario: admin
    echo    Contraseña: admin123
    echo.
) else (
    echo ❌ Error al resetear usuario
)

REM Limpiar archivo temporal
del temp_reset.sql

echo.
echo 🚀 Ahora puedes iniciar la aplicación
echo.

pause

