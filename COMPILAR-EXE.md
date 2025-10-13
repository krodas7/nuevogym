# 🚀 Cómo Compilar el .exe de Windows Automáticamente

## ✅ **GitHub Actions está configurado**

Cada vez que hagas `git push`, GitHub compilará automáticamente:
- ✅ **Instalador NSIS** (`.exe` con instalador)
- ✅ **Versión Portable** (`.exe` sin instalador)

---

## 📥 **Cómo Descargar el .exe**

### **Paso 1: Ir a GitHub Actions**
1. Abre tu repositorio: https://github.com/krodas7/nuevogym
2. Haz clic en la pestaña **"Actions"**
3. Verás el workflow **"🏗️ Build Windows Installer"**

### **Paso 2: Esperar la compilación**
- ⏱️ Tarda **5-10 minutos**
- ✅ Cuando termine, verás un ✅ verde

### **Paso 3: Descargar el .exe**
1. Haz clic en el workflow completado
2. Baja hasta **"Artifacts"**
3. Descarga **"NuevoGym-Windows-Installer"**
4. Descomprime el `.zip` y tendrás:
   - `NuevoGym - Sistema de Gestión de Gimnasio-Setup-1.0.0.exe` (instalador)
   - `NuevoGym - Sistema de Gestión de Gimnasio-1.0.0-Portable.exe` (portable)

---

## 🔄 **Activar Manualmente**

Si quieres compilar SIN hacer cambios:
1. Ve a **Actions** → **🏗️ Build Windows Installer**
2. Haz clic en **"Run workflow"** → **"Run workflow"**
3. Espera 5-10 minutos
4. Descarga el `.exe` desde **Artifacts**

---

## ⚠️ **Importante**

- ✅ **NO necesitas Visual Studio** en tu PC
- ✅ **NO necesitas Python** en tu PC
- ✅ **NO necesitas compilar localmente**
- ✅ **GitHub lo hace todo automáticamente**

---

## 🎯 **Ventajas**

- ✅ Compila en servidores de GitHub (gratis)
- ✅ Funciona para Windows + Mac
- ✅ Sin problemas de módulos nativos
- ✅ `.exe` listo para distribuir

---

**¡Listo! Ahora solo haces `git push` y GitHub te da el `.exe` compilado.** 🚀

