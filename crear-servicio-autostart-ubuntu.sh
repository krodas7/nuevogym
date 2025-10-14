#!/bin/bash

echo "========================================"
echo "   🚀 CREAR SERVICIO AUTOSTART NUEVOGYM"
echo "========================================"

# Obtener directorio actual
CURRENT_DIR=$(pwd)
SCRIPT_PATH="$CURRENT_DIR/iniciar-ubuntu.sh"
USER_NAME=$(whoami)

echo "📂 Directorio del proyecto: $CURRENT_DIR"
echo "👤 Usuario: $USER_NAME"

# OPCIÓN 1: Servicio systemd (Recomendado para servidores)
echo ""
echo "🔧 OPCIÓN 1: Servicio systemd"
echo "=============================="

SERVICE_FILE="/etc/systemd/system/nuevogym.service"

echo "📝 Creando servicio systemd..."

sudo tee $SERVICE_FILE > /dev/null << EOF
[Unit]
Description=NuevoGym - Sistema de Gestión de Gimnasio
After=network.target
Wants=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$CURRENT_DIR
ExecStart=$SCRIPT_PATH
Restart=always
RestartSec=10
Environment=DISPLAY=:0
Environment=ELECTRON_DISABLE_SANDBOX=1

[Install]
WantedBy=multi-user.target
EOF

echo "✅ Servicio systemd creado"

# OPCIÓN 2: Autostart en sesión de usuario
echo ""
echo "🔧 OPCIÓN 2: Autostart de sesión"
echo "================================="

AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"

AUTOSTART_FILE="$AUTOSTART_DIR/nuevogym.desktop"

cat > "$AUTOSTART_FILE" << EOF
[Desktop Entry]
Type=Application
Name=NuevoGym
Comment=Sistema de Gestión de Gimnasio
Exec=$SCRIPT_PATH
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
StartupNotify=false
EOF

echo "✅ Autostart de sesión creado"

# OPCIÓN 3: Script de inicio en ~/.bashrc (solo para terminal)
echo ""
echo "🔧 OPCIÓN 3: Alias rápido"
echo "========================="

# Agregar alias si no existe
if ! grep -q "alias nuevogym" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# NuevoGym" >> ~/.bashrc
    echo "alias nuevogym='cd $CURRENT_DIR && ./iniciar-ubuntu.sh'" >> ~/.bashrc
    echo "✅ Alias agregado a ~/.bashrc"
else
    echo "ℹ️  Alias ya existe en ~/.bashrc"
fi

# Crear script de inicio manual
echo ""
echo "🔧 OPCIÓN 4: Script de inicio manual"
echo "===================================="

INICIO_FILE="$HOME/iniciar-nuevogym.sh"

cat > "$INICIO_FILE" << EOF
#!/bin/bash
echo "🚀 Iniciando NuevoGym..."
cd "$CURRENT_DIR"
./iniciar-ubuntu.sh
EOF

chmod +x "$INICIO_FILE"
echo "✅ Script de inicio manual creado: $INICIO_FILE"

echo ""
echo "========================================"
echo "   ✅ SERVICIOS Y AUTOSTART CREADOS"
echo "========================================"
echo ""
echo "🎯 OPCIONES DISPONIBLES:"
echo ""
echo "1️⃣  SERVICIO SYSTEMD (Recomendado):"
echo "    sudo systemctl enable nuevogym"
echo "    sudo systemctl start nuevogym"
echo "    sudo systemctl status nuevogym"
echo ""
echo "2️⃣  AUTOSTART DE SESIÓN (Se inicia al iniciar sesión):"
echo "    Ya está activado - se iniciará al hacer login"
echo ""
echo "3️⃣  COMANDO RÁPIDO:"
echo "    nuevogym  (desde cualquier terminal)"
echo ""
echo "4️⃣  SCRIPT MANUAL:"
echo "    $INICIO_FILE"
echo ""
echo "🔧 COMANDOS DE CONTROL:"
echo "    sudo systemctl stop nuevogym      # Detener"
echo "    sudo systemctl restart nuevogym   # Reiniciar"
echo "    sudo systemctl disable nuevogym   # Desactivar"
echo ""
echo "💡 RECOMENDACIÓN:"
echo "    Usa la OPCIÓN 2 (Autostart de sesión) para uso normal"
echo "    Usa la OPCIÓN 1 (systemd) si quieres que inicie siempre"
echo ""
