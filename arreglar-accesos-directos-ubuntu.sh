#!/bin/bash

echo "========================================"
echo "   🔧 ARREGLAR ACCESOS DIRECTOS UBUNTU"
echo "========================================"

# Obtener directorio actual
CURRENT_DIR=$(pwd)
SCRIPT_PATH="$CURRENT_DIR/iniciar-ubuntu.sh"

echo "📂 Directorio del proyecto: $CURRENT_DIR"
echo "🔧 Script correcto: $SCRIPT_PATH"

# Verificar que el script existe
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Error: No se encontró $SCRIPT_PATH"
    exit 1
fi

echo "✅ Script encontrado"

# Limpiar accesos directos incorrectos
echo ""
echo "🧹 Limpiando accesos directos incorrectos..."

# Eliminar archivos .desktop incorrectos
rm -f "$HOME/Desktop/nuevogym.desktop"
rm -f "$HOME/.local/share/applications/nuevogym.desktop"

# Eliminar comando global incorrecto
sudo rm -f /usr/local/bin/nuevogym

echo "✅ Accesos directos incorrectos eliminados"

# Crear accesos directos correctos
echo ""
echo "🔧 Creando accesos directos correctos..."

# 1. Acceso directo en escritorio (CORREGIDO)
echo "📱 Creando acceso directo en escritorio..."

DESKTOP_FILE="$HOME/Desktop/nuevogym.desktop"

cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=bash -c "cd '$CURRENT_DIR' && ./iniciar-ubuntu.sh"
Icon=applications-games
Terminal=true
Categories=Office;
StartupNotify=true
MimeType=
EOF

chmod +x "$DESKTOP_FILE"
echo "✅ Acceso directo en escritorio creado correctamente"

# 2. Comando global (CORREGIDO)
echo "🌐 Creando comando global..."

sudo tee /usr/local/bin/nuevogym > /dev/null << EOF
#!/bin/bash
cd "$CURRENT_DIR"
./iniciar-ubuntu.sh
EOF

sudo chmod +x /usr/local/bin/nuevogym
echo "✅ Comando global creado correctamente"

# 3. Entrada en menú de aplicaciones (CORREGIDA)
echo "📋 Agregando al menú de aplicaciones..."

MENU_FILE="$HOME/.local/share/applications/nuevogym.desktop"

cat > "$MENU_FILE" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=bash -c "cd '$CURRENT_DIR' && ./iniciar-ubuntu.sh"
Icon=applications-games
Terminal=true
Categories=Office;
StartupNotify=true
MimeType=
EOF

chmod +x "$MENU_FILE"
echo "✅ Agregado al menú de aplicaciones correctamente"

# 4. Autostart corregido
echo "🚀 Creando autostart corregido..."

AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"

AUTOSTART_FILE="$AUTOSTART_DIR/nuevogym.desktop"

cat > "$AUTOSTART_FILE" << EOF
[Desktop Entry]
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=bash -c "cd '$CURRENT_DIR' && ./iniciar-ubuntu.sh"
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
StartupNotify=false
MimeType=
EOF

echo "✅ Autostart corregido"

# 5. Crear script de prueba
echo "🧪 Creando script de prueba..."

TEST_FILE="$CURRENT_DIR/probar-acceso-directo.sh"

cat > "$TEST_FILE" << EOF
#!/bin/bash
echo "🧪 Probando acceso directo..."
echo "📂 Directorio: \$(pwd)"
echo "🔧 Script: $SCRIPT_PATH"
echo "✅ Ejecutando script..."

if [ -f "$SCRIPT_PATH" ]; then
    echo "✅ Script encontrado, ejecutando..."
    ./iniciar-ubuntu.sh
else
    echo "❌ Error: Script no encontrado"
    exit 1
fi
EOF

chmod +x "$TEST_FILE"

echo ""
echo "========================================"
echo "   ✅ ACCESOS DIRECTOS CORREGIDOS"
echo "========================================"
echo ""
echo "🎯 FORMAS DE INICIAR NUEVOGYM:"
echo ""
echo "1️⃣  Acceso directo en escritorio:"
echo "    Doble clic en 'NuevoGym' (CORREGIDO)"
echo ""
echo "2️⃣  Comando global:"
echo "    nuevogym  (desde cualquier terminal)"
echo ""
echo "3️⃣  Menú de aplicaciones:"
echo "    Buscar 'NuevoGym' (CORREGIDO)"
echo ""
echo "4️⃣  Autostart:"
echo "    Se iniciará automáticamente al hacer login"
echo ""
echo "🧪 PROBAR ACCESO DIRECTO:"
echo "    ./probar-acceso-directo.sh"
echo ""
echo "💡 CAMBIOS REALIZADOS:"
echo "    ✅ Eliminados accesos directos incorrectos"
echo "    ✅ Creados accesos directos con bash -c"
echo "    ✅ Corregida ruta del script"
echo "    ✅ Agregado MimeType= vacío"
echo ""
