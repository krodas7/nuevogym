#!/bin/bash

echo "========================================"
echo "   🐳 NUEVOGYM - DOCKER"
echo "========================================"

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado"
    echo "📥 Instalando Docker..."
    
    # Instalar Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    
    echo "✅ Docker instalado"
    echo "🔄 Reinicia tu sesión para usar Docker"
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado"
    echo "📥 Instalando Docker Compose..."
    
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "✅ Docker Compose instalado"
fi

# Crear directorio para la base de datos
mkdir -p ./database

# Construir y ejecutar
echo "🔨 Construyendo imagen Docker..."
docker-compose build

echo "🚀 Iniciando NuevoGym..."
docker-compose up

echo ""
echo "✅ NuevoGym está corriendo en Docker!"
echo "🌐 Accede a: http://localhost:4000"
echo "📡 Webhook: http://localhost:9000/webhook"
echo ""
echo "💡 Para detener: Ctrl+C"
echo "💡 Para ejecutar en background: docker-compose up -d"
