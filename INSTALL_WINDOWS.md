# 🪟 Guía de Instalación para Windows

## Para el Desarrollador (compilar en Mac)

### 1. Instalar dependencias para compilación Windows

```bash
# Desde tu Mac, instala wine (opcional, para testing)
brew install wine-stable

# Las dependencias de electron-builder ya están en package.json
npm install
```

### 2. Compilar para Windows

```bash
# Esto creará el instalador para Windows
npm run build:win
```

El instalador se generará en: `dist-electron/NuevoGym-Setup-[version].exe`

### 3. Distribuir el instalador

Copia el archivo `.exe` a una USB o envíalo por correo/drive para instalarlo en la computadora Windows del gimnasio.

---

## Para el Usuario Final (instalación en Windows)

### Requisitos del Sistema
- Windows 10 o superior (64 bits recomendado)
- 500 MB de espacio en disco
- 4 GB de RAM mínimo

### Pasos de Instalación

#### 1. Ejecutar el Instalador
- Haz doble clic en `NuevoGym-Setup.exe`
- Si Windows SmartScreen aparece, haz clic en "Más información" y luego "Ejecutar de todas formas"

#### 2. Asistente de Instalación
- Acepta los términos de la licencia
- Elige la carpeta de instalación (recomendado: dejar por defecto)
- Selecciona si deseas crear un acceso directo en el escritorio
- Haz clic en "Instalar"

#### 3. Primera Ejecución
- Abre NuevoGym desde el escritorio o menú inicio
- La aplicación creará automáticamente la base de datos local
- Se cargarán las membresías por defecto

### 📍 Ubicación de los Datos

Los datos del gimnasio se guardan en:
```
C:\Users\[TuUsuario]\AppData\Roaming\nuevogym\
```

**⚠️ IMPORTANTE**: Haz respaldos periódicos de esta carpeta para no perder información.

### 🔌 Configurar el Sensor de Huellas

#### Si tienes un sensor de huellas dactilares:

1. **Instalar el driver del sensor**
   - Instala el software que vino con tu dispositivo
   - Asegúrate de que el sensor funcione correctamente

2. **Ejecutar el API.exe**
   - Ejecuta el archivo `API.exe` que te proporciona el fabricante del sensor
   - Este programa debe quedarse abierto mientras uses NuevoGym
   - Por defecto corre en el puerto 8080

3. **Configurar en NuevoGym**
   - Abre NuevoGym
   - Ve a la sección "Configuración"
   - En "URL del API de Huellas" ingresa: `http://localhost:8080`
   - Haz clic en "Probar Conexión"
   - Deberías ver "✅ Conectado correctamente"

#### Si NO tienes sensor de huellas:
- No te preocupes, la aplicación funciona perfectamente sin él
- Simplemente registra las asistencias de forma manual

### 🚀 Inicio Rápido

#### Registrar el Primer Cliente:

1. Abre NuevoGym
2. Haz clic en "Clientes" en el menú lateral
3. Haz clic en "➕ Nuevo Cliente"
4. Completa la información:
   - Nombre y apellidos (obligatorio)
   - Teléfono y email (opcional)
   - Fecha de inicio
   - Tipo de membresía (Mensual, Trimestral, etc.)
5. Si tienes sensor de huellas, haz clic en "👆 Capturar Huella"
6. Haz clic en "Crear Cliente"

#### Registrar una Asistencia:

**Método 1 - Manual:**
1. Ve a "Asistencias"
2. Haz clic en "➕ Registrar Asistencia"
3. Selecciona "✍️ Manual"
4. Busca y selecciona el cliente
5. Haz clic en "✅ Registrar Asistencia"

**Método 2 - Con Sensor de Huellas:**
1. Ve a "Asistencias"
2. Haz clic en "➕ Registrar Asistencia"
3. Selecciona "👆 Sensor de Huellas"
4. Haz clic en "Iniciar Identificación"
5. El cliente coloca su dedo en el sensor
6. ¡Listo! La asistencia se registra automáticamente

### 📊 Ver Estadísticas

El Dashboard principal muestra:
- Total de clientes activos
- Membresías por vencer
- Asistencias del día
- Ingresos del mes
- Gráfico de asistencias de la semana

### 💰 Registrar un Pago

1. Ve a "Clientes"
2. Busca el cliente
3. Haz clic en "👁️ Ver" junto al cliente
4. Haz clic en "💰 Registrar Pago"
5. Ingresa el monto y método de pago
6. Confirma

### 🔄 Actualizar la Aplicación

Para actualizar a una nueva versión:
1. Descarga el nuevo instalador
2. Ejecuta el instalador (tus datos NO se perderán)
3. La instalación se actualizará automáticamente

### 📦 Respaldar los Datos

**Opción 1 - Manual:**
1. Cierra NuevoGym
2. Ve a: `C:\Users\[TuUsuario]\AppData\Roaming\nuevogym\`
3. Copia el archivo `nuevogym.db` a una USB o nube
4. Guarda este archivo en un lugar seguro

**Frecuencia recomendada:** Semanal o después de registrar información importante

**Para restaurar un respaldo:**
1. Cierra NuevoGym
2. Reemplaza el archivo `nuevogym.db` con tu respaldo
3. Abre NuevoGym

### ⚠️ Solución de Problemas Comunes

#### La aplicación no abre:
- Verifica que tu antivirus no esté bloqueándola
- Intenta ejecutar como Administrador (clic derecho → "Ejecutar como administrador")
- Reinstala la aplicación

#### No puedo conectar el sensor de huellas:
- Verifica que el API.exe esté ejecutándose
- Revisa que el puerto sea 8080
- Verifica el firewall de Windows:
  - Panel de Control → Firewall de Windows
  - "Permitir una aplicación a través del Firewall"
  - Agrega el API.exe y NuevoGym

#### Membresías no se actualizan:
- Las fechas de vencimiento se calculan automáticamente
- Si necesitas extender una membresía, edita el cliente y cambia la fecha de inicio

#### La aplicación va lenta:
- Cierra otros programas
- Reinicia la computadora
- Si tienes miles de registros, considera archivar datos antiguos

### 🆘 Soporte

Si necesitas ayuda:
1. Revisa esta guía completa
2. Verifica el README.md para información técnica
3. Contacta al desarrollador o administrador del sistema

### 📱 Consejos de Uso

✅ **Haz respaldos regulares de la base de datos**
✅ **Mantén el sistema actualizado**
✅ **Cierra correctamente la aplicación (no fuerces el cierre)**
✅ **Verifica membresías vencidas semanalmente**
✅ **Registra los pagos inmediatamente al recibirlos**

### 🎯 Flujo de Trabajo Recomendado

**Al iniciar el día:**
1. Abre NuevoGym
2. Si usas sensor, ejecuta el API.exe
3. Revisa el Dashboard para ver el estado general

**Durante el día:**
- Registra asistencias conforme lleguen los clientes
- Registra pagos inmediatamente

**Al finalizar el día:**
- Revisa el total de asistencias en el Dashboard
- Verifica los ingresos del día
- Cierra la aplicación correctamente

**Una vez por semana:**
- Revisa clientes con membresías por vencer
- Haz un respaldo de la base de datos
- Contacta a clientes con membresías vencidas

---

**¡Listo! Ya estás listo para gestionar tu gimnasio con NuevoGym.**

Si tienes alguna duda, no dudes en consultar al desarrollador o administrador del sistema.

