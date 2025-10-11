#!/bin/bash

echo "🪟 Creando paquete para Windows..."

# Crear directorio de distribución
mkdir -p dist-electron/win-package
cd dist-electron/win-package

echo "📦 Copiando archivos de la aplicación..."

# Copiar archivos del frontend
cp -r ../../dist ./app

# Copiar archivos de electron
cp -r ../../electron ./app

# Copiar node_modules necesarios
echo "📚 Copiando dependencias nativas..."
mkdir -p ./app/node_modules

# Solo copiar las dependencias nativas necesarias
cp -r ../../node_modules/better-sqlite3 ./app/node_modules/
cp -r ../../node_modules/@serialport ./app/node_modules/
cp -r ../../node_modules/serialport ./app/node_modules/
cp -r ../../node_modules/@serialport/parser-readline ./app/node_modules/
cp -r ../../node_modules/bindings ./app/node_modules/
cp -r ../../node_modules/file-uri-to-path ./app/node_modules/

# Copiar package.json
cp ../../package.json ./app/

# Crear script de inicio para Windows
cat > start-nuevogym.bat << 'EOF'
@echo off
echo Iniciando NuevoGym...
cd /d "%~dp0"
node electron/main.js
pause
EOF

# Crear script de inicio para Windows (PowerShell)
cat > start-nuevogym.ps1 << 'EOF'
Write-Host "Iniciando NuevoGym..." -ForegroundColor Green
Set-Location $PSScriptRoot
node electron/main.js
Read-Host "Presiona Enter para cerrar"
EOF

# Crear README para Windows
cat > README-Windows.txt << 'EOF'
NuevoGym - Sistema de Gestión de Gimnasio
=========================================

REQUISITOS:
- Windows 10/11 (64-bit)
- Node.js 18+ instalado
- Puerto COM disponible (para chapa eléctrica)
- Conexión de red (para sensor de huellas)

INSTALACIÓN:
1. Instalar Node.js desde https://nodejs.org
2. Ejecutar start-nuevogym.bat como administrador
3. Login con: admin / admin123
4. Cambiar contraseña en Configuración

CONFIGURACIÓN:
- Sensor de huellas: Configurar IP en Configuración
- Chapa eléctrica: Configurar puerto COM en Configuración
- Base de datos: Se crea automáticamente en %APPDATA%/nuevogym/

SOPORTE:
- Verificar que Node.js esté instalado
- Ejecutar como administrador si hay problemas de permisos
- Verificar conexión de red para sensor de huellas

Versión: 1.0.0
EOF

echo "✅ Paquete creado en dist-electron/win-package/"
echo "📁 Archivos incluidos:"
echo "   - Aplicación completa"
echo "   - Scripts de inicio (BAT y PowerShell)"
echo "   - README con instrucciones"
echo ""
echo "🚀 Para usar en Windows:"
echo "   1. Copiar carpeta 'win-package' a la computadora Windows"
echo "   2. Instalar Node.js"
echo "   3. Ejecutar 'start-nuevogym.bat' como administrador"
