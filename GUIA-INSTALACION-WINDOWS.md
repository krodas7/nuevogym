# 🪟 Guía de Instalación y Uso en Windows

## 📋 **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalado:

### **1. Node.js (OBLIGATORIO)**
- **Descargar:** https://nodejs.org
- **Versión recomendada:** LTS (Long Term Support)
- **Verifica instalación:**
  ```cmd
  node --version
  npm --version
  ```

### **2. Git (Opcional)**
- **Descargar:** https://git-scm.com/download/win
- Solo necesario si vas a clonar el repositorio

---

## 🚀 **Opción 1: Instalación Rápida (RECOMENDADA)**

### **Paso 1: Copiar el Proyecto**
1. Copia la carpeta `nuevogym` completa a tu USB
2. Lleva la USB a la computadora Windows
3. Copia la carpeta a `C:\nuevogym` (o donde prefieras)

### **Paso 2: Optimizar para Windows**
```cmd
1. Abre la carpeta C:\nuevogym
2. Doble clic en: OPTIMIZAR-WINDOWS.bat
3. Espera que termine (3-5 minutos)
4. Verás el mensaje "✅ OPTIMIZACIÓN COMPLETADA"
```

### **Paso 3: Iniciar la Aplicación**
```cmd
1. Doble clic en: INICIAR-NUEVOGYM.bat
2. Espera que se abra la ventana de Electron (10-15 segundos)
3. Inicia sesión con: admin / admin123
```

---

## 📦 **Opción 2: Crear Instalador .EXE**

### **Paso 1: Optimizar (si no lo hiciste)**
```cmd
Doble clic en: OPTIMIZAR-WINDOWS.bat
```

### **Paso 2: Compilar Instalador**
```cmd
Doble clic en: COMPILAR-INSTALADOR.bat
```

Esto creará:
- `dist-electron\NuevoGym Setup 1.0.0.exe` (Instalador NSIS)
- `dist-electron\NuevoGym 1.0.0.exe` (Versión Portable)

### **Paso 3: Instalar**
```cmd
1. Ve a la carpeta dist-electron\
2. Doble clic en: NuevoGym Setup 1.0.0.exe
3. Sigue el asistente de instalación
4. Al finalizar, busca "NuevoGym" en el menú de inicio
```

---

## 🔧 **Estructura de Archivos**

```
nuevogym/
├── INICIAR-NUEVOGYM.bat           ← Ejecutar en desarrollo
├── COMPILAR-INSTALADOR.bat        ← Crear instalador .exe
├── OPTIMIZAR-WINDOWS.bat          ← Preparar para Windows
├── package.json                   ← Configuración del proyecto
├── electron/                      ← Backend (Node.js + SQLite)
│   ├── main.js                    ← Proceso principal
│   └── preload.js                 ← API segura
├── src/                           ← Frontend (React)
│   ├── App.jsx                    ← Aplicación principal
│   ├── pages/                     ← Módulos del sistema
│   └── components/                ← Componentes reutilizables
├── dist/                          ← Frontend compilado (generado)
├── dist-electron/                 ← Instaladores (generado)
├── node_modules/                  ← Dependencias (generado)
└── public/                        ← Recursos estáticos
    └── images/                    ← Logos e imágenes
```

---

## 📝 **Scripts Disponibles**

### **INICIAR-NUEVOGYM.bat**
- **Función:** Ejecutar en modo desarrollo
- **Uso:** Doble clic
- **Cuándo:** Para desarrollo o pruebas
- **Ventajas:**
  - Hot reload (cambios en tiempo real)
  - DevTools abierto
  - Logs en consola
- **Desventajas:**
  - Requiere Node.js instalado
  - Consume más recursos

### **COMPILAR-INSTALADOR.bat**
- **Función:** Crear instalador .exe
- **Uso:** Doble clic
- **Cuándo:** Para producción o distribución
- **Ventajas:**
  - No requiere Node.js en PC de destino
  - Instalación profesional
  - Icono en menú de inicio
- **Desventajas:**
  - Tarda varios minutos
  - Ocupa más espacio

### **OPTIMIZAR-WINDOWS.bat**
- **Función:** Preparar proyecto para Windows
- **Uso:** Doble clic (una sola vez)
- **Cuándo:** Primera vez en Windows o después de errores
- **Qué hace:**
  - Limpia caché
  - Reinstala dependencias
  - Recompila módulos nativos
  - Compila frontend

---

## ⚠️ **Solución de Problemas**

### **Error: "Node.js no está instalado"**
```
Solución:
1. Instala Node.js desde: https://nodejs.org
2. Reinicia la terminal/CMD
3. Verifica: node --version
```

### **Error: "better-sqlite3 no compilado"**
```
Solución:
1. Ejecuta: OPTIMIZAR-WINDOWS.bat
2. Si persiste: npm run rebuild
```

### **Error: "Puerto 4000 en uso"**
```
Solución:
1. Cierra todas las ventanas de NuevoGym
2. Abre CMD como Administrador:
   netstat -ano | findstr :4000
   taskkill /PID [número] /F
3. Intenta nuevamente
```

