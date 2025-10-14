# 🏋️ NuevoGym - Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios con control de asistencias, membresías, pagos, reportes y soporte para sensor de huellas digitales.

---

## 🎯 **DOS VERSIONES DISPONIBLES**

NuevoGym ofrece **DOS formas de uso**:

### **1️⃣ Versión Electron (Aplicación de Escritorio)**
- 🖥️ Aplicación nativa de escritorio
- ✅ Ventana propia
- ✅ Icono en el dock/taskbar
- ⚠️ Requiere compilación de módulos nativos

### **2️⃣ Versión Web App (Navegador)**
- 🌐 Se ejecuta en el navegador
- ✅ Sin compilación compleja
- ✅ Más fácil de instalar
- ✅ Misma funcionalidad

---

## 🚀 **INSTALACIÓN RÁPIDA**

### **Ubuntu/Linux:**

#### **Opción A - Electron (Recomendada si funciona):**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
chmod +x instalar-ubuntu.sh
./instalar-ubuntu.sh
npm start
```

#### **Opción B - Web App (Si Electron falla):**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
chmod +x instalar-ubuntu-simple.sh
./instalar-ubuntu-simple.sh
node server.js
# Abre: http://localhost:4000
```

### **Windows:**

#### **Opción A - Electron:**
```cmd
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
INSTALAR.bat
INICIAR.bat
```

#### **Opción B - Web App (Si Electron falla):**
```cmd
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
INSTALAR-SIMPLE.bat
node server.js
REM Abre: http://localhost:4000
```

### **Mac:**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
npm install --legacy-peer-deps
npm run build
npm start  # Electron
# O: node server.js  # Web App
```

---

## 📋 **CREDENCIALES POR DEFECTO**

- **Usuario:** `admin`
- **Contraseña:** `admin123`

---

## 🔧 **CARACTERÍSTICAS**

### **Módulos Principales:**
- ✅ **Dashboard** - Estadísticas y resumen general
- ✅ **Clientes** - Gestión completa de clientes
- ✅ **Membresías** - Tipos y gestión de membresías
- ✅ **Pagos** - Registro y control de pagos
- ✅ **Asistencias** - Control de asistencias diarias
- ✅ **Reportes** - Reportes detallados y tickets
- ✅ **Usuarios** - Gestión de usuarios del sistema
- ✅ **Configuración** - Ajustes del sistema

### **Funcionalidades Especiales:**
- 🔐 **Sistema de permisos** - Roles Admin y Usuario
- 📊 **Reportes mensuales** - Tickets y cuadres contables
- 🔄 **Backup/Restore** - Respaldo de base de datos
- 📱 **Sensor de huellas** - Integración con api.exe
- 🔌 **Arduino** - Control de acceso por puerto serial
- 🎨 **Tema claro/oscuro** - Interfaz personalizable

---

## 📊 **COMPARACIÓN DE VERSIONES**

| Característica | Electron | Web App |
|----------------|----------|---------|
| **Instalación** | Compleja | Simple |
| **Ventana propia** | ✅ | ❌ (navegador) |
| **Icono escritorio** | ✅ | ❌ |
| **Compilación** | Requiere C++ | No |
| **Tamaño** | ~200MB | ~5MB |
| **Funcionalidad** | 100% | 100% |
| **Actualización** | Reinstalar | git pull |
| **Problemas Windows** | A veces | No |

---

## 🛠️ **COMANDOS ÚTILES**

### **Electron:**
```bash
npm start              # Iniciar en modo desarrollo
npm run build          # Compilar frontend
npm run build:win      # Crear instalador Windows
npm run build:mac      # Crear instalador Mac
npm run rebuild        # Recompilar módulos nativos
```

### **Web App:**
```bash
node server.js         # Iniciar servidor
npm run start:web      # Alias para node server.js
```

### **Desarrollo:**
```bash
npm run start:react    # Solo frontend (desarrollo)
npm test               # Ejecutar tests Playwright
npm run test:ui        # Tests con interfaz
```

---

## 🐛 **SOLUCIÓN DE PROBLEMAS**

### **Electron no compila en Windows:**
**Solución:** Usa la versión Web App
```cmd
node server.js
```

### **Error: "better-sqlite3" no compila:**
**Solución 1:** Instalar herramientas de compilación
```bash
# Windows
npm install --global windows-build-tools

# Ubuntu
sudo apt install build-essential python3
```

**Solución 2:** Usar Web App (usa sqlite3 puro)

### **Puerto 4000 en uso:**
```bash
# Ver qué usa el puerto
lsof -i :4000  # Mac/Linux
netstat -ano | findstr :4000  # Windows

# Matar proceso
kill -9 PID  # Mac/Linux
taskkill /PID PID /F  # Windows
```

---

## 📁 **ESTRUCTURA DEL PROYECTO**

```
nuevogym/
├── electron/              ← Código Electron (main, preload)
├── src/                   ← Frontend React
│   ├── pages/            ← Páginas de la aplicación
│   ├── components/       ← Componentes reutilizables
│   ├── utils/            ← Utilidades
│   └── App.jsx           ← Componente principal
├── public/                ← Archivos públicos
├── server.js              ← Servidor Web App (alternativo)
├── package.json           ← Dependencias y scripts
├── vite.config.js         ← Configuración Vite
├── INSTALAR.bat           ← Instalador Windows
├── INICIAR.bat            ← Iniciador Windows
├── instalar-ubuntu.sh     ← Instalador Ubuntu
└── README.md              ← Este archivo
```

---

## 🔐 **SEGURIDAD**

- Contraseñas hasheadas con bcrypt
- Validación de sesiones
- Sistema de permisos por rol
- Base de datos local (no expuesta)

---

## 🌐 **INTEGRACIÓN CON HARDWARE**

### **Sensor de Huellas (api.exe):**
1. Configura la URL del webhook en api.exe
2. Apunta a: `http://TU_IP:9000/webhook`
3. El sistema detectará automáticamente las huellas

### **Arduino (Control de Acceso):**
1. Conecta Arduino por USB
2. Ve a Configuración → Arduino
3. Selecciona el puerto COM
4. Prueba la conexión

---

## 📞 **SOPORTE**

### **Documentación:**
- `README.md` - Este archivo
- `INSTRUCCIONES-UBUNTU.md` - Guía Ubuntu
- `INSTRUCCIONES-WINDOWS.md` - Guía Windows

### **Problemas Comunes:**
1. Electron no compila → Usa Web App
2. Puerto ocupado → Cambia puerto en código
3. Base de datos → Está en `~/.nuevogym/` o `%APPDATA%\NuevoGym\`

---

## 🔄 **ACTUALIZAR**

```bash
git pull origin main
npm install --legacy-peer-deps
npm run build
```

---

## 📝 **LICENCIA**

MIT License - Libre para uso personal y comercial

---

## 🎉 **INICIO RÁPIDO (RESUMEN)**

### **Si tienes Mac o Ubuntu (y Electron funciona):**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
npm install --legacy-peer-deps
npm run build
npm start
```

### **Si tienes Windows (o Electron falla):**
```bash
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym
npm install --legacy-peer-deps
npm run build
node server.js
# Abre: http://localhost:4000
```

---

**¡Disfruta de NuevoGym!** 🏋️‍♂️💪

