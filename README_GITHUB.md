# 🏋️ NuevoGym - Sistema de Gestión de Gimnasio

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)](package.json)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Mac-lightgrey.svg)]()
[![Electron](https://img.shields.io/badge/Electron-27.0.0-47848F.svg)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)](https://reactjs.org/)

> Sistema completo de gestión para gimnasios con control de clientes, asistencias, membresías, pagos y reportes. Incluye integración con sensor de huellas y chapa eléctrica vía Arduino.

---

## 🚀 Instalación Rápida

### **Windows**

```cmd
# 1. Clonar repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Optimizar para Windows
OPTIMIZAR-WINDOWS.bat

# 3. Iniciar aplicación
INICIAR-NUEVOGYM.bat
```

### **Mac / Linux**

```bash
# 1. Clonar repositorio
git clone https://github.com/krodas7/nuevogym.git
cd nuevogym

# 2. Instalar dependencias
npm install

# 3. Recompilar módulos nativos
npm run rebuild

# 4. Iniciar aplicación
npm start
```

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## ✨ Características

### 📊 **Dashboard Completo**
- Ingresos mensuales en tiempo real
- Asistencias diarias con gráficos
- Total de clientes activos
- Membresías próximas a vencer
- Visualización con Recharts

### 👥 **Gestión de Clientes**
- Registro con foto y huella dactilar
- Tipos de membresía personalizables
- Control de fechas de vencimiento
- Búsqueda y filtrado avanzado
- Historial completo de pagos

### 🎫 **Sistema de Tickets**
- Numeración automática incremental
- 3 tipos: Renovación, Nuevo Cliente, Pago
- Diseño para impresora térmica 80mm
- Logo personalizable
- Almacenamiento en base de datos

### 📈 **Reportes Profesionales**
1. **Clientes** - Total, activos, vencidos
2. **Asistencias** - Por período con promedio
3. **Ingresos** - Total y por método de pago
4. **Membresías** - Próximas a vencer (7/30 días)
5. **Tickets** - Cuadre de caja mensual

Todos con exportación a CSV/Excel e impresión optimizada.

### 👆 **Sensor de Huellas**
- Integración con api.exe (C# OWIN)
- Verificación automática de asistencias
- Notificaciones en tiempo real
- Control de accesos con apertura de chapa

### 🔐 **Arduino (Chapa Eléctrica)**
- Comunicación serial vía USB
- Puerto COM configurable
- Tiempo de apertura ajustable
- Apertura manual/automática

### 👤 **Sistema Multiusuario**
- Roles y permisos
- Contraseñas encriptadas (bcrypt)
- Auditoría completa de acciones
- Gestión de usuarios

### 💾 **Backup Automático**
- Base de datos SQLite local
- Backup y restauración con un clic
- Sin necesidad de internet
- Portable

### 🎨 **Interfaz Moderna**
- Tema claro y oscuro
- Iconos profesionales (Heroicons)
- Diseño responsive
- Animaciones fluidas

---

## 🛠️ Tecnologías

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| React 18 | Node.js | SQLite | Vite |
| Vite | Electron 27 | better-sqlite3 | electron-builder |
| Recharts | Express | - | bcrypt |
| Heroicons | SerialPort | - | Axios |
| CSS Variables | - | - | react-to-print |

---

## 📦 Estructura del Proyecto

```
nuevogym/
├── electron/                    # Backend (Node.js + Electron)
│   ├── main.js                  # Proceso principal
│   └── preload.js               # API segura
├── src/                         # Frontend (React)
│   ├── pages/                   # Módulos del sistema
│   ├── components/              # Componentes reutilizables
│   └── contexts/                # React Contexts
├── public/                      # Recursos estáticos
│   └── images/                  # Logos
├── scripts/                     # Scripts de Windows
│   ├── INICIAR-NUEVOGYM.bat
│   ├── COMPILAR-INSTALADOR.bat
│   └── OPTIMIZAR-WINDOWS.bat
└── docs/                        # Documentación
```

---

## 📚 Documentación

- 📖 [Guía de Instalación Windows](GUIA-INSTALACION-WINDOWS.md)
- 🔧 [Solución Pantalla en Blanco](SOLUCION_PANTALLA_EN_BLANCO.md)
- 📊 [Reporte de Tickets](REPORTE_TICKETS_IMPLEMENTADO.md)
- 🎲 [Datos de Prueba](INSTRUCCIONES_DATOS_PRUEBA.md)
- 🖼️ [Configuración de Logos](INSTRUCCIONES_LOGOS.md)
- 🔌 [Configuración API Sensor](CONFIGURACION_API_SENSOR.md)
- 📦 [Entrega Final](ENTREGA-FINAL.md)

---

## 🚀 Scripts NPM

```bash
npm start              # Iniciar en modo desarrollo
npm run build          # Compilar frontend
npm run build:win      # Crear instalador Windows
npm run build:mac      # Crear instalador Mac
npm run rebuild        # Recompilar módulos nativos
```

---

## 🪟 Crear Instalador Windows

```cmd
# Método 1: Automático
COMPILAR-INSTALADOR.bat

# Método 2: Manual
npm run build
npm run build:win
```

El instalador se creará en: `dist-electron/NuevoGym Setup 1.0.0.exe`

---

## 🔌 Integración con Hardware

### **Sensor de Huellas**
- Compatible con api.exe (C# OWIN)
- Webhook HTTP en puerto configurable
- Registro automático de asistencias
- Ver [CONFIGURACION_API_SENSOR.md](CONFIGURACION_API_SENSOR.md)

### **Arduino (Chapa Eléctrica)**
- Comunicación serial USB
- Puerto COM configurable
- Código Arduino incluido
- Apertura automática con huella

---

## 🎯 Casos de Uso

### **Gimnasio Pequeño**
- 50-100 clientes
- 1-2 usuarios
- Registro manual de asistencias
- Reportes mensuales básicos

### **Gimnasio Mediano**
- 100-500 clientes
- 3-5 usuarios
- Sensor de huellas
- Chapa eléctrica automática
- Reportes avanzados

### **Gimnasio Grande**
- 500+ clientes
- 5+ usuarios
- Multiple puntos de acceso
- Reportes corporativos
- Integración completa

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas (bcrypt, salt rounds: 10)
- ✅ IPC seguro (Context Isolation)
- ✅ Base de datos local (sin exposición)
- ✅ Validación de permisos por módulo
- ✅ Auditoría completa de acciones
- ✅ Backup encriptado opcional

---

## 📊 Requisitos del Sistema

### **Mínimos**
- **OS:** Windows 7/8/10/11 (64 bits) o macOS 10.13+
- **CPU:** Intel i3 o equivalente
- **RAM:** 4 GB
- **Disco:** 500 MB libres
- **Node.js:** 18.x o superior (para desarrollo)

### **Recomendados**
- **OS:** Windows 10/11 (64 bits)
- **CPU:** Intel i5 o superior
- **RAM:** 8 GB
- **Disco:** 1 GB libres
- **SSD:** Recomendado para mejor rendimiento

---

## 🐛 Problemas Comunes

### **Error: better-sqlite3**
```bash
npm run rebuild
```

### **Pantalla en blanco**
```bash
npm run build
```

### **Puerto en uso (4000)**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID [numero] /F

# Mac/Linux
lsof -ti:4000 | xargs kill -9
```

Ver más en [SOLUCION_PANTALLA_EN_BLANCO.md](SOLUCION_PANTALLA_EN_BLANCO.md)

---

## 🤝 Contribuir

Este es un proyecto propietario. Para consultas sobre licencias o contribuciones, contacta al autor.

---

## 📄 Licencia

Propietario - Todos los derechos reservados © 2025

---

## 👨‍💻 Autor

**Kevin Rodas** - [@krodas7](https://github.com/krodas7)

---

## 🙏 Agradecimientos

- [Electron](https://www.electronjs.org/) - Framework para aplicaciones desktop
- [React](https://reactjs.org/) - Librería de UI
- [SQLite](https://www.sqlite.org/) - Base de datos embebida
- [Heroicons](https://heroicons.com/) - Iconos profesionales
- [Recharts](https://recharts.org/) - Gráficos interactivos

---

## 📞 Soporte

- 📧 **Email:** soporte@nuevogym.com
- 🐛 **Issues:** [GitHub Issues](https://github.com/krodas7/nuevogym/issues)
- 📚 **Docs:** Ver carpeta `docs/`

---

## 🔄 Roadmap

### **v1.1.0** (Próximamente)
- [ ] Aplicación móvil (React Native)
- [ ] Integración con WhatsApp Business
- [ ] Pagos en línea
- [ ] Dashboard gerencial avanzado

### **v1.2.0** (Futuro)
- [ ] API REST para integraciones
- [ ] Panel web (admin remoto)
- [ ] Múltiples sucursales
- [ ] Reportes personalizables

---

## 📈 Changelog

### **v1.0.0** - 11 de Octubre, 2025
- 🎉 Release inicial
- ✅ Sistema completo funcional
- ✅ 10 módulos implementados
- ✅ 5 tipos de reportes
- ✅ Integración hardware completa
- ✅ Documentación completa

---

**⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub!**

**🏋️‍♂️ NuevoGym - Moderniza tu gimnasio hoy**

