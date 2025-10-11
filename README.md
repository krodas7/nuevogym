# 🏋️ NuevoGym - Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios con registro de clientes, control de asistencias, membresías, pagos y reportes. Incluye integración con sensor de huellas y chapa eléctrica (Arduino).

---

## ✨ **Características Principales**

### **👥 Gestión de Clientes**
- Registro completo (nombre, teléfono, foto, huella)
- Tipos de membresía personalizables
- Fechas de inicio y vencimiento automáticas
- Búsqueda y filtrado avanzado
- Historial de pagos

### **📊 Dashboard**
- Ingresos mensuales en tiempo real
- Asistencias diarias
- Total de clientes activos
- Membresías próximas a vencer
- Gráficos interactivos

### **🎫 Sistema de Tickets**
- Tickets de renovación de membresía
- Tickets de nuevo cliente
- Tickets de pagos individuales
- Numeración automática e incremental
- Impresión para impresora térmica (80mm)

### **📈 Reportes Avanzados**
- **Clientes:** Total, activos, vencidos
- **Asistencias:** Por fecha, promedio diario
- **Ingresos:** Total, por método de pago
- **Membresías:** Próximas a vencer
- **Tickets:** Por mes, con cuadre de caja
- Exportación a CSV/Excel
- Impresión optimizada

### **👆 Sensor de Huellas**
- Registro de huellas dactilares
- Verificación automática de asistencias
- Notificaciones en tiempo real
- Integración con api.exe
- Control de accesos

### **🔐 Chapa Eléctrica (Arduino)**
- Apertura automática con huella
- Configuración de tiempo de apertura
- Selección de puerto COM
- Prueba de conexión
- Control manual

### **👤 Usuarios y Permisos**
- Multi-usuario con roles
- Contraseñas encriptadas (bcrypt)
- Auditoría de acciones
- Gestión de permisos

### **💾 Backup y Seguridad**
- Backup automático de base de datos
- Restauración desde backup
- Base de datos SQLite local (offline)
- Sin necesidad de internet

### **🎨 Interfaz Moderna**
- Tema claro y oscuro
- Diseño responsive
- Iconos profesionales (Heroicons)
- Animaciones fluidas
- Sidebar intuitivo

---

## 🪟 **Instalación en Windows**

### **Opción 1: Instalador (RECOMENDADA)**

```cmd
1. Ejecuta: OPTIMIZAR-WINDOWS.bat
2. Ejecuta: COMPILAR-INSTALADOR.bat
3. Instala: dist-electron\NuevoGym Setup 1.0.0.exe
4. Inicia desde menú de Windows
```

### **Opción 2: Modo Desarrollo**

```cmd
1. Ejecuta: OPTIMIZAR-WINDOWS.bat
2. Ejecuta: INICIAR-NUEVOGYM.bat
3. Espera que se abra la aplicación
```

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

📖 **[Ver Guía Completa para Windows](GUIA-INSTALACION-WINDOWS.md)**

---

## 🍎 **Instalación en Mac**

```bash
# 1. Instalar dependencias
npm install

# 2. Recompilar módulos nativos
npm run rebuild

# 3. Iniciar aplicación
npm start
```

### **Crear instalador .dmg:**
```bash
npm run build
npm run build:mac
```

---

## 🛠️ **Tecnologías Utilizadas**

### **Frontend:**
- ⚛️ React 18
- ⚡ Vite
- 🎨 CSS Variables (Temas)
- 🔷 Heroicons
- 📊 Recharts

### **Backend:**
- 🟢 Node.js
- ⚡ Electron
- 🗄️ better-sqlite3
- 🔐 bcrypt
- 🔌 SerialPort

### **Otros:**
- 📡 Axios (HTTP Client)
- 🎫 react-to-print
- 📅 date-fns
- 🌐 CORS

---

## 📁 **Estructura del Proyecto**

```
nuevogym/
├── electron/                    # Backend
│   ├── main.js                  # Proceso principal
│   └── preload.js               # API segura
├── src/                         # Frontend
│   ├── App.jsx                  # Aplicación principal
│   ├── pages/                   # Módulos
│   │   ├── Dashboard.jsx
│   │   ├── Clientes.jsx
│   │   ├── Asistencias.jsx
│   │   ├── TiposMembresia.jsx
│   │   ├── RenovarMembresias.jsx
│   │   ├── Reportes.jsx
│   │   ├── Usuarios.jsx
│   │   ├── Configuracion.jsx
│   │   └── Login.jsx
│   └── components/              # Componentes
├── public/                      # Recursos estáticos
│   └── images/                  # Logos
├── scripts/                     # Scripts Windows
│   ├── INICIAR-NUEVOGYM.bat
│   ├── COMPILAR-INSTALADOR.bat
│   └── OPTIMIZAR-WINDOWS.bat
└── docs/                        # Documentación
```

---

## 🎯 **Módulos del Sistema**

| Módulo | Descripción |
|--------|-------------|
| **Dashboard** | Vista general con estadísticas clave |
| **Clientes** | Gestión completa de clientes |
| **Asistencias** | Registro y consulta de asistencias |
| **Tipos de Membresía** | Configuración de planes |
| **Renovar Membresías** | Renovación rápida con tickets |
| **Reportes** | 5 tipos de reportes con exportación |
| **Usuarios** | Gestión de usuarios del sistema |
| **Configuración** | Ajustes, Arduino, sensor, backup |

