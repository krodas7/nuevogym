# 🖥️ NuevoGym - Versión Desktop (Tauri)

## 📋 **¿QUÉ ES LA VERSIÓN DESKTOP?**

NuevoGym ahora tiene **DOS versiones**:

### **1. Versión Web (actual)**
- 🌐 Se abre en el navegador
- ✅ Instalación rápida
- ✅ Funciona en cualquier sistema

### **2. Versión Desktop (nueva - Tauri)**
- 🖥️ Aplicación nativa de escritorio
- 📦 Instalador .exe (Windows), .AppImage (Ubuntu), .dmg (Mac)
- ✅ Icono en el escritorio
- ✅ Ventana propia (no necesita navegador visible)
- ⚡ Más rápida y ligera que Electron

---

## 🚀 **COMPILAR VERSIÓN DESKTOP**

### **Requisitos previos:**

#### **Ubuntu/Linux:**
```bash
# Instalar dependencias de Tauri
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

#### **Windows:**
```cmd
# Instalar Rust desde: https://rustup.rs/
# Descargar e instalar: rustup-init.exe
# Reiniciar la terminal después de instalar
```

#### **Mac:**
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Instalar Xcode Command Line Tools
xcode-select --install
```

---

## 🔨 **COMPILAR LA APLICACIÓN**

### **Ubuntu:**
```bash
# 1. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Dar permisos
chmod +x compilar-desktop-ubuntu.sh

# 3. Compilar
./compilar-desktop-ubuntu.sh

# Resultado: src-tauri/target/release/bundle/appimage/nuevogym_1.0.0_amd64.AppImage
```

### **Windows:**
```cmd
REM 1. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

REM 2. Compilar
COMPILAR-DESKTOP-WINDOWS.bat

REM Resultado: src-tauri\target\release\bundle\msi\NuevoGym_1.0.0_x64.msi
```

### **Mac:**
```bash
# 1. Clonar el repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Compilar
chmod +x compilar-desktop-mac.sh
./compilar-desktop-mac.sh

# Resultado: src-tauri/target/release/bundle/dmg/NuevoGym_1.0.0_x64.dmg
```

---

## 📦 **INSTALAR LA APLICACIÓN COMPILADA**

### **Ubuntu:**
```bash
# Dar permisos de ejecución
chmod +x nuevogym_1.0.0_amd64.AppImage

# Ejecutar
./nuevogym_1.0.0_amd64.AppImage

# O instalar (opcional)
sudo apt install libfuse2
./nuevogym_1.0.0_amd64.AppImage --appimage-extract
sudo mv squashfs-root /opt/nuevogym
sudo ln -s /opt/nuevogym/AppRun /usr/local/bin/nuevogym
```

### **Windows:**
```cmd
REM Doble clic en:
NuevoGym_1.0.0_x64.msi

REM Seguir el asistente de instalación
REM La aplicación se instalará en: C:\Program Files\NuevoGym
```

### **Mac:**
```bash
# Abrir el .dmg
open NuevoGym_1.0.0_x64.dmg

# Arrastrar NuevoGym.app a Aplicaciones
```

---

## 🎯 **DIFERENCIAS: WEB vs DESKTOP**

| Característica | Versión Web | Versión Desktop |
|----------------|-------------|-----------------|
| **Instalación** | npm install | Instalador nativo |
| **Tamaño** | ~5MB | ~15MB |
| **Inicio** | `./iniciar.sh` o `INICIAR.bat` | Icono en escritorio |
| **Interfaz** | Navegador | Ventana propia |
| **Icono** | No | Sí |
| **Menú aplicaciones** | No | Sí |
| **Actualización** | `git pull` | Nuevo instalador |
| **Base de datos** | Local | Local |
| **Funcionalidad** | 100% | 100% |

---

## 🔧 **DESARROLLO (PARA PROGRAMADORES)**

### **Modo desarrollo:**
```bash
# Iniciar en modo desarrollo
npm run tauri dev

# Esto abre la aplicación desktop con hot-reload
```

### **Compilar para producción:**
```bash
# Compilar
npm run tauri build

# Los archivos estarán en:
# src-tauri/target/release/bundle/
```

---

## 📁 **ESTRUCTURA DEL PROYECTO TAURI**

