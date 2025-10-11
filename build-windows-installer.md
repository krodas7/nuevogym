# 🪟 Instalador para Windows - NuevoGym

## 📋 Pasos para crear el instalador:

### 1. **Preparar el sistema:**
```bash
# Detener la aplicación si está corriendo
pkill -f "node.*vite" && pkill -f "electron"

# Limpiar builds anteriores
rm -rf dist dist-electron
```

### 2. **Construir la aplicación:**
```bash
# Construir el frontend React
npm run build

# Crear el instalador para Windows
npm run build:win
```

### 3. **Archivos generados:**
Los archivos se crearán en la carpeta `dist-electron/`:
- **Instalador:** `NuevoGym - Sistema de Gestión de Gimnasio-1.0.0-x64.exe`
- **Portable:** `NuevoGym - Sistema de Gestión de Gimnasio-1.0.0-Portable.exe`

## 🎯 Características del instalador:

### ✅ **Instalador NSIS:**
- Instalación completa con wizard
- Acceso directo en escritorio
- Acceso directo en menú inicio
- Desinstalador incluido
- Instalación en directorio personalizable
- Requiere permisos de administrador

### ✅ **Versión Portable:**
- No requiere instalación
- Se ejecuta desde cualquier carpeta
- Ideal para USB o copias de seguridad
- No modifica el registro de Windows

## 🔧 Requisitos del sistema Windows:

### **Mínimos:**
- Windows 10 (64-bit)
- 4 GB RAM
- 500 MB espacio en disco
- .NET Framework 4.7.2 o superior

### **Recomendados:**
- Windows 11 (64-bit)
- 8 GB RAM
- 1 GB espacio en disco
- Conexión a internet (para actualizaciones)

## 📦 Distribución:

### **Para el cliente:**
1. Copiar el archivo `.exe` a la computadora Windows
2. Ejecutar como administrador
3. Seguir el wizard de instalación
4. La aplicación aparecerá en el menú inicio

### **Configuración inicial:**
1. Abrir NuevoGym
2. Login con: `admin` / `admin123`
3. Cambiar contraseña en Configuración
4. Configurar sensor de huellas (si aplica)
5. Configurar puerto COM para chapa eléctrica (si aplica)

## 🚨 Notas importantes:

- **Antivirus:** Puede que Windows Defender detecte el archivo como sospechoso (falso positivo)
- **Firewall:** Permitir la aplicación a través del firewall
- **Permisos:** La aplicación necesita permisos para acceder a puertos COM y red
- **Base de datos:** Se crea automáticamente en `%APPDATA%/nuevogym/`

## 🔄 Actualizaciones:

Para actualizar la aplicación:
1. Descargar nueva versión
2. Ejecutar nuevo instalador
3. Sobrescribir instalación anterior
4. Los datos se mantienen automáticamente
