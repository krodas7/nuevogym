#!/bin/bash

echo "========================================"
echo "   🐧 NUEVOGYM UBUNTU CON SENSOR"
echo "========================================"

# Función para verificar si Wine está instalado
check_wine() {
    if ! command -v wine &> /dev/null; then
        echo "❌ Wine no está instalado"
        return 1
    fi
    return 0
}

# Función para instalar Wine
install_wine() {
    echo "🍷 Instalando Wine..."
    
    # Habilitar arquitectura i386
    sudo dpkg --add-architecture i386
    sudo apt update
    
    # Instalar Wine
    sudo apt install -y wine wine32 wine64 libwine fonts-wine
    
    echo "✅ Wine instalado"
}

# Función para configurar Wine
setup_wine() {
    echo "🔧 Configurando Wine..."
    
    # Configurar Wine
    winecfg &
    sleep 3
    
    echo "📝 En winecfg:"
    echo "   1. Ir a 'Aplicaciones'"
    echo "   2. Añadir aplicación: api.exe"
    echo "   3. Marcar 'Ejecutar como administrador'"
    echo "   4. En 'Bibliotecas' agregar: ws2_32 (nativo)"
    echo ""
    echo "⏳ Esperando 10 segundos para que configures..."
    sleep 10
    
    # Matar winecfg
    pkill -f winecfg
}

# Función para iniciar el sensor API
start_sensor_api() {
    local api_path="/home/gym/Escritorio/ZKTecoFingerPrintScanner-Implementation-master/ZKTecoFingerPrintScanner-Implementation-master/api/bin/x86/Release/api.exe"
    
    if [ ! -f "$api_path" ]; then
        echo "❌ No se encontró api.exe en: $api_path"
        echo "🔍 Buscando api.exe..."
        
        # Buscar api.exe en el sistema
        api_path=$(find /home -name "api.exe" 2>/dev/null | head -1)
        
        if [ -z "$api_path" ]; then
            echo "❌ No se encontró api.exe en el sistema"
            echo "💡 NuevoGym funcionará sin sensor de huellas"
            return 1
        fi
        
        echo "✅ Encontrado en: $api_path"
    fi
    
    echo "🍷 Iniciando sensor API con Wine..."
    echo "📂 Directorio: $(dirname "$api_path")"
    
    cd "$(dirname "$api_path")"
    
    # Intentar ejecutar con Wine
    echo "🚀 Ejecutando: wine api.exe"
    wine api.exe &
    
    local api_pid=$!
    sleep 3
    
    # Verificar si está corriendo
    if kill -0 $api_pid 2>/dev/null; then
        echo "✅ Sensor API iniciado correctamente (PID: $api_pid)"
        echo "🌐 Webhook: http://localhost:9000/webhook"
        return 0
    else
        echo "❌ Error al iniciar sensor API"
        echo "💡 NuevoGym funcionará sin sensor de huellas"
        return 1
    fi
}

# Función para iniciar NuevoGym
start_nuevogym() {
    echo "🚀 Iniciando NuevoGym..."
    
    # Ir al directorio del proyecto
    cd /home/gym/Documentos/Proyectos/nuevogym
    
    # Matar procesos anteriores
    pkill -f "vite" 2>/dev/null
    pkill -f "electron" 2>/dev/null
    sleep 2
    
    # Iniciar aplicación
    echo "📱 Iniciando servidor React..."
    npm run start:react &
    local react_pid=$!
    
    # Esperar a que React esté listo
    echo "⏳ Esperando que React esté listo..."
    sleep 5
    
    # Verificar que React esté corriendo
    if curl -s http://localhost:4000 > /dev/null; then
        echo "✅ React iniciado correctamente"
    else
        echo "❌ Error al iniciar React"
        return 1
    fi
    
    # Iniciar Electron
    echo "🖥️  Iniciando Electron..."
    ELECTRON_DISABLE_SANDBOX=1 npm run start:electron &
    local electron_pid=$!
    
    echo ""
    echo "========================================"
    echo "   ✅ NUEVOGYM INICIADO"
    echo "========================================"
    echo "🌐 Web: http://localhost:4000"
    echo "🖥️  Electron: Ventana de aplicación"
    echo "📡 Webhook: http://localhost:9000/webhook"
    echo ""
    echo "👤 Usuario: admin"
    echo "🔑 Contraseña: admin123"
    echo ""
    echo "💡 Para detener: Ctrl+C"
    echo ""
    
    # Esperar a que el usuario termine
    wait $electron_pid
}

# Función principal
main() {
    echo "🔍 Verificando sistema..."
    
    # Verificar Wine
    if ! check_wine; then
        echo "❓ ¿Quieres instalar Wine para el sensor? (s/n)"
        read -r response
        if [[ "$response" =~ ^[Ss]$ ]]; then
            install_wine
            setup_wine
        else
            echo "💡 NuevoGym funcionará sin sensor de huellas"
        fi
    fi
    
    # Intentar iniciar sensor API
    echo ""
    echo "🔧 Iniciando sensor de huellas..."
    if start_sensor_api; then
        echo "✅ Sensor de huellas activo"
    else
        echo "⚠️  Sensor de huellas no disponible"
    fi
    
    # Iniciar NuevoGym
    echo ""
    start_nuevogym
}

# Ejecutar función principal
main
