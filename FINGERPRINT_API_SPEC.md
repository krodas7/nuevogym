# 🔌 Especificación del API de Sensor de Huellas

Esta documentación describe el API que debe implementar el ejecutable del sensor de huellas (`API.exe`) para integrarse con NuevoGym.

## 📋 Requisitos Generales

- El API debe ejecutarse como servidor HTTP
- Puerto por defecto: **8080** (configurable)
- Protocolo: HTTP (puede ser HTTPS si se configura)
- Base URL: `http://localhost:8080`
- Content-Type: `application/json`

## 🔌 Endpoints Requeridos

### 1. Estado de Conexión

**GET** `/status`

Verifica que el API esté funcionando correctamente.

**Response 200:**
```json
{
  "success": true,
  "message": "API de huellas funcionando correctamente",
  "device_connected": true,
  "version": "1.0.0"
}
```

**Response 500 (Error):**
```json
{
  "success": false,
  "error": "Sensor de huellas no conectado"
}
```

---

### 2. Capturar Huella

**POST** `/capture`

Captura una huella dactilar del sensor y devuelve un ID único.

**Request Body:** (vacío o configuraciones opcionales)
```json
{}
```

**Response 200:**
```json
{
  "success": true,
  "fingerprint_id": "FP_1234567890ABCDEF",
  "quality": 85,
  "message": "Huella capturada exitosamente"
}
```

**Response 400 (Error):**
```json
{
  "success": false,
  "error": "Calidad de huella insuficiente",
  "quality": 45
}
```

**Response 500 (Error):**
```json
{
  "success": false,
  "error": "Sensor no disponible"
}
```

**Notas:**
- El proceso debe esperar hasta que el usuario coloque el dedo
- Timeout recomendado: 30 segundos
- La calidad debe ser mínimo 60/100
- `fingerprint_id` debe ser único y consistente para la misma huella

---

### 3. Verificar Huella

**POST** `/verify`

Verifica si una huella capturada coincide con una huella registrada.

**Request Body:**
```json
{
  "fingerprint_id": "FP_1234567890ABCDEF"
}
```

**Response 200 (Match):**
```json
{
  "success": true,
  "match": true,
  "confidence": 95,
  "message": "Huella verificada exitosamente"
}
```

**Response 200 (No Match):**
```json
{
  "success": true,
  "match": false,
  "confidence": 35,
  "message": "Huella no coincide"
}
```

**Response 400:**
```json
{
  "success": false,
  "error": "fingerprint_id no válido"
}
```

**Notas:**
- Requiere que el usuario coloque el dedo en el sensor
- Compara con la huella del `fingerprint_id` proporcionado
- Timeout: 30 segundos

---

### 4. Identificar Huella

**POST** `/identify`

Captura una huella del sensor y busca en la base de datos interna del dispositivo.

**Request Body:** (vacío)
```json
{}
```

**Response 200 (Identificada):**
```json
{
  "success": true,
  "identified": true,
  "fingerprint_id": "FP_1234567890ABCDEF",
  "confidence": 92,
  "message": "Huella identificada exitosamente"
}
```

**Response 200 (No Identificada):**
```json
{
  "success": true,
  "identified": false,
  "message": "Huella no reconocida en la base de datos"
}
```

**Response 500:**
```json
{
  "success": false,
  "error": "Error al acceder al sensor"
}
```

**Notas:**
- Este es el endpoint más importante para registro de asistencias
- El dispositivo debe mantener una base de datos interna de huellas registradas
- Timeout: 30 segundos
- Confianza mínima recomendada: 80%

---

## 🔧 Implementación Recomendada

### Estructura del Servidor (Ejemplo en Node.js/Express)

