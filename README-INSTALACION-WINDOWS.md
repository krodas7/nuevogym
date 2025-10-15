# 🪟 Guía de Instalación para Windows

## 🚨 PROBLEMA: Los archivos .bat se cierran inmediatamente

Si tienes **Node.js, Git y Build Tools instalados** pero los scripts `.bat` se cierran, sigue estas opciones:

---

## ✅ OPCIÓN 1: Ejecutar con Log (RECOMENDADO)

Este script guarda TODO en un archivo para que veamos qué falla:

```batch
# Ejecutar como ADMINISTRADOR
INSTALAR-CON-LOG.bat
```

**Resultado:**
- Se creará un archivo `instalacion-log.txt`
- Si falla, abre ese archivo
- Copia TODO el contenido y envíalo

---

## ✅ OPCIÓN 2: Ejecutar Manualmente (MÁS SEGURO)

Este script abre una ventana CMD donde ejecutas comandos tú mismo:

```batch
# Ejecutar
EJECUTAR-MANUAL.bat
```

**Luego ejecuta en orden:**
```cmd
1. node --version
2. npm --version
3. npm install --legacy-peer-deps
4. npm run build
5. npm start
```

---

## ✅ OPCIÓN 3: CMD Tradicional

Abre **CMD como administrador** manualmente:

```cmd
# 1. Abrir CMD como administrador
# Win + X → "Terminal (Admin)"

# 2. Ir al directorio del proyecto
cd "C:\ruta\a\tu\proyecto"

# 3. Verificar que estás en el lugar correcto
dir package.json

# 4. Instalar
npm install --legacy-peer-deps

# 5. Construir
npm run build

# 6. Iniciar
npm start
```

---

## ✅ OPCIÓN 4: PowerShell

Si CMD no funciona, usa PowerShell:

```powershell
# 1. Abrir PowerShell como administrador
# Win + X → "Windows PowerShell (Admin)"

# 2. Ir al directorio
cd "C:\ruta\a\tu\proyecto"

# 3. Instalar
npm install --legacy-peer-deps

# 4. Construir
npm run build

# 5. Iniciar
npm start
```

---

## 🔍 DIAGNÓSTICO: ¿Por qué se cierran los .bat?

Posibles causas:

### 1. **Windows está configurado para cerrar ventanas CMD automáticamente**
- **Solución:** Usar `EJECUTAR-MANUAL.bat` que deja la ventana abierta

### 2. **OneDrive/Dropbox sincronizando node_modules**
- **Solución:** Excluir la carpeta del proyecto de la sincronización

### 3. **Permisos de carpeta**
- **Solución:** Mover el proyecto a `C:\proyectos\nuevogym`

### 4. **Path muy largo (Windows tiene límite de 260 caracteres)**
- **Solución:** Mover a `C:\gym\` o similar

### 5. **Codificación de archivos .bat**
- **Solución:** Usar `EJECUTAR-MANUAL.bat` o CMD directo

---

## 📋 INFORMACIÓN NECESARIA PARA AYUDARTE

Si ninguna opción funciona, necesito saber:

1. **¿En qué ruta está el proyecto?**
   ```
   Ejemplo: C:\Users\kevin\OneDrive\Escritorio\nuevogym
   ```

2. **¿Qué pasa cuando ejecutas esto en CMD?**
   ```cmd
   cd "C:\ruta\a\tu\proyecto"
   npm install --legacy-peer-deps
   ```

3. **¿Aparece algún error? ¿Cuál?**

---

## 🎯 RESUMEN RÁPIDO

**Si tienes Node, Git y Build Tools:**

```batch
# Opción más simple:
EJECUTAR-MANUAL.bat
```

Luego en la ventana que se abre:
```cmd
npm install --legacy-peer-deps
npm run build
npm start
```

**¿Eso funciona?** ✅

