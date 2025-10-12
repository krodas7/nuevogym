# 🤖 GitHub Actions - Compilación Automática

## 🎯 **¿Qué Es Esto?**

GitHub Actions compilará **AUTOMÁTICAMENTE** los instaladores de Windows y Mac cada vez que hagas `git push`.

**Ventajas:**
- ✅ NO necesitas Visual Studio en Windows
- ✅ NO necesitas compilar manualmente
- ✅ GitHub hace todo por ti (GRATIS)
- ✅ Instaladores 100% optimizados
- ✅ Compilados en servidores oficiales de GitHub

---

## 🚀 **Cómo Funciona**

### **Flujo Automático:**

```
1. Haces cambios en tu Mac (o Windows)
   ↓
2. git add .
   git commit -m "Mejoras"
   git push
   ↓
3. GitHub detecta el push
   ↓
4. Inicia compilación automática:
   - Windows: windows-latest (Windows Server)
   - Mac: macos-latest (macOS)
   ↓
5. Compila todo:
   - Instala Node.js
   - Instala dependencias
   - Compila módulos nativos
   - Compila frontend
   - Crea instalador
   ↓
6. Sube el instalador como "Artifact"
   ↓
7. Recibes notificación
   ↓
8. Descargas el instalador listo
```

**Todo esto en 5-10 minutos, automáticamente.** 🎉

---

## 📥 **Cómo Descargar los Instaladores**

### **Paso 1: Hacer Push**
```bash
# En tu Mac
git add .
git commit -m "Cambios nuevos"
git push
```

### **Paso 2: Ver el Progreso**
```
1. Ve a: https://github.com/krodas7/nuevogym
2. Clic en: "Actions" (en la barra superior)
3. Verás: "🏗️ Build Windows Installer" - En progreso...
4. Espera 5-10 minutos
```

### **Paso 3: Descargar Instalador**
```
1. Cuando termine (✅ verde)
2. Clic en el workflow completado
3. Scroll hasta abajo
4. Sección "Artifacts"
5. Descargar: "NuevoGym-Windows-Installer.zip"
```

### **Paso 4: Usar**
```
1. Extrae el .zip
2. Dentro está: NuevoGym Setup 1.0.0.exe
3. Cópialo a USB
4. Llévalo a la PC del gimnasio
5. Instala
6. ¡Listo!
```

---

## 🎨 **Workflows Configurados**

### **1. Build Windows Installer**
- **Archivo:** `.github/workflows/build-windows.yml`
- **Se ejecuta:** Cada push a `main`
- **Resultado:** `NuevoGym Setup 1.0.0.exe`
- **Tiempo:** ~5-7 minutos
- **Tamaño:** ~80-100 MB

### **2. Build Mac Installer**
- **Archivo:** `.github/workflows/build-mac.yml`
- **Se ejecuta:** Cada push a `main`
- **Resultado:** `NuevoGym-1.0.0.dmg`
- **Tiempo:** ~6-8 minutos
- **Tamaño:** ~90-110 MB

---

## 🔍 **Ver Estado de Compilación**

### **En GitHub:**
```
1. https://github.com/krodas7/nuevogym/actions
2. Verás lista de workflows
3. Estados posibles:
   🟡 En progreso...
   ✅ Completado exitosamente
   ❌ Falló (ver logs)
```

### **En el README:**
```markdown
[![Build Windows](https://github.com/krodas7/nuevogym/actions/workflows/build-windows.yml/badge.svg)](https://github.com/krodas7/nuevogym/actions)
```

---

## 📋 **Qué Hace Cada Workflow**

### **Windows Workflow:**
```yaml
1. Checkout code ← Descarga tu código
2. Setup Node.js ← Instala Node.js 20
3. Install dependencies ← npm install
4. Rebuild native modules ← Compila better-sqlite3
5. Build frontend ← Compila React
6. Build Windows installer ← Crea .exe
7. Upload artifact ← Sube instalador
```

### **Mac Workflow:**
```yaml
Similar, pero para Mac (crea .dmg)
```

---

## 🎯 **Casos de Uso**

### **Desarrollo Normal:**
```
1. Haces cambios en Mac
2. git push
3. GitHub compila automáticamente
4. Descargas instalador Windows
5. Pruebas en PC del gimnasio
```

### **Actualización del Sistema:**
```
1. Corriges un bug
2. git push
3. Esperas 5 minutos
4. Descargas nuevo instalador
5. Actualizas en gimnasio
```

### **Release / Versión:**
```
1. Creas un tag: git tag v1.1.0
2. git push --tags
3. GitHub compila
4. Creas Release en GitHub
5. Adjuntas los instaladores
6. Distribuyes
```

---

## ⚙️ **Configuración Adicional (Opcional)**

### **Solo Compilar en Tags (Releases):**

Si quieres que compile SOLO cuando hagas una versión:

```yaml
on:
  push:
    tags:
      - 'v*'
```

Luego:
```bash
git tag v1.0.1
git push --tags
```

### **Compilar Manualmente:**

Puedes ejecutar la compilación manualmente:
```
1. Ve a: Actions
2. Selecciona: Build Windows Installer
3. Clic en: "Run workflow"
4. Espera resultados
```

---

## 🎉 **Ventajas de Esta Solución**

| Ventaja | Descripción |
|---------|-------------|
| 🚀 **Automático** | Se ejecuta solo con cada push |
| 🆓 **Gratis** | GitHub Actions es gratis para repos públicos |
| 💻 **Multi-plataforma** | Windows y Mac simultáneamente |
| ⚡ **Rápido** | 5-10 minutos de compilación |
| ✅ **Confiable** | Usa servidores oficiales de GitHub |
| 📦 **Optimizado** | Compilación en ambiente limpio |
| 🔐 **Seguro** | No expone credenciales |
| 📊 **Historial** | Puedes descargar versiones anteriores |

---

## 📝 **Límites de GitHub Actions (Gratis)**

```
Minutos mensuales: 2,000 minutos
Almacenamiento: 500 MB

Compilación típica:
- Windows: 7 minutos
- Mac: 8 minutos
- Total por push: 15 minutos

Puedes hacer: ~130 compilaciones/mes
```

**Más que suficiente para tu proyecto.** ✅

---

## 🚀 **Próximos Pasos**

Voy a:
1. ✅ Subir los workflows a GitHub
2. ✅ Hacer push
3. ✅ GitHub empezará a compilar automáticamente
4. ✅ En 5-10 minutos tendrás el instalador listo para descargar

**¿Procedo?** 🎯