---

## 🔌 **Integración con Hardware**

### **Sensor de Huellas**
- Compatible con api.exe (C# OWIN)
- Comunicación vía webhook HTTP
- Puerto configurable (defecto: 9000)
- Soporte para red local

**Configuración:**
1. Ejecutar api.exe en PC del sensor
2. En NuevoGym: Configuración → Sensor de Huellas
3. Ingresar IP del sensor (ej: 192.168.0.5)
4. Guardar

### **Arduino (Chapa Eléctrica)**
- Comunicación serial (USB)
- Baudios configurables (defecto: 9600)
- Tiempo de apertura ajustable
- Comando: `OPEN_DOOR`

**Código Arduino:**
```cpp
void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readString();
    if (command == "OPEN_DOOR") {
      digitalWrite(RELAY_PIN, HIGH);
      delay(5000);
      digitalWrite(RELAY_PIN, LOW);
    }
  }
}
```

---

## 📊 **Base de Datos**

### **SQLite Local (Offline)**
- No requiere servidor
- Backup sencillo
- Portátil

### **Tablas:**
- `clientes` - Información de clientes
- `membresias` - Tipos de membresía
- `asistencias` - Registro de entradas
- `tickets` - Tickets generados
- `usuarios` - Usuarios del sistema
- `pagos` - Historial de pagos
- `configuracion` - Ajustes del sistema
- `auditoria` - Log de acciones

### **Ubicación:**
- **Windows:** `%APPDATA%\nuevogym\nuevogym.db`
- **Mac:** `~/Library/Application Support/nuevogym/nuevogym.db`

---

## 🎫 **Sistema de Tickets**

### **Características:**
- Numeración automática (#000001, #000002, ...)
- 3 tipos: Renovación, Nuevo Cliente, Pago
- Información completa del cliente y membresía
- Método de pago
- Fecha y hora
- Usuario que lo generó
- Verso bíblico (Salmos 37:5)

### **Formato de Impresión:**
- Optimizado para impresora térmica 80mm
- Logo personalizable
- Diseño profesional
- Compatible con `react-to-print`

---

## 📈 **Reportes Disponibles**

### **1. Reporte de Clientes**
- Total de clientes
- Clientes activos vs vencidos
- Lista completa con estado

### **2. Reporte de Asistencias**
- Total de asistencias por período
- Promedio diario
- Días con registro

### **3. Reporte de Ingresos**
- Total de ingresos por período
- Desglose por método de pago
- Promedio por pago

### **4. Reporte de Membresías**
- Vencen en 7 días
- Vencen en 30 días
- Ya vencidas

### **5. Reporte de Tickets** ⭐ NUEVO
- Total de tickets por mes
- Total de ingresos
- Desglose por tipo de ticket
- Desglose por método de pago
- Tabla detallada
- Cuadre de caja mensual

---

## 🔐 **Seguridad**

- ✅ Contraseñas hasheadas con bcrypt
- ✅ IPC seguro (Electron)
- ✅ Validación de permisos
- ✅ Auditoría de acciones
- ✅ Base de datos local (sin internet)
- ✅ Backup automático
- ✅ Context Isolation

---

## 🚀 **Scripts npm**

```json
{
  "start": "Iniciar en desarrollo",
  "build": "Compilar frontend",
  "build:win": "Crear instalador Windows",
  "build:mac": "Crear instalador Mac",
  "rebuild": "Recompilar módulos nativos"
}
```

---

## 📝 **Documentación Adicional**

- 📖 [Guía de Instalación Windows](GUIA-INSTALACION-WINDOWS.md)
- 🔧 [Solución Pantalla en Blanco](SOLUCION_PANTALLA_EN_BLANCO.md)
- 📊 [Reporte de Tickets](REPORTE_TICKETS_IMPLEMENTADO.md)
- 🎲 [Datos de Prueba](INSTRUCCIONES_DATOS_PRUEBA.md)
- 🖼️ [Configuración de Logos](INSTRUCCIONES_LOGOS.md)
- 🔌 [Configuración API Sensor](CONFIGURACION_API_SENSOR.md)

---

## ⚠️ **Problemas Comunes**

### **Error: better-sqlite3**
```bash
npm run rebuild
```

### **Pantalla en blanco**
```bash
npm run build
```

### **Puerto en uso**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID [numero] /F

# Mac
lsof -ti:4000 | xargs kill -9
```

---

## 📞 **Soporte**

- 📧 Email: soporte@nuevogym.com
- 📚 Documentación: Ver carpeta `docs/`
- 🐛 Issues: GitHub Issues
- 💬 Chat: Discord Server

---

## 📄 **Licencia**

Propietario - Todos los derechos reservados © 2025

---

## 🙏 **Créditos**

Desarrollado con ❤️ para gimnasios que quieren modernizarse.

**Tecnologías:**
- React Team
- Electron Team
- SQLite Team
- Heroicons by Tailwind Labs

---

## 🔄 **Actualizaciones**

### **v1.0.0** - 11 de Octubre, 2025
- ✅ Sistema completo funcional
- ✅ Integración sensor de huellas
- ✅ Integración Arduino
- ✅ Sistema de tickets
- ✅ 5 tipos de reportes
- ✅ Tema claro/oscuro
- ✅ Backup y restauración
- ✅ Multi-usuario
- ✅ Auditoría

---

**¡Gracias por usar NuevoGym!** 🏋️‍♂️💪
