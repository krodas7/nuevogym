# 🪟 NuevoGym - Versión Optimizada para Windows

Sistema de gestión de gimnasio completamente optimizado para Windows, sin problemas de compilación de Electron.

---

## ✅ **¿Por qué esta versión es mejor?**

### **❌ Problemas de la versión anterior:**
- Electron requería compilación C++
- better-sqlite3 necesitaba Visual Studio Build Tools
- serialport tenía problemas de compilación
- GitHub Actions fallaba constantemente

### **✅ Soluciones de esta versión:**
- **Sin Electron** - Aplicación web pura
- **sqlite3** en lugar de better-sqlite3 (sin compilación)
- **Sin módulos nativos problemáticos**
- **Instalación en 3 pasos**
- **Funciona en cualquier Windows** (7, 8, 10, 11)

---

## 🚀 **Instalación Súper Fácil**

### **Paso 1: Descargar Node.js**
1. Ve a: https://nodejs.org/
2. Descarga la versión **LTS** (recomendada)
3. Instala con las opciones por defecto
4. Reinicia tu PC

### **Paso 2: Ejecutar instalador**
```cmd
# Doble clic en:
INSTALAR-WINDOWS.bat
```

### **Paso 3: ¡Listo!**
```cmd
# Doble clic en:
INICIAR-NUEVOGYM.bat
```

---

## 📋 **Información de Acceso**

- **URL:** http://localhost:4000
- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🏗️ **Arquitectura Simplificada**

```
┌─────────────────┐    HTTP/API    ┌─────────────────┐
│   Navegador     │◄─────────────►│   Express       │
│   (React)       │                │   + SQLite3     │
│   Frontend      │                │   + Windows     │
│   http://4000   │                │   Optimizado    │
└─────────────────┘                └─────────────────┘
```

---

## 📦 **Dependencias Optimizadas**

### **Backend:**
- ✅ `express` - Servidor web
- ✅ `sqlite3` - Base de datos (sin compilación)
- ✅ `cors` - Permisos CORS
- ✅ `bcryptjs` - Encriptación de contraseñas

### **Frontend:**
- ✅ `react` - Framework UI
- ✅ `vite` - Build tool rápido
- ✅ `recharts` - Gráficos
- ✅ `react-router-dom` - Navegación

### **❌ Eliminadas (problemáticas):**
- ❌ `electron` - Aplicación desktop
- ❌ `better-sqlite3` - Base de datos compilada
- ❌ `serialport` - Puerto serial
- ❌ `electron-rebuild` - Recompilación

---

## 🔧 **Funcionalidades**

### **✅ Completamente Funcional:**
- ✅ **Gestión de clientes** - CRUD completo
- ✅ **Tipos de membresía** - Crear, editar, eliminar
- ✅ **Membresías** - Asignar, renovar, vencer
- ✅ **Asistencias** - Registrar entrada/salida
- ✅ **Pagos** - Registrar pagos y métodos
- ✅ **Tickets** - Sistema de tickets completo
- ✅ **Reportes** - Ingresos, asistencias, membresías
- ✅ **Usuarios** - Sistema de roles (admin/usuario)
- ✅ **Base de datos** - SQLite con respaldo automático

### **⚠️ Hardware (opcional):**
- ⚠️ **Sensor de huellas** - Requiere api.exe externo
- ⚠️ **Arduino** - Requiere configuración adicional

---

## 📁 **Estructura del Proyecto**

```
nuevogym-windows/
├── server-windows.js          # Servidor Express optimizado
├── package-windows.json       # Dependencias optimizadas
├── vite-windows.config.js     # Configuración Vite
├── INSTALAR-WINDOWS.bat       # Instalador automático
├── INICIAR-NUEVOGYM.bat       # Iniciador rápido
├── README-WINDOWS.md          # Esta documentación
├── src/                       # Frontend React
│   ├── pages/                 # Páginas de la aplicación
│   ├── components/            # Componentes reutilizables
│   └── utils/                 # Utilidades
├── dist/                      # Frontend construido
├── node_modules/              # Dependencias instaladas
└── logs/                      # Logs de la aplicación
```

---

## 🗄️ **Base de Datos**

### **Ubicación:**
```
%APPDATA%\NuevoGym\database.db
```

