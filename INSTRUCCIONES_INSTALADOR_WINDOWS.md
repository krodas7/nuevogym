# 🪟 Instrucciones para Crear Instalador Windows

## 📋 **Prerrequisitos en Windows:**

### **1. Instalar Node.js:**
- Descargar desde: https://nodejs.org/
- Versión recomendada: Node.js 18.x o superior
- Verificar instalación: `node --version` y `npm --version`

### **2. Instalar Git (opcional pero recomendado):**
- Descargar desde: https://git-scm.com/download/win

## 🚀 **Pasos para Crear el Instalador:**

### **Paso 1: Copiar el Proyecto**
```bash
# Copiar toda la carpeta nuevogym a Windows
# Ubicación recomendada: C:\nuevogym
```

### **Paso 2: Abrir Terminal en Windows**
- Presionar `Win + R`
- Escribir `cmd` y presionar Enter
- O usar PowerShell (recomendado)

### **Paso 3: Navegar al Proyecto**
```cmd
cd C:\nuevogym
```

### **Paso 4: Instalar Dependencias**
```cmd
npm install
```

### **Paso 5: Recompilar Módulos Nativos**
```cmd
npm run rebuild
```

### **Paso 6: Crear el Instalador**
```cmd
npm run build:win
```

## 📦 **Resultado:**
- **Archivo generado:** `dist-electron\NuevoGym-Setup-1.0.0.exe`
- **Ubicación:** `C:\nuevogym\dist-electron\`

## 🎯 **Características del Instalador:**
- ✅ Instalación automática en Windows
- ✅ Creación de acceso directo en escritorio
- ✅ Entrada en menú inicio
- ✅ Desinstalador automático
- ✅ Base de datos incluida
- ✅ Configuración del sensor de huellas

## 🔧 **Configuración Post-Instalación:**

### **1. Configurar Sensor de Huellas:**
- Abrir la aplicación instalada
- Ir a **Configuración**
- Configurar **IP del Sensor** (ej: 192.168.0.5)
- Configurar **Puerto COM** para Arduino

### **2. Configurar Usuario Admin:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- Cambiar contraseña desde Configuración

## 📁 **Archivos del Instalador:**
```
dist-electron/
├── NuevoGym-Setup-1.0.0.exe    # Instalador principal
├── win-unpacked/               # Archivos descomprimidos
└── builder-effective-config.yaml # Configuración usada
```

## ⚠️ **Notas Importantes:**
- El instalador es de **~150-200 MB**
- Requiere **Windows 10/11**
- Necesita permisos de administrador para instalar
- Incluye todas las dependencias necesarias

## 🆘 **Solución de Problemas:**

### **Error: "No se puede encontrar el módulo"**
```cmd
npm run rebuild
```

### **Error: "Puerto en uso"**
- Cerrar todas las aplicaciones Node.js
- Reiniciar Windows si es necesario

### **Error: "Permisos insuficientes"**
- Ejecutar CMD como Administrador
- O usar PowerShell como Administrador

## 📞 **Soporte:**
Si tienes problemas, revisa:
1. Versión de Node.js (debe ser 18+)
2. Permisos de administrador
3. Antivirus bloqueando la instalación
4. Espacio en disco (mínimo 500 MB)