```javascript
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// Status
app.get('/status', (req, res) => {
  // Verificar conexión con dispositivo
  const deviceConnected = checkDeviceConnection();
  
  res.json({
    success: true,
    message: 'API de huellas funcionando correctamente',
    device_connected: deviceConnected,
    version: '1.0.0'
  });
});

// Capture
app.post('/capture', async (req, res) => {
  try {
    const result = await captureFingerprintFromDevice();
    
    if (result.quality < 60) {
      return res.status(400).json({
        success: false,
        error: 'Calidad de huella insuficiente',
        quality: result.quality
      });
    }
    
    res.json({
      success: true,
      fingerprint_id: result.id,
      quality: result.quality,
      message: 'Huella capturada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify
app.post('/verify', async (req, res) => {
  try {
    const { fingerprint_id } = req.body;
    
    if (!fingerprint_id) {
      return res.status(400).json({
        success: false,
        error: 'fingerprint_id requerido'
      });
    }
    
    const result = await verifyFingerprintAgainstDevice(fingerprint_id);
    
    res.json({
      success: true,
      match: result.match,
      confidence: result.confidence,
      message: result.match ? 'Huella verificada exitosamente' : 'Huella no coincide'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Identify
app.post('/identify', async (req, res) => {
  try {
    const result = await identifyFingerprintFromDevice();
    
    if (result.identified) {
      res.json({
        success: true,
        identified: true,
        fingerprint_id: result.fingerprint_id,
        confidence: result.confidence,
        message: 'Huella identificada exitosamente'
      });
    } else {
      res.json({
        success: true,
        identified: false,
        message: 'Huella no reconocida en la base de datos'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`API de huellas ejecutándose en puerto ${PORT}`);
});
```

---

## 🧪 Testing del API

### Usando cURL:

```bash
# Test Status
curl http://localhost:8080/status

# Test Capture
curl -X POST http://localhost:8080/capture

# Test Verify
curl -X POST http://localhost:8080/verify \
  -H "Content-Type: application/json" \
  -d '{"fingerprint_id":"FP_TEST123"}'

# Test Identify
curl -X POST http://localhost:8080/identify
```

### Usando Postman:

1. Importa esta colección:

```json
{
  "info": {
    "name": "Fingerprint API Tests"
  },
  "item": [
    {
      "name": "Status",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/status"
      }
    },
    {
      "name": "Capture",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/capture"
      }
    },
    {
      "name": "Identify",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/identify"
      }
    }
  ]
}
```

---

## 🔐 Seguridad (Opcional)

Si deseas agregar seguridad básica:

### API Key Authentication:

**Headers requeridos:**
```
X-API-Key: tu_clave_secreta_aqui
```

**Response 401:**
```json
{
  "success": false,
  "error": "API Key inválida"
}
```

---

## 📝 Notas para Desarrolladores del API.exe

### Consideraciones Importantes:

1. **Timeout**: Todos los endpoints que requieren interacción con el sensor deben tener timeout de 30 segundos
2. **Calidad**: No aceptar huellas con calidad menor a 60/100
3. **IDs únicos**: Los `fingerprint_id` deben ser consistentes - la misma huella debe generar siempre el mismo ID
4. **CORS**: Si el API corre en un puerto diferente, habilita CORS
5. **Logs**: Implementa logging para debugging
6. **Error handling**: Maneja errores del dispositivo gracefully

### Dispositivos Compatibles:

Este API puede implementarse para cualquier sensor de huellas que soporte:
- Digital Persona
- ZKTeco
- Suprema
- Futronic
- Morpho
- Otros sensores con SDK/driver

### Arquitectura Recomendada:

```
┌─────────────────┐
│   NuevoGym      │
│   (Electron)    │
└────────┬────────┘
         │
         │ HTTP
         │
┌────────▼────────┐
│   API.exe       │
│   (Express/     │
│    Python/etc)  │
└────────┬────────┘
         │
         │ SDK/Driver
         │
┌────────▼────────┐
│   Fingerprint   │
│   Device        │
│   (Hardware)    │
└─────────────────┘
```

---

## ✅ Checklist de Implementación

- [ ] Servidor HTTP en puerto 8080
- [ ] Endpoint GET /status
- [ ] Endpoint POST /capture
- [ ] Endpoint POST /verify
- [ ] Endpoint POST /identify
- [ ] Manejo de errores
- [ ] Timeouts implementados
- [ ] Validación de calidad de huella
- [ ] IDs únicos consistentes
- [ ] Logging básico
- [ ] Probado con dispositivo real
- [ ] Documentación de instalación
- [ ] Ejecutable compilado (API.exe)

---

## 📞 Contacto

Para dudas sobre la integración, contacta al equipo de desarrollo de NuevoGym.