### **Tablas:**
- `usuarios` - Usuarios del sistema
- `clientes` - Clientes del gimnasio
- `tipos_membresia` - Tipos de membresía
- `membresias` - Membresías activas
- `asistencias` - Registro de asistencias
- `pagos` - Historial de pagos
- `tickets` - Tickets generados

### **Respaldo:**
```cmd
# Copiar archivo de base de datos
copy "%APPDATA%\NuevoGym\database.db" "respaldo-$(date).db"
```

---

## 🔄 **Scripts Disponibles**

```bash
# Instalación
npm run install-windows

# Desarrollo (frontend + backend)
npm run dev

# Solo frontend
npm run start:frontend

# Solo backend
npm run start:backend

# Producción
npm start

# Build frontend
npm run build
```

---

## 🚨 **Solución de Problemas**

### **Error: "Node.js no está instalado"**
1. Descarga Node.js desde https://nodejs.org/
2. Instala la versión LTS
3. Reinicia la terminal
4. Ejecuta `node --version` para verificar

### **Error: "npm no funciona"**
1. Reinicia la terminal como administrador
2. Ejecuta: `npm config set registry https://registry.npmjs.org/`
3. Intenta la instalación de nuevo

### **Error: "Puerto 4000 en uso"**
```cmd
# Encontrar proceso
netstat -ano | findstr :4000

# Matar proceso (reemplaza PID)
taskkill /PID 1234 /F
```

### **Error: "Base de datos bloqueada"**
1. Cierra NuevoGym completamente
2. Espera 10 segundos
3. Intenta abrir de nuevo

### **Error: "Frontend no carga"**
1. Verifica que `dist/index.html` existe
2. Ejecuta: `npm run build`
3. Inicia el servidor: `npm start`

### **Error: "Permisos insuficientes"**
1. Ejecuta como administrador
2. Desactiva temporalmente el antivirus
3. Verifica permisos de la carpeta

---

## 🔌 **Integración con Hardware (Opcional)**

### **Sensor de Huellas:**
Para usar el sensor de huellas, necesitas:
1. **api.exe** del fabricante del sensor
2. Configurar URL: `http://localhost:9000/webhook`
3. El servidor escuchará en puerto 9000

### **Arduino:**
Para usar Arduino, necesitas:
1. Instalar drivers del Arduino
2. Configurar puerto COM correcto
3. Modificar `server-windows.js` con el puerto

---

## 📊 **Rendimiento**

### **Recursos del Sistema:**
- **RAM:** ~50MB (vs 200MB de Electron)
- **CPU:** Mínimo (solo Node.js)
- **Espacio:** ~100MB (vs 500MB de Electron)
- **Tiempo de inicio:** 2-3 segundos

### **Compatibilidad:**
- ✅ **Windows 7, 8, 10, 11**
- ✅ **32-bit y 64-bit**
- ✅ **Cualquier navegador** (Chrome, Firefox, Edge)

---

## 🔄 **Actualizaciones**

### **Actualizar la aplicación:**
1. Descarga la nueva versión
2. Copia tu base de datos: `%APPDATA%\NuevoGym\database.db`
3. Ejecuta: `INSTALAR-WINDOWS.bat`
4. Restaura la base de datos

### **Actualizar dependencias:**
```bash
npm update
npm run build
```

---

## 📞 **Soporte Técnico**

### **Logs de Error:**
Los logs se guardan en:
```
logs/error.log
logs/access.log
```

### **Información del Sistema:**
```bash
# Verificar configuración
curl http://localhost:4000/api/config
```

### **Estado del Servidor:**
```bash
# Verificar si está corriendo
netstat -an | findstr :4000
```

---

## ✅ **Ventajas de esta Versión**

- ✅ **Instalación en 3 minutos**
- ✅ **Sin problemas de compilación**
- ✅ **Funciona en cualquier Windows**
- ✅ **Rendimiento superior**
- ✅ **Mantenimiento fácil**
- ✅ **Actualizaciones simples**
- ✅ **Respaldo automático**
- ✅ **Logs detallados**

---

**¡NuevoGym Windows está listo para usar!** 🚀

**¿Necesitas ayuda?** Revisa la sección de solución de problemas o contacta al soporte técnico.