```
nuevogym/
├── src/                    ← Frontend React (sin cambios)
├── public/                 ← Archivos públicos (sin cambios)
├── server.js               ← Backend Node.js (sin cambios)
├── src-tauri/              ← Configuración Tauri (nuevo)
│   ├── src/
│   │   └── main.rs         ← Código Rust principal
│   ├── tauri.conf.json     ← Configuración de Tauri
│   ├── Cargo.toml          ← Dependencias Rust
│   └── icons/              ← Iconos de la app
├── compilar-desktop-ubuntu.sh
├── COMPILAR-DESKTOP-WINDOWS.bat
└── compilar-desktop-mac.sh
```

---

## ⚙️ **CONFIGURACIÓN**

### **Cambiar puerto del servidor:**
Edita `src-tauri/tauri.conf.json`:
```json
{
  "build": {
    "devPath": "http://localhost:4000",  ← Cambiar aquí
    "distDir": "../dist"
  }
}
```

### **Cambiar nombre de la app:**
Edita `src-tauri/tauri.conf.json`:
```json
{
  "package": {
    "productName": "NuevoGym",  ← Cambiar aquí
    "version": "1.0.0"
  }
}
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Rust not found"**
```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### **Error: "webkit2gtk not found" (Ubuntu)**
```bash
sudo apt install libwebkit2gtk-4.0-dev
```

### **Error: "Build failed" (Windows)**
```cmd
REM Instalar Visual Studio Build Tools
REM https://visualstudio.microsoft.com/downloads/
REM Seleccionar "Desktop development with C++"
```

### **Compilación muy lenta**
```bash
# Primera compilación toma 5-10 minutos (normal)
# Compilaciones siguientes son más rápidas (1-2 minutos)
```

---

## 📊 **TAMAÑOS DE INSTALADORES**

| Sistema | Formato | Tamaño aprox. |
|---------|---------|---------------|
| Ubuntu | .AppImage | ~15MB |
| Ubuntu | .deb | ~8MB |
| Windows | .msi | ~12MB |
| Windows | .exe | ~10MB |
| Mac | .dmg | ~15MB |
| Mac | .app | ~12MB |

---

## 🎉 **VENTAJAS DE LA VERSIÓN DESKTOP**

1. ✅ **Aplicación nativa** - Se ve y se siente como app de escritorio
2. ✅ **Icono en el escritorio** - Fácil acceso
3. ✅ **No necesita terminal** - Se ejecuta directamente
4. ✅ **Más profesional** - Para clientes que prefieren apps nativas
5. ✅ **Ligera** - Solo ~15MB vs 200MB de Electron
6. ✅ **Rápida** - Usa el navegador del sistema (WebView)
7. ✅ **Segura** - Tauri está escrito en Rust (muy seguro)
8. ✅ **Fácil de distribuir** - Un solo archivo instalador

---

## 🤝 **COMPATIBILIDAD**

### **Versión Web y Desktop pueden coexistir:**
- ✅ Puedes tener ambas instaladas
- ✅ Usan la misma base de datos
- ✅ Misma funcionalidad
- ✅ Usuario elige cuál usar

---

## 📞 **SOPORTE**

### **¿Problemas al compilar?**
1. Verifica que Rust esté instalado: `rustc --version`
2. Verifica que Node.js esté instalado: `node --version`
3. Revisa los logs de compilación
4. Consulta: https://tauri.app/v1/guides/debugging/

### **¿La app no inicia?**
1. Verifica que el puerto 4000 esté libre
2. Revisa los logs en: `~/.config/nuevogym/logs/`
3. Intenta ejecutar el backend manualmente: `node server.js`

---

## 🚀 **INICIO RÁPIDO**

```bash
# Ubuntu - Compilar app desktop
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
chmod +x compilar-desktop-ubuntu.sh
./compilar-desktop-ubuntu.sh

# Instalar
chmod +x src-tauri/target/release/bundle/appimage/nuevogym_1.0.0_amd64.AppImage
./src-tauri/target/release/bundle/appimage/nuevogym_1.0.0_amd64.AppImage

# ¡Listo! 🎉
```

---

**¡Disfruta de NuevoGym Desktop!** 🖥️✨

