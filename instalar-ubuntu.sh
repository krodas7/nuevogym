#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "   NUEVOGYM - INSTALACIÓN UBUNTU"
echo "========================================"
echo ""

# Verificar si Node.js está instalado
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo ""
    echo -e "${YELLOW}📥 Instalando Node.js LTS...${NC}"
    
    # Instalar Node.js usando NodeSource
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar Node.js${NC}"
        echo ""
        echo "Por favor, instala Node.js manualmente:"
        echo "https://nodejs.org/"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Node.js detectado: $(node --version)${NC}"
echo -e "${GREEN}✅ npm detectado: $(npm --version)${NC}"
echo ""

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Git...${NC}"
    sudo apt-get update
    sudo apt-get install -y git
fi

# Limpiar instalación anterior
echo -e "${BLUE}🧹 Limpiando instalación anterior...${NC}"
if [ -d "node_modules" ]; then
    rm -rf node_modules
fi
if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
fi
if [ -d "dist" ]; then
    rm -rf dist
fi
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
echo -e "${YELLOW}⏱️  Esto puede tomar 2-3 minutos...${NC}"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    echo ""
    echo "Soluciones:"
    echo "  1. Verifica tu conexión a internet"
    echo "  2. Ejecuta: sudo npm install --legacy-peer-deps"
    echo "  3. Verifica que tengas permisos de escritura"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Construir frontend
echo -e "${BLUE}🔨 Construyendo frontend...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error construyendo frontend${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend construido${NC}"
echo ""

# Crear script de inicio
echo -e "${BLUE}🔗 Creando script de inicio...${NC}"
cat > iniciar.sh << 'EOF'
#!/bin/bash

echo ""
echo "🚀 Iniciando NuevoGym..."
echo "🌐 La aplicación se abrirá en: http://localhost:4000"
echo ""
echo "⚠️  IMPORTANTE: Mantén esta terminal abierta"
echo "   Presiona Ctrl+C para detener el servidor"
echo ""

# Abrir navegador automáticamente
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:4000 &
elif command -v gnome-open &> /dev/null; then
    gnome-open http://localhost:4000 &
fi

# Iniciar servidor
node server.js
EOF

chmod +x iniciar.sh

echo -e "${GREEN}✅ Script de inicio creado: iniciar.sh${NC}"
echo ""

# Verificar instalación
echo -e "${BLUE}🔍 Verificando instalación...${NC}"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules - OK${NC}"
else
    echo -e "${RED}❌ node_modules - FALTANTE${NC}"
fi

if [ -f "dist/index.html" ]; then
    echo -e "${GREEN}✅ Frontend - OK${NC}"
else
    echo -e "${RED}❌ Frontend - FALTANTE${NC}"
fi

if [ -f "server.js" ]; then
    echo -e "${GREEN}✅ Servidor - OK${NC}"
else
    echo -e "${RED}❌ Servidor - FALTANTE${NC}"
fi

echo ""
echo "========================================"
echo "   ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
echo -e "${GREEN}🎉 ¡NuevoGym está listo para usar!${NC}"
echo ""
echo "📋 INFORMACIÓN:"
echo "   • Usuario: admin"
echo "   • Contraseña: admin123"
echo "   • URL: http://localhost:4000"
echo ""
echo "🚀 PARA INICIAR:"
echo "   ./iniciar.sh"
echo ""
echo "   O manualmente:"
echo "   node server.js"
echo ""

# Preguntar si quiere iniciar ahora
read -p "¿Quieres iniciar NuevoGym ahora? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Iniciando NuevoGym...${NC}"
    ./iniciar.sh
else
    echo ""
    echo "👋 Instalación completada. Ejecuta ./iniciar.sh cuando quieras usar la aplicación."
fi

