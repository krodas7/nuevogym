@echo off
chcp 65001 >nul
title NuevoGym - Sistema de Gestión de Gimnasio

echo.
echo ========================================
echo    NUEVOGYM - SISTEMA DE GIMNASIO
echo ========================================
echo.
echo 🚀 Iniciando NuevoGym...
echo 🌐 La aplicación se abrirá en: http://localhost:4000
echo.
echo ⚠️  IMPORTANTE: No cierres esta ventana
echo    La aplicación se ejecuta desde aquí
echo.

REM Abrir navegador automáticamente
start http://localhost:4000

REM Iniciar servidor
node server.js

echo.
echo 👋 Presiona cualquier tecla para cerrar...
pause >nul
