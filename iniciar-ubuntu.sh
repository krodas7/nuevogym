#!/bin/bash

echo "========================================"
echo "   🐧 NUEVOGYM - UBUNTU"
echo "========================================"
echo "🚀 Iniciando NuevoGym en Ubuntu..."
echo ""

# Matar procesos previos si existen
echo "🧹 Limpiando procesos anteriores..."
pkill -f "vite" 2>/dev/null
pkill -f "electron" 2>/dev/null
sleep 2

# Iniciar React en background
echo "📱 Iniciando servidor React..."
npm run start:react &
REACT_PID=$!

# Esperar a que React esté listo
echo "⏳ Esperando que React esté listo..."
sleep 5

# Verificar que React esté corriendo
if ! curl -s http://localhost:4000 > /dev/null; then
    echo "❌ Error: React no está respondiendo en puerto 4000"
    kill $REACT_PID 2>/dev/null
    exit 1
fi

echo "✅ React iniciado correctamente en http://localhost:4000"

# Iniciar Electron sin sandbox
echo "🖥️  Iniciando Electron (modo Ubuntu)..."
ELECTRON_DISABLE_SANDBOX=1 npm run start:electron &
ELECTRON_PID=$!

echo ""
echo "========================================"
echo "   ✅ NUEVOGYM INICIADO"
echo "========================================"
echo "🌐 Web: http://localhost:4000"
echo "🖥️  Electron: Ventana de aplicación"
echo ""
echo "👤 Usuario: admin"
echo "🔑 Contraseña: admin123"
echo ""
echo "💡 Para detener: Ctrl+C"
echo ""

# Esperar a que el usuario termine
wait $ELECTRON_PID
