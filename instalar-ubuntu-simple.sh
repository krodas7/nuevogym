#!/bin/bash

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "========================================"
echo "   NUEVOGYM - INSTALACIÓN SIMPLE"
echo "========================================"
echo ""

# Verificar Node.js
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo "Instala Node.js con: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo ""

# Limpiar
echo -e "${BLUE}🧹 Limpiando...${NC}"
rm -rf node_modules package-lock.json dist
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# Instalar
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Construir
echo -e "${BLUE}🔨 Construyendo frontend...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend construido${NC}"
echo ""

# Crear script de inicio
cat > iniciar.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando NuevoGym..."
echo "🌐 Abriendo http://localhost:4000"
xdg-open http://localhost:4000 2>/dev/null || gnome-open http://localhost:4000 2>/dev/null &
node server.js
EOF

chmod +x iniciar.sh

echo ""
echo "========================================"
echo "   ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
echo -e "${GREEN}🎉 ¡Listo!${NC}"
echo ""
echo "📋 INFORMACIÓN:"
echo "   • Usuario: admin"
echo "   • Contraseña: admin123"
echo "   • URL: http://localhost:4000"
echo ""
echo "🚀 PARA INICIAR:"
echo "   ./iniciar.sh"
echo ""

