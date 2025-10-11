# 📡 Configuración del Sensor de Huellas (api.exe)

## 🔧 Cómo funciona

### Flujo del Sistema

```
┌─────────────────┐
│   api.exe       │ Escucha en puerto 9000
│ (Sensor ZK)     │ Detecta huellas → Envía template_b64
└────────┬────────┘
         │ POST
         ▼
┌─────────────────┐
│  NuevoGym       │ Escucha en puerto 9000
│  (Electron)     │ Recibe datos → Compara → Registra asistencia
└─────────────────┘
```

### ⚙️ Configuración de api.exe

El `api.exe` debe ser configurado para enviar los datos del sensor a la aplicación NuevoGym:

1. **Edita el archivo `Program.cs`** en tu proyecto de C#
2. **Cambia la URL del webhook** de Django a NuevoGym:

```csharp
// ANTES (Django):
private const string WEBHOOK_URL = "http://localhost:8006/api/asistencias/attendance/probe";

// DESPUÉS (NuevoGym):
private const string WEBHOOK_URL = "http://192.168.0.5:9000";
```

3. **El secret ya no es necesario** (pero puedes dejarlo, Electron lo ignora)

---

## 🚀 Pasos para Probar

### 1️⃣ En la computadora con el sensor (192.168.0.5)

#### Opción A: Compilar api.exe con la nueva URL
```bash
# Edita Program.cs y cambia WEBHOOK_URL
# Compila el proyecto C#
dotnet publish -c Release -r win-x64 --self-contained
```

#### Opción B: Probar con Postman/curl (sin compilar)
```bash
# Simular que el sensor detectó una huella
curl -X POST http://192.168.0.5:9000 \
  -H "Content-Type: application/json" \
  -d '{"template_b64":"ABC123XYZ..."}'
```

### 2️⃣ En NuevoGym (donde corre Electron)

1. **Inicia la aplicación:**
   ```bash
   cd /Users/krodas7/Desktop/nuevogym
   npm start
   ```

2. **Verifica que el servidor webhook esté activo:**
   - En la terminal deberías ver:
     ```
     🌐 Servidor webhook iniciado en puerto 9000
     📡 Escuchando en: http://192.168.0.5:9000
     ```

3. **Registra un cliente con huella:**
   - Ve a **Clientes → + Nuevo Cliente**
   - Captura la huella del cliente (guarda el `template_b64` en la base de datos)

4. **Inicia el api.exe** en la computadora con el sensor:
   ```bash
   api.exe
   ```
   - Debería mostrar:
     ```
     API escuchando en http://localhost:9000
     Auto-init ✓
     Auto-monitor ✓
     ```

5. **Coloca el dedo en el sensor:**
   - El `api.exe` capturará la huella
   - Enviará el `template_b64` a NuevoGym (192.168.0.5:9000)
   - NuevoGym comparará con todos los clientes registrados
   - Si encuentra match:
     - ✅ Registra asistencia
     - 🔓 Abre chapa eléctrica (si está configurada)
     - 📊 Actualiza el dashboard

---

## 🧪 Pruebas Paso a Paso

### Prueba 1: Verificar que NuevoGym escucha en el puerto 9000

En otra terminal o desde la computadora del sensor:

```bash
# Debería responder con status: "active"
curl http://192.168.0.5:9000
```

**Respuesta esperada:**
```json
{
  "status": "active",
  "message": "Servidor webhook funcionando correctamente",
  "port": 9000,
  "timestamp": "2025-10-10T..."
}
```

### Prueba 2: Simular envío de huella

```bash
curl -X POST http://192.168.0.5:9000 \
  -H "Content-Type: application/json" \
  -d '{"template_b64":"TEST_TEMPLATE_123"}'
```

**En la terminal de NuevoGym deberías ver:**
```
📡 Datos recibidos del sensor de huellas: { template_b64: 'TEST_TEMPLATE_123' }
🔍 Procesando datos del sensor...
🔍 Comparando con X clientes...
```

### Prueba 3: Verificar que api.exe puede conectarse

1. **Edita `Program.cs`** y cambia:
   ```csharp
   private const string WEBHOOK_URL = "http://192.168.0.5:9000";
   ```

2. **Compila y ejecuta:**
   ```bash
   dotnet run
   ```

3. **Coloca un dedo en el sensor**
   - Verifica en la terminal de NuevoGym que llegan los datos

---

## 🔍 Logs y Debugging

### En NuevoGym (Electron)

Abre la consola de desarrollador: **Ver → Toggle Developer Tools** o `Cmd+Option+I`

**Logs importantes:**
```
🌐 Servidor webhook iniciado en puerto 9000
📡 Datos recibidos del sensor de huellas: {...}
👆 Huella detectada, comparando con clientes registrados...
✅ Match encontrado: Juan Pérez (score: 85)
✅ Membresía vigente para Juan Pérez
📝 Asistencia registrada para Juan Pérez
🔓 Abriendo chapa eléctrica...
```

### En api.exe

**Logs importantes:**
```
API escuchando en http://localhost:9000
Auto-init ✓ 200 {"ok":true,...}
Auto-monitor ✓ 200 {"running":true,...}
```

---

## 🐛 Problemas Comunes

### ❌ Puerto 9000 ya está en uso

**Causa:** Otra instancia de api.exe o NuevoGym está corriendo.

**Solución:**
```bash
# Windows (en PowerShell):
Get-Process -Name "api" | Stop-Process -Force

# Mac/Linux:
lsof -ti:9000 | xargs kill -9
```

### ❌ api.exe no puede conectarse a NuevoGym

**Causa:** Firewall bloqueando el puerto 9000 o IP incorrecta.

**Solución:**
1. Verifica la IP de la computadora donde corre NuevoGym:
   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```
2. Actualiza `WEBHOOK_URL` en `Program.cs`
3. Configura el firewall para permitir conexiones en el puerto 9000

### ❌ "Huella no reconocida" pero sí está registrada

**Causa:** El template guardado no coincide con el sensor actual.

**Solución:**
1. Re-registra la huella del cliente
2. Asegúrate de usar el **mismo sensor** para captura e identificación
3. Verifica que el `template_b64` se guardó correctamente en la base de datos

---

## 📝 Estructura de Datos

### Datos que envía api.exe a NuevoGym

```json
{
  "template_b64": "MIGfMA0GCSqGSIb3DQEBAQUAA4..."
}
```

### Datos que NuevoGym envía al frontend (opcional)

```javascript
{
  type: 'fingerprint_success',
  cliente: {
    id: 123,
    nombre: 'Juan Pérez',
    telefono: '12345678',
    ...
  },
  score: 85,
  mensaje: '✅ Acceso autorizado: Juan Pérez'
}
```

---

## 🎯 Checklist de Configuración

- [ ] NuevoGym instalado y corriendo
- [ ] Servidor webhook activo en puerto 9000
- [ ] Al menos 1 cliente registrado con huella
- [ ] api.exe compilado con la URL correcta
- [ ] api.exe conectado al sensor ZK
- [ ] Firewall configurado (puerto 9000 abierto)
- [ ] IP de NuevoGym correcta en Program.cs
- [ ] Prueba con curl exitosa
- [ ] Prueba con sensor real exitosa

---

## 📞 Soporte

Si tienes problemas:

1. **Revisa los logs** en la consola de Electron
2. **Verifica la conectividad** con `curl` o Postman
3. **Asegúrate** de que ambas computadoras están en la misma red
4. **Prueba** primero con datos simulados antes de usar el sensor real

