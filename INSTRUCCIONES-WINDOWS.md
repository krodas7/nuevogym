# 🚀 NuevoGym - Instrucciones para Windows

## 📋 **REQUISITOS PREVIOS**

1. **Node.js LTS** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Instala con las opciones por defecto
   - Reinicia tu PC después de instalar

---

## 🔧 **INSTALACIÓN EN WINDOWS**

### **Opción 1: Instalación Automática (Recomendada)**

```cmd
1. Clona el repositorio:
   git clone https://github.com/krodas7/nuevogym.git
   cd nuevogym

2. Ejecuta el instalador:
   Doble clic en: INSTALAR-SIMPLE.bat
   
3. Espera a que termine (2-3 minutos)
```

### **Opción 2: Instalación Manual**

```cmd
1. Clona el repositorio:
   git clone https://github.com/krodas7/nuevogym.git
   cd nuevogym

2. Instala dependencias:
   npm install --legacy-peer-deps

3. Construye el frontend:
   npm run build
```

---

## ▶️ **CÓMO USAR**

### **Opción 1: Con el script (Recomendada)**
```cmd
Doble clic en: INICIAR.bat
```

### **Opción 2: Manual**
```cmd
node server.js
```

Luego abre tu navegador en: **http://localhost:4000**

---

## 🔐 **CREDENCIALES INICIALES**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
nuevogym/
├── server.js              ← Servidor Express (backend)
├── package.json           ← Dependencias del proyecto
├── vite.config.js         ← Configuración de Vite
├── INSTALAR-SIMPLE.bat    ← Instalador automático
├── INSTALAR.bat           ← Instalador completo
├── INICIAR.bat            ← Iniciador rápido
├── src/                   ← Código fuente React (frontend)
├── public/                ← Archivos públicos
└── dist/                  ← Frontend compilado (se genera)
```

---

## ⚠️ **SOLUCIÓN DE PROBLEMAS**

### **Error: "Node.js no está instalado"**
- Instala Node.js desde: https://nodejs.org/
- Reinicia tu PC
- Verifica con: `node --version`

### **Error: "npm no reconocido"**
- Reinicia tu PC después de instalar Node.js
- Verifica que Node.js esté en el PATH

### **Error: "Puerto 4000 ya está en uso"**
- Cierra cualquier aplicación que use el puerto 4000
- O cambia el puerto en `server.js` (línea 8)

### **Error al instalar dependencias**
- Ejecuta como administrador
- Desactiva temporalmente el antivirus
- Verifica tu conexión a internet

---

## 🔄 **ACTUALIZAR EL PROYECTO**

```cmd
git pull origin main
npm install --legacy-peer-deps
npm run build
```

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa este archivo
2. Revisa `README.md` para más detalles
3. Verifica que Node.js esté instalado correctamente

---

## ✅ **VERIFICACIÓN RÁPIDA**

Después de instalar, verifica que existan estos archivos:
- ✅ `node_modules/` (carpeta con dependencias)
- ✅ `dist/` (carpeta con frontend compilado)
- ✅ `server.js` (servidor backend)
- ✅ `INICIAR.bat` (script de inicio)

---

## 🎯 **INICIO RÁPIDO (RESUMEN)**

```cmd
# 1. Clonar
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Instalar (doble clic)
INSTALAR-SIMPLE.bat

# 3. Usar (doble clic)
INICIAR.bat

# 4. Abrir navegador
http://localhost:4000
```

**¡Listo! 🎉**

