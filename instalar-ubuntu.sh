#!/bin/bash

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "========================================"
echo "   NUEVOGYM - INSTALACIÓN UBUNTU"
echo "========================================"
echo ""

# Verificar Node.js
echo -e "${BLUE}🔍 Verificando Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    echo ""
    echo -e "${YELLOW}📥 Instalando Node.js LTS...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al instalar Node.js${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
echo ""

# Verificar Git
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📥 Instalando Git...${NC}"
    sudo apt-get install -y git
fi

# Limpiar instalación anterior
echo -e "${BLUE}🧹 Limpiando instalación anterior...${NC}"
rm -rf node_modules package-lock.json dist
echo -e "${GREEN}✅ Limpieza completada${NC}"
echo ""

# Instalar dependencias
echo -e "${BLUE}📦 Instalando dependencias...${NC}"
echo -e "${YELLOW}⏱️  Esto puede tomar 3-5 minutos...${NC}"
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al instalar dependencias${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias instaladas${NC}"
echo ""

# Recompilar módulos nativos para Electron
echo -e "${BLUE}🔧 Recompilando módulos nativos para Electron...${NC}"
echo -e "${YELLOW}⏱️  Esto puede tomar 2-3 minutos...${NC}"
npm run rebuild

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al recompilar módulos nativos${NC}"
    echo ""
    echo -e "${YELLOW}💡 Solución: Instala herramientas de compilación${NC}"
    echo "sudo apt-get install build-essential python3"
    exit 1
fi

echo -e "${GREEN}✅ Módulos nativos recompilados${NC}"
echo ""

# Construir frontend
echo -e "${BLUE}🔨 Construyendo frontend...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir frontend${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend construido${NC}"
echo ""

# Crear script de inicio
echo -e "${BLUE}🔗 Creando script de inicio...${NC}"
cat > iniciar.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando NuevoGym con Electron..."
npm start
EOF

chmod +x iniciar.sh
echo -e "${GREEN}✅ Script de inicio creado: iniciar.sh${NC}"
echo ""

# Resumen
echo "========================================"
echo "   ✅ INSTALACIÓN COMPLETADA"
echo "========================================"
echo ""
echo -e "${GREEN}🎉 ¡NuevoGym está listo!${NC}"
echo ""
echo "📋 INFORMACIÓN:"
echo "   • Usuario: admin"
echo "   • Contraseña: admin123"
echo "   • Aplicación: Electron (ventana propia)"
echo ""
echo "🚀 PARA INICIAR:"
echo "   ./iniciar.sh"
echo ""
echo "   O manualmente:"
echo "   npm start"
echo ""
echo -e "${BLUE}¿Quieres iniciar NuevoGym ahora? (s/n):${NC}"
read -p "" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo ""
    echo -e "${GREEN}🚀 Iniciando NuevoGym...${NC}"
    npm start
else
    echo ""
    echo "👋 Instalación completada. Ejecuta ./iniciar.sh cuando quieras usar la aplicación."
fi
