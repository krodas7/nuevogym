# 🪟 NuevoGym - Instalador para Windows

## 📦 **Instaladores Disponibles:**

### **1. Instalador NSIS (Recomendado):**
- **Archivo:** `NuevoGym - Sistema de Gestión de Gimnasio-Setup-1.0.0.exe`
- **Características:**
  - ✅ Instalación profesional con wizard
  - ✅ Acceso directo en escritorio
  - ✅ Entrada en menú inicio
  - ✅ Desinstalador automático
  - ✅ Selección de directorio de instalación

### **2. Aplicación Portable:**
- **Archivo:** `NuevoGym - Sistema de Gestión de Gimnasio-1.0.0-Portable.exe`
- **Características:**
  - ✅ No requiere instalación
  - ✅ Ejecutable directo
  - ✅ Portable (se puede copiar a USB)
  - ⚠️ Más lento al iniciar

## 🚀 **Cómo Crear los Instaladores:**

### **Método 1: Script Automático (Recomendado)**
```cmd
# Doble clic en:
crear-instalador-windows.bat
```

### **Método 2: Comandos Manuales**
```cmd
# 1. Instalar dependencias
npm install

# 2. Recompilar módulos nativos
npm run rebuild

# 3. Crear instalador
npm run build:win
```

## 📁 **Estructura de Archivos Generados:**
```
dist-electron/
├── NuevoGym - Sistema de Gestión de Gimnasio-Setup-1.0.0.exe
├── NuevoGym - Sistema de Gestión de Gimnasio-1.0.0-Portable.exe
├── win-unpacked/
│   ├── NuevoGym - Sistema de Gestión de Gimnasio.exe
│   ├── resources/
│   ├── locales/
│   └── ...
└── builder-effective-config.yaml
```

## 🔧 **Configuración Post-Instalación:**

### **1. Primer Inicio:**
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- ⚠️ **Cambiar contraseña inmediatamente**

### **2. Configurar Sensor de Huellas:**
1. Ir a **Configuración**
2. Sección **"Sensor de Huellas"**
3. Configurar **IP del Sensor** (ej: 192.168.0.5)
4. Configurar **Puerto COM** para Arduino

### **3. Configurar Chapa Eléctrica:**
1. Ir a **Configuración**
2. Sección **"Chapa Eléctrica"**
3. Seleccionar **Puerto COM**
4. Configurar **Velocidad (Baud Rate)**
5. Configurar **Tiempo de apertura**

## 📋 **Requisitos del Sistema:**
- **OS:** Windows 10/11 (64-bit)
- **RAM:** Mínimo 4GB
- **Espacio:** 200MB libres
- **Permisos:** Administrador (solo para instalar)

## 🌐 **Configuración de Red:**
- **Puerto 9000:** Webhook del sensor de huellas
- **Puerto 4000:** Solo para desarrollo
- **Firewall:** Permitir conexiones entrantes en puerto 9000

## 📊 **Módulos Incluidos:**
- ✅ **Dashboard** - Estadísticas del gimnasio
- ✅ **Clientes** - Registro y gestión
- ✅ **Asistencias** - Control de entrada/salida
- ✅ **Tipos de Membresía** - Gestión de planes
- ✅ **Renovar Membresías** - Procesos de pago
- ✅ **Reportes** - Generación de informes
- ✅ **Usuarios** - Gestión de usuarios
- ✅ **Configuración** - Configuración del sistema

## 🔐 **Seguridad:**
- Base de datos SQLite local
- Contraseñas encriptadas con bcrypt
- Logs de auditoría
- Respaldo automático de base de datos

## 📞 **Soporte Técnico:**

### **Problemas Comunes:**
1. **"Puerto 9000 en uso"**
   - Cerrar otras aplicaciones
   - Reiniciar Windows

2. **"Error de conexión al sensor"**
   - Verificar IP del sensor
   - Verificar firewall
   - Verificar red local

3. **"Base de datos corrupta"**
   - Usar función de respaldo
   - Restaurar desde respaldo

### **Logs del Sistema:**
- **Ubicación:** `%APPDATA%/nuevogym/logs/`
- **Archivo:** `app.log`

## 🎯 **Distribución:**
- El instalador es **autocontenido**
- No requiere instalación de Node.js
- Incluye todas las dependencias
- Tamaño: ~150-200 MB

## 📈 **Próximas Versiones:**
- Actualizaciones automáticas
- Mejoras en la interfaz
- Nuevos tipos de reportes
- Integración con sistemas de pago
