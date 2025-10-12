# 🤖 Cómo Activar GitHub Actions (Compilación Automática)

## ⚠️ **Necesitas Subir los Workflows Manualmente**

GitHub requiere permisos especiales de `workflow` para crear archivos en `.github/workflows/`.

---

## 📝 **Método 1: Desde GitHub Web (MÁS FÁCIL)**

### **Paso 1: Ir a tu Repositorio**
```
https://github.com/krodas7/nuevogym
```

### **Paso 2: Crear el Archivo para Windows**
```
1. Clic en: "Add file" → "Create new file"
2. Nombre del archivo: .github/workflows/build-windows.yml
3. Copiar el contenido de: .github/workflows/build-windows.yml (del proyecto local)
4. Scroll abajo
5. Commit message: "Add Windows build workflow"
6. Clic en: "Commit new file"
```

### **Paso 3: Crear el Archivo para Mac**
```
1. Clic en: "Add file" → "Create new file"
2. Nombre del archivo: .github/workflows/build-mac.yml
3. Copiar el contenido de: .github/workflows/build-mac.yml (del proyecto local)
4. Scroll abajo
5. Commit message: "Add Mac build workflow"
6. Clic en: "Commit new file"
```

### **Paso 4: Ver la Compilación**
```
1. Ve a: https://github.com/krodas7/nuevogym/actions
2. Verás que empezó automáticamente
3. Espera 5-10 minutos
4. Cuando termine (✅), descarga el instalador
```

---

## 📝 **Método 2: Usar Git con Token Personal**

### **Paso 1: Crear Token en GitHub**
```
1. Ve a: https://github.com/settings/tokens
2. Clic en: "Generate new token" → "Generate new token (classic)"
3. Nombre: "nuevogym-workflows"
4. Selecciona: ✅ workflow
5. Selecciona: ✅ repo
6. Clic en: "Generate token"
7. COPIA el token (solo se muestra una vez)
```

### **Paso 2: Configurar Git Local**
```bash
cd /Users/krodas7/Desktop/nuevogym

# Cambiar remote para usar token
git remote set-url origin https://[TU-TOKEN]@github.com/krodas7/nuevogym.git

# Hacer push
git push
```

Reemplaza `[TU-TOKEN]` con el token que copiaste.

---

## 🎯 **Método 3: Subir Archivos Manualmente (GitHub Desktop)**

Si usas GitHub Desktop:

```
1. Abre GitHub Desktop
2. Selecciona repositorio: nuevogym
3. Verás los cambios en .github/workflows/
4. Commit: "Add GitHub Actions workflows"
5. Push origin
```

---

## 📊 **Contenido de los Archivos**

Los archivos ya están creados en tu proyecto local:

### **`.github/workflows/build-windows.yml`** ✅
Compila instalador para Windows.

### **`.github/workflows/build-mac.yml`** ✅
Compila instalador para Mac.

### **`GITHUB-ACTIONS-GUIA.md`** ✅
Esta guía.

---

## 🚀 **Después de Activar**

### **Cada vez que hagas `git push`:**

```
GitHub automáticamente:
1. ✅ Compila instalador Windows (.exe)
2. ✅ Compila instalador Mac (.dmg)
3. ✅ Los sube como artifacts
4. ✅ Te notifica por email
```

### **Para Descargar:**

```
1. Ve a: https://github.com/krodas7/nuevogym/actions
2. Clic en el workflow completado (✅ verde)
3. Scroll abajo → Artifacts
4. Descargar: NuevoGym-Windows-Installer.zip
5. Extraer y usar el .exe
```

---

## 💡 **Ventajas de Esta Solución**

| Problema Actual | Con GitHub Actions |
|-----------------|-------------------|
| Necesitas Visual Studio en Windows | ❌ → ✅ NO necesario |
| Compilación falla por Python | ❌ → ✅ GitHub tiene todo |
| Tarda mucho compilar | ❌ → ✅ 5-10 min automático |
| OneDrive causa problemas | ❌ → ✅ No afecta |
| Diferentes versiones de Node.js | ❌ → ✅ Siempre Node 20 |

---

## 📝 **Guía Rápida Visual**

### **Sin GitHub Actions (Actual):**
```
Tu Mac → git push → GitHub
                     ↓
                 Solo código

Para Windows:
- Necesitas compilar en PC Windows
- Requiere Visual Studio
- Problemas con Python
- Errores de OneDrive
```

### **Con GitHub Actions (Nuevo):**
```
Tu Mac → git push → GitHub
                     ↓
                 Compila automáticamente
                     ↓
                 Instaladores listos
                     ↓
                 Descargas .exe
                     ↓
                 Instalas en gimnasio
```

---

## ⚡ **ACCIÓN INMEDIATA**

### **Opción A: Subir Manualmente (5 minutos)**

1. Ve a: https://github.com/krodas7/nuevogym
2. Crea los 2 archivos desde la interfaz web (Método 1 de arriba)
3. Espera que compile
4. Descarga instalador

### **Opción B: Token Personal (2 minutos)**

1. Crea token con permiso `workflow`
2. Configura en git
3. Haz push
4. Espera compilación

---

## 🎉 **Resultado Final**

Una vez activado:

```
Tú haces cambios → git push → Esperas 10 min → Descargas .exe → ¡Listo!
```

**SIN:**
- ❌ Visual Studio
- ❌ Python
- ❌ Compilación manual
- ❌ Problemas de OneDrive
- ❌ Errores de node-gyp

**CON:**
- ✅ Instalador profesional
- ✅ 100% funcional
- ✅ Optimizado
- ✅ Automático
- ✅ Gratis

---

## 📞 **¿Qué Método Prefieres?**

1. **Método 1:** Subir archivos desde GitHub web (más fácil)
2. **Método 2:** Token personal (más rápido si sabes git)
3. **Método 3:** Te ayudo a hacerlo de otra forma

**Los archivos YA están creados en tu proyecto local en `.github/workflows/`**

---

**¿Quieres que te guíe paso a paso con el Método 1 (desde GitHub web)?** 🚀

Es el más fácil y en 5 minutos tendrás los instaladores compilándose automáticamente.
