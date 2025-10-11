# ⚡ Inicio Rápido - NuevoGym

## 🚀 Para Comenzar (en Mac - Desarrollo)

### 1. Instalar Dependencias

```bash
cd /Users/krodas7/Desktop/nuevogym
npm install
```

Esto instalará todas las dependencias necesarias:
- Electron (aplicación de escritorio)
- React (interfaz de usuario)
- SQLite (base de datos)
- Vite (herramienta de desarrollo)

### 2. Iniciar la Aplicación en Modo Desarrollo

```bash
npm start
```

La aplicación se abrirá automáticamente. Puedes hacer cambios en el código y se recargarán automáticamente.

### 3. (Opcional) Iniciar el Mock API del Sensor de Huellas

En otra terminal:

```bash
node mock-fingerprint-api.js
```

Esto simula el API.exe del sensor de huellas para testing sin hardware real.

### 4. Configurar el Sensor de Huellas en la App

1. Abre la aplicación NuevoGym
2. Ve a "Configuración"
3. En "URL del API de Huellas" ingresa: `http://localhost:8080`
4. Haz clic en "🔗 Probar Conexión"
5. Deberías ver "✅ Conectado correctamente"

---

## 📦 Compilar para Windows

### Desde tu Mac:

```bash
npm run build:win
```

Esto creará un instalador ejecutable en:
```
dist-electron/NuevoGym-Setup-1.0.0.exe
```

Copia este archivo a una USB y llévalo a la computadora Windows del gimnasio.

---

## 🪟 Instalar en Windows

1. **Copia el instalador** (`NuevoGym-Setup-1.0.0.exe`) a la PC Windows
2. **Ejecuta el instalador**
3. **Acepta** las opciones por defecto
4. **Abre** NuevoGym desde el escritorio
5. **¡Listo!** La aplicación está lista para usar

---

## 🎯 Uso Básico

### Crear tu Primer Cliente

1. Haz clic en "**Clientes**" en el menú lateral
2. Haz clic en "**➕ Nuevo Cliente**"
3. Completa:
   - Nombre: `Juan`
   - Apellidos: `Pérez`
   - Teléfono: `5551234567`
   - Tipo de membresía: `Mensual`
4. Haz clic en "**Crear Cliente**"

### Registrar una Asistencia

**Opción 1 - Manual:**
1. Ve a "**Asistencias**"
2. Haz clic en "**➕ Registrar Asistencia**"
3. Selecciona "**✍️ Manual**"
4. Busca y selecciona a "Juan Pérez"
5. Haz clic en "**✅ Registrar Asistencia**"

**Opción 2 - Con Sensor (requiere Mock API o hardware real):**
1. Ve a "**Asistencias**"
2. Haz clic en "**➕ Registrar Asistencia**"
3. Selecciona "**👆 Sensor de Huellas**"
4. Haz clic en "**Iniciar Identificación**"
5. El sistema identificará automáticamente al cliente

### Ver Estadísticas

El **Dashboard** muestra:
- 📊 Total de clientes
- ✅ Membresías activas
- 📈 Asistencias del día
- 💰 Ingresos del mes

---

## 🛠️ Estructura del Proyecto

```
nuevogym/
├── electron/                    # Backend Electron
│   ├── main.js                 # Proceso principal (SQLite + IPC)
│   └── preload.js              # Bridge seguro
│
├── src/                        # Frontend React
│   ├── components/             # Componentes reutilizables
│   │   ├── ClienteModal.jsx
│   │   ├── ClienteDetalle.jsx
│   │   └── RegistroAsistenciaModal.jsx
│   │
│   ├── pages/                  # Páginas principales
│   │   ├── Dashboard.jsx       # Estadísticas
│   │   ├── Clientes.jsx        # Gestión de clientes
│   │   ├── Asistencias.jsx     # Registro de asistencias
│   │   └── Configuracion.jsx   # Configuración del sistema
│   │
│   ├── App.jsx                 # Componente raíz
│   ├── App.css                 # Estilos globales
│   └── main.jsx                # Entry point
│
├── assets/                     # Recursos (iconos)
├── package.json                # Dependencias
├── vite.config.js              # Config de Vite
└── mock-fingerprint-api.js     # API simulada para testing
```

---

## 📚 Documentación Adicional

- **README.md** - Documentación completa del proyecto
- **INSTALL_WINDOWS.md** - Guía detallada de instalación en Windows
- **FINGERPRINT_API_SPEC.md** - Especificación del API de huellas

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start              # Inicia la app en modo desarrollo

# Testing
node mock-fingerprint-api.js  # Inicia el Mock API de huellas

# Compilación
npm run build          # Compila el frontend
npm run build:win      # Compila instalador para Windows
npm run build:mac      # Compila instalador para Mac
```

---

## ⚠️ Troubleshooting Común

### "npm install" falla:
```bash
# Limpia caché y reinstala
rm -rf node_modules package-lock.json
npm install
```

### La aplicación no inicia:
```bash
# Verifica que Vite esté corriendo en puerto 3000
lsof -i :3000

# Si hay algo, mátalo
kill -9 [PID]

# Reinicia
npm start
```

### Error al compilar para Windows:
```bash
# Asegúrate de tener todas las dependencias
npm install --save-dev electron-builder

# Intenta de nuevo
npm run build:win
```

### Mock API no responde:
```bash
# Verifica que express esté instalado
npm install express

# Inicia el mock
node mock-fingerprint-api.js
```

---

## 🎓 Próximos Pasos

1. ✅ **Familiarízate** con la interfaz
2. ✅ **Crea algunos clientes** de prueba
3. ✅ **Registra asistencias** de prueba
4. ✅ **Revisa el Dashboard** para ver las estadísticas
5. ✅ **Compila para Windows** y prueba en PC real
6. ✅ **Configura el sensor de huellas** real (si lo tienes)

---

## 💡 Tips de Desarrollo

- **Hot Reload:** Los cambios en el código se reflejan automáticamente
- **DevTools:** En desarrollo se abren automáticamente (F12)
- **Base de Datos:** En desarrollo se crea en `~/Library/Application Support/nuevogym/`
- **Logs:** Revisa la consola para ver errores y mensajes

---

## 📞 Soporte

Si tienes dudas:
1. Revisa los archivos de documentación
2. Verifica la consola de errores (F12 en la app)
3. Revisa los logs del terminal

---

**¡Éxito con tu aplicación de gimnasio! 💪🏋️‍♂️**