### **Error: "dist/index.html no encontrado"**
```
Solución:
1. Ejecuta: npm run build
2. Verifica que exista: dist\index.html
3. Si no: OPTIMIZAR-WINDOWS.bat
```

### **Pantalla en Blanco después de Instalar**
```
Solución:
1. Desinstala NuevoGym
2. Ejecuta: OPTIMIZAR-WINDOWS.bat
3. Ejecuta: COMPILAR-INSTALADOR.bat
4. Instala de nuevo
```

---

## 🔐 **Credenciales Por Defecto**

```
Usuario: admin
Contraseña: admin123
```

**⚠️ IMPORTANTE:** Cambia la contraseña después del primer inicio:
1. Ve a **Configuración**
2. Sección "Cambiar Contraseña"
3. Ingresa nueva contraseña

---

## 💾 **Base de Datos**

### **Ubicación:**
```
Windows: C:\Users\[Usuario]\AppData\Roaming\nuevogym\nuevogym.db
```

### **Backup:**
```
1. Abre NuevoGym
2. Ve a Configuración
3. Sección "Respaldo de Base de Datos"
4. Clic en "Crear Copia de Seguridad"
5. Guarda en lugar seguro
```

### **Restaurar:**
```
1. Abre NuevoGym
2. Ve a Configuración
3. Sección "Respaldo de Base de Datos"
4. Clic en "Restaurar desde Backup"
5. Selecciona archivo .db
```

---

## 🎯 **Primeros Pasos**

### **1. Configurar Sensor de Huellas**
```
1. Ve a Configuración
2. Sección "Sensor de Huellas"
3. Ingresa IP del sensor (ej: 192.168.0.5)
4. Guarda cambios
```

### **2. Configurar Arduino (Chapa Eléctrica)**
```
1. Ve a Configuración
2. Sección "Chapa Eléctrica"
3. Selecciona puerto COM (ej: COM3)
4. Configura baudios (9600)
5. Configura tiempo de apertura (5 segundos)
6. Prueba conexión
```

### **3. Crear Primer Cliente**
```
1. Ve a módulo "Clientes"
2. Clic en "+ Nuevo Cliente"
3. Ingresa datos básicos
4. Captura foto (opcional)
5. Selecciona tipo de membresía
6. Registra huella (opcional)
7. Guarda
```

### **4. Renovar Membresía**
```
1. Ve a módulo "Renovar Membresías"
2. Busca cliente
3. Clic en "Renovar"
4. Confirma datos
5. Selecciona método de pago
6. Guarda e imprime ticket
```

### **5. Generar Reportes**
```
1. Ve a módulo "Reportes"
2. Selecciona tipo:
   - Clientes
   - Asistencias
   - Ingresos
   - Membresías por Vencer
   - Tickets Generados
3. Configura fechas/mes
4. Genera reporte
5. Exporta o imprime
```

---

## 🔄 **Actualizar NuevoGym**

### **Si usas la versión de desarrollo:**
```cmd
1. Detén la aplicación (Ctrl+C)
2. Copia nuevos archivos
3. Ejecuta: OPTIMIZAR-WINDOWS.bat
4. Ejecuta: INICIAR-NUEVOGYM.bat
```

### **Si usas la versión instalada:**
```cmd
1. Haz backup de la base de datos
2. Desinstala versión anterior
3. Ejecuta: COMPILAR-INSTALADOR.bat
4. Instala nueva versión
5. Restaura backup si es necesario
```

---

## 📊 **Rendimiento**

### **Recursos Recomendados:**
```
CPU: Intel i3 o superior
RAM: 4 GB mínimo (8 GB recomendado)
Disco: 500 MB libres
Sistema: Windows 7/8/10/11 (64 bits)
```

### **Optimización:**
```
1. Cierra otras aplicaciones pesadas
2. Actualiza Windows
3. Limpia archivos temporales
4. Desfragmenta disco (HDD)
```

---

## 📞 **Soporte**

### **Logs de Error:**
```
1. Presiona Ctrl+Shift+I en la aplicación
2. Ve a pestaña "Console"
3. Copia errores en rojo
4. Reporta junto con descripción del problema
```

### **Información del Sistema:**
```cmd
systeminfo
node --version
npm --version
```

---

## ✅ **Checklist de Instalación**

- [ ] Node.js instalado y verificado
- [ ] Proyecto copiado a disco local
- [ ] OPTIMIZAR-WINDOWS.bat ejecutado sin errores
- [ ] INICIAR-NUEVOGYM.bat abre la aplicación
- [ ] Login funciona (admin / admin123)
- [ ] Dashboard muestra información
- [ ] Módulo Clientes funciona
- [ ] Se puede crear un cliente de prueba
- [ ] Configuración se guarda correctamente
- [ ] Backup de base de datos funciona

---

## 🎉 **¡Todo Listo!**

NuevoGym está instalado y configurado correctamente.

**Próximos pasos:**
1. Cambia la contraseña por defecto
2. Configura el sensor de huellas (si lo tienes)
3. Configura el Arduino (si lo tienes)
4. Crea tus primeros clientes
5. Genera tu primer reporte

---

**Fecha:** 11 de Octubre, 2025  
**Versión:** 1.0.0  
**Soporte:** Documentación completa en carpeta del proyecto

