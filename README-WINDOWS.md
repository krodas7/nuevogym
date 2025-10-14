# 🪟 NuevoGym - Instalación Windows

## 📋 Requisitos Previos

### 1. **Node.js** (Requerido)
- Descargar desde: https://nodejs.org/
- Instalar la versión **LTS** (Long Term Support)
- Verificar instalación: `node --version` y `npm --version`

### 2. **Git** (Requerido)
- Descargar desde: https://git-scm.com/
- Instalar con configuración por defecto

### 3. **Visual Studio Build Tools** (Requerido para compilación)
- Descargar desde: https://visualstudio.microsoft.com/downloads/
- Instalar **"Build Tools for Visual Studio 2022"**
- Marcar **"Desktop development with C++"**

## 🚀 Instalación Rápida

### **Opción 1: Instalación Automática**
```batch
# Ejecutar como administrador
INSTALAR-WINDOWS-COMPLETO.bat
```

### **Opción 2: Instalación Manual**
```batch
# 1. Instalar dependencias
npm install --legacy-peer-deps

# 2. Recompilar módulos nativos
npm run rebuild

# 3. Construir frontend
npm run build
```

## 🎯 Formas de Iniciar

### **1. Inicio Normal (Recomendado)**
```batch
INICIAR-WINDOWS-SIMPLE.bat
```

### **2. Con Sensor de Huellas**
```batch
INICIAR-WINDOWS-CON-SENSOR.bat
```
**Requisito:** Tener `api.exe` en el directorio del proyecto

### **3. Comando Directo**
```batch
npm start
```

## 🔧 Configuración del Sensor

### **Para usar el sensor de huellas:**

1. **Copiar api.exe:**
   ```
   Desde: ZKTecoFingerPrintScanner-Implementation-master\api\bin\x86\Release\api.exe
   Hacia: [Directorio del proyecto]\api.exe
   ```

2. **Ejecutar como administrador:**
   - Clic derecho en `INICIAR-WINDOWS-CON-SENSOR.bat`
   - "Ejecutar como administrador"

3. **Verificar conexión:**
   - Webhook: http://localhost:9000/webhook
   - El sensor debe aparecer en el panel de tareas

## 📁 Estructura de Archivos

```
nuevogym/
├── INSTALAR-WINDOWS-COMPLETO.bat     # Instalación completa
├── INICIAR-WINDOWS-SIMPLE.bat        # Inicio sin sensor
├── INICIAR-WINDOWS-CON-SENSOR.bat    # Inicio con sensor
├── COMPILAR-EXE.bat                  # Compilar ejecutable
├── api.exe                           # Sensor de huellas (opcional)
└── README-WINDOWS.md                 # Esta documentación
```

## 🌐 Acceso a la Aplicación

- **Web:** http://localhost:4000
- **Electron:** Ventana de aplicación
- **Webhook Sensor:** http://localhost:9000/webhook

## 👤 Credenciales por Defecto

- **Usuario:** admin
- **Contraseña:** admin123

## 🔨 Compilar Ejecutable

```batch
COMPILAR-EXE.bat
```

El ejecutable se creará en la carpeta `dist/`

## 🐛 Solución de Problemas

### **Error: "npm install" falla**
```batch
# Ejecutar como administrador
npm install --legacy-peer-deps --force
```

### **Error: "npm run rebuild" falla**
```batch
# Verificar Visual Studio Build Tools
# Reinstalar con "Desktop development with C++"
```

### **Error: "api.exe" no funciona**
```batch
# Ejecutar como administrador
# Verificar que no hay antivirus bloqueando
# Verificar puerto 9000 disponible
```

### **Error: Electron no inicia**
```batch
# Reinstalar Electron
npm install electron --save-dev --force
npm run rebuild
```

## 📞 Soporte

Si tienes problemas:

1. **Verificar requisitos** (Node.js, Git, Build Tools)
2. **Ejecutar como administrador**
3. **Desactivar antivirus** temporalmente
4. **Revisar logs** en la consola

## ✅ Verificación de Instalación

```batch
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Git
git --version

# Verificar dependencias
npm list --depth=0

# Verificar compilación
npm run build
```

¡NuevoGym está listo para usar en Windows! 🎉
