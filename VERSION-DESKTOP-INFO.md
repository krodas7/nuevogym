# 🖥️ Versión Desktop - Información

## 📢 **ESTADO ACTUAL**

La **versión desktop con Tauri** está disponible pero requiere compilación manual.

---

## 🌐 **VERSIÓN RECOMENDADA: WEB APP**

**Por ahora, usa la versión Web App (actual):**

### **✅ Ventajas:**
- ✅ **Lista para usar** - Solo clonar e instalar
- ✅ **Sin compilación** - No necesita Rust
- ✅ **Funciona igual** - Misma funcionalidad
- ✅ **Fácil de actualizar** - Solo `git pull`
- ✅ **Multiplataforma** - Windows, Ubuntu, Mac

### **📥 Instalación rápida:**

#### **Ubuntu:**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
chmod +x instalar-ubuntu-simple.sh
./instalar-ubuntu-simple.sh
./iniciar.sh
```

#### **Windows:**
```cmd
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
INSTALAR-SIMPLE.bat
INICIAR.bat
```

---

## 🖥️ **VERSIÓN DESKTOP (TAURI)**

### **⚠️ Requiere:**
- Rust instalado
- Dependencias de compilación
- 5-10 minutos de compilación

### **📋 ¿Cuándo usarla?**
- Quieres una app nativa con icono en el escritorio
- Prefieres no ver el navegador
- Quieres distribuir un instalador .exe/.AppImage

### **🔨 Compilar:**
Lee el archivo `DESKTOP-README.md` para instrucciones completas.

---

## 🎯 **RECOMENDACIÓN**

**Para la mayoría de usuarios:**
→ Usa la **versión Web App** (más simple y rápida)

**Para usuarios avanzados:**
→ Compila la **versión Desktop** si necesitas una app nativa

---

## 📊 **COMPARACIÓN**

| Característica | Web App | Desktop (Tauri) |
|----------------|---------|-----------------|
| Instalación | ⚡ 2 minutos | ⏱️ 10-15 minutos |
| Requisitos | Node.js | Node.js + Rust |
| Compilación | No | Sí |
| Funcionalidad | 100% | 100% |
| Icono escritorio | ❌ | ✅ |
| Ventana propia | ❌ (navegador) | ✅ |
| Tamaño | ~5MB | ~15MB |
| Actualización | `git pull` | Nuevo instalador |

---

## 💡 **FUTURO**

En el futuro podríamos:
- Proveer instaladores pre-compilados (.AppImage, .exe, .dmg)
- Configurar CI/CD para compilación automática
- Distribuir en GitHub Releases

Por ahora, la versión Web App es la más práctica. 🚀

---

**¿Dudas? Revisa:**
- `README.md` - Documentación general
- `INSTRUCCIONES-UBUNTU.md` - Instalación Ubuntu
- `INSTRUCCIONES-WINDOWS.md` - Instalación Windows
- `DESKTOP-README.md` - Compilar versión desktop

