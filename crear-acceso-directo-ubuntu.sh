#!/bin/bash

echo "========================================"
echo "   🚀 CREAR ACCESO DIRECTO NUEVOGYM"
echo "========================================"

# Obtener directorio actual
CURRENT_DIR=$(pwd)
SCRIPT_PATH="$CURRENT_DIR/iniciar-ubuntu.sh"

# Crear script en /usr/local/bin (accesible globalmente)
echo "📝 Creando comando global 'nuevogym'..."

# Crear script global
sudo tee /usr/local/bin/nuevogym > /dev/null << EOF
#!/bin/bash
cd "$CURRENT_DIR"
./iniciar-ubuntu.sh
EOF

# Dar permisos
sudo chmod +x /usr/local/bin/nuevogym

echo "✅ Comando global creado"

# Crear acceso directo en escritorio
echo "🖥️  Creando acceso directo en escritorio..."

DESKTOP_FILE="$HOME/Desktop/nuevogym.desktop"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=$SCRIPT_PATH
Icon=applications-games
Terminal=true
Categories=Office;
StartupNotify=true
EOF

chmod +x "$DESKTOP_FILE"

echo "✅ Acceso directo creado en escritorio"

# Crear entrada en aplicaciones
echo "📱 Agregando a menú de aplicaciones..."

MENU_FILE="$HOME/.local/share/applications/nuevogym.desktop"

cat > "$MENU_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=$SCRIPT_PATH
Icon=applications-games
Terminal=true
Categories=Office;
StartupNotify=true
EOF

chmod +x "$MENU_FILE"

echo "✅ Agregado al menú de aplicaciones"

echo ""
echo "========================================"
echo "   ✅ ACCESOS DIRECTOS CREADOS"
echo "========================================"
echo ""
echo "🎯 FORMAS DE INICIAR NUEVOGYM:"
echo ""
echo "1️⃣  Desde terminal (cualquier lugar):"
echo "    nuevogym"
echo ""
echo "2️⃣  Desde escritorio:"
echo "    Doble clic en 'NuevoGym'"
echo ""
echo "3️⃣  Desde menú de aplicaciones:"
echo "    Buscar 'NuevoGym'"
echo ""
echo "4️⃣  Desde directorio del proyecto:"
echo "    ./iniciar-ubuntu.sh"
echo ""
echo "💡 También puedes crear un alias en tu .bashrc:"
echo "    echo 'alias gym=\"cd $CURRENT_DIR && ./iniciar-ubuntu.sh\"' >> ~/.bashrc"
echo ""
