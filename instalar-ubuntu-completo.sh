#!/bin/bash

echo "========================================"
echo "   🐧 NUEVOGYM - INSTALACIÓN COMPLETA UBUNTU"
echo "========================================"

# Función para verificar Node.js
check_nodejs() {
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js no está instalado"
        return 1
    fi
    
    local version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$version" -lt 16 ]; then
        echo "❌ Node.js versión $version es muy antigua (mínimo 16)"
        return 1
    fi
    
    echo "✅ Node.js: $(node --version)"
    echo "✅ npm: $(npm --version)"
    return 0
}

# Función para instalar Node.js
install_nodejs() {
    echo "📥 Instalando Node.js..."
    
    # Instalar curl si no está
    sudo apt install -y curl
    
    # Instalar Node.js LTS
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    echo "✅ Node.js instalado"
}

# Función para instalar herramientas de compilación
install_build_tools() {
    echo "🔧 Instalando herramientas de compilación..."
    sudo apt install -y build-essential python3 python3-pip
    echo "✅ Herramientas instaladas"
}

# Función para instalar Wine (opcional)
install_wine() {
    echo "🍷 Instalando Wine para sensor de huellas..."
    
    # Habilitar arquitectura i386
    sudo dpkg --add-architecture i386
    sudo apt update
    
    # Instalar Wine
    sudo apt install -y wine wine32 wine64 libwine fonts-wine
    
    echo "✅ Wine instalado"
}

# Función principal de instalación
main() {
    echo "🔍 Verificando sistema..."
    
    # Verificar Node.js
    if ! check_nodejs; then
        install_nodejs
    fi
    
    # Instalar herramientas de compilación
    install_build_tools
    
    # Preguntar sobre Wine
    echo ""
    echo "❓ ¿Quieres instalar Wine para el sensor de huellas? (s/n)"
    read -r response
    if [[ "$response" =~ ^[Ss]$ ]]; then
        install_wine
    fi
    
    echo ""
    echo "📦 Instalando dependencias del proyecto..."
    
    # Ir al directorio del proyecto
    cd /home/gym/Documentos/Proyectos/nuevogym
    
    # Limpiar instalación anterior
    echo "🧹 Limpiando instalación anterior..."
    rm -rf node_modules package-lock.json
    
    # Instalar dependencias
    echo "📦 Instalando dependencias..."
    npm install --legacy-peer-deps
    
    # Recompilar módulos nativos
    echo "🔧 Recompilando módulos nativos..."
    npm run rebuild
    
    # Construir frontend
    echo "🏗️  Construyendo frontend..."
    npm run build
    
    # Crear scripts de inicio
    echo "📝 Creando scripts de inicio..."
    
    # Script con sensor
    cp iniciar-ubuntu-con-sensor.sh iniciar-con-sensor.sh
    chmod +x iniciar-con-sensor.sh
    
    # Script sin sensor
    cat > iniciar-sin-sensor.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando NuevoGym sin sensor..."
cd /home/gym/Documentos/Proyectos/nuevogym
npm start
EOF
    chmod +x iniciar-sin-sensor.sh
    
    echo ""
    echo "========================================"
    echo "   ✅ INSTALACIÓN COMPLETADA"
    echo "========================================"
    echo ""
    echo "🎯 FORMAS DE INICIAR NUEVOGYM:"
    echo ""
    echo "1️⃣  Con sensor de huellas (si Wine está instalado):"
    echo "    ./iniciar-con-sensor.sh"
    echo ""
    echo "2️⃣  Sin sensor de huellas:"
    echo "    ./iniciar-sin-sensor.sh"
    echo ""
    echo "3️⃣  Comando directo:"
    echo "    npm start"
    echo ""
    echo "👤 Usuario: admin"
    echo "🔑 Contraseña: admin123"
    echo ""
    echo "💡 El script con sensor intentará usar Wine automáticamente"
    echo "💡 Si Wine no funciona, usará NuevoGym sin sensor"
}

# Ejecutar instalación
main
