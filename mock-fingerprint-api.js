/**
 * Mock API del Sensor de Huellas
 * 
 * Este es un servidor de prueba para simular el API.exe del sensor de huellas.
 * Úsalo para desarrollo y testing sin necesidad del hardware real.
 * 
 * Uso:
 *   node mock-fingerprint-api.js
 * 
 * El servidor correrá en http://localhost:8080
 */

const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// Base de datos simulada de huellas
const fingerprintDatabase = [
  { id: 'FP_DEMO_001', name: 'Juan Pérez' },
  { id: 'FP_DEMO_002', name: 'María García' },
  { id: 'FP_DEMO_003', name: 'Carlos López' }
];

let captureCounter = 0;

// Middleware para logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// GET /status - Verificar estado
app.get('/status', (req, res) => {
  console.log('✅ Status check - Dispositivo conectado (simulado)');
  
  res.json({
    success: true,
    message: 'API de huellas funcionando correctamente (MOCK)',
    device_connected: true,
    version: '1.0.0-mock',
    registered_fingerprints: fingerprintDatabase.length
  });
});

// POST /capture - Capturar huella
app.post('/capture', async (req, res) => {
  console.log('📸 Capturando huella...');
  
  // Simular delay del sensor
  await sleep(2000);
  
  captureCounter++;
  const newFingerprintId = `FP_CAPTURED_${Date.now()}_${captureCounter}`;
  const quality = Math.floor(Math.random() * 30) + 70; // 70-100
  
  console.log(`✅ Huella capturada: ${newFingerprintId} (calidad: ${quality})`);
  
  // Agregar a la base de datos simulada
  fingerprintDatabase.push({
    id: newFingerprintId,
    name: `Cliente ${captureCounter}`
  });
  
  res.json({
    success: true,
    fingerprint_id: newFingerprintId,
    quality: quality,
    message: 'Huella capturada exitosamente'
  });
});

// POST /verify - Verificar huella
app.post('/verify', async (req, res) => {
  const { fingerprint_id } = req.body;
  
  console.log(`🔍 Verificando huella: ${fingerprint_id}`);
  
  if (!fingerprint_id) {
    return res.status(400).json({
      success: false,
      error: 'fingerprint_id requerido'
    });
  }
  
  // Simular delay del sensor
  await sleep(2000);
  
  // Buscar en la base de datos
  const found = fingerprintDatabase.find(fp => fp.id === fingerprint_id);
  const confidence = found ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40) + 20;
  
  console.log(`${found ? '✅' : '❌'} Verificación: ${found ? 'Match' : 'No match'} (confianza: ${confidence})`);
  
  res.json({
    success: true,
    match: !!found,
    confidence: confidence,
    message: found ? 'Huella verificada exitosamente' : 'Huella no coincide'
  });
});

// POST /identify - Identificar huella
app.post('/identify', async (req, res) => {
  console.log('🔎 Identificando huella desde sensor...');
  
  // Simular delay del sensor
  await sleep(2500);
  
  // Simular identificación aleatoria (80% de éxito)
  const identified = Math.random() > 0.2;
  
  if (identified && fingerprintDatabase.length > 0) {
    // Seleccionar una huella aleatoria de la base de datos
    const randomIndex = Math.floor(Math.random() * fingerprintDatabase.length);
    const identifiedFingerprint = fingerprintDatabase[randomIndex];
    const confidence = Math.floor(Math.random() * 20) + 80; // 80-100
    
    console.log(`✅ Huella identificada: ${identifiedFingerprint.id} (${identifiedFingerprint.name}) - confianza: ${confidence}`);
    
    res.json({
      success: true,
      identified: true,
      fingerprint_id: identifiedFingerprint.id,
      confidence: confidence,
      message: 'Huella identificada exitosamente'
    });
  } else {
    console.log('❌ Huella no reconocida en la base de datos');
    
    res.json({
      success: true,
      identified: false,
      message: 'Huella no reconocida en la base de datos'
    });
  }
});

// Helper para simular delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔌 Mock API de Sensor de Huellas');
  console.log('='.repeat(60));
  console.log(`✅ Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`📊 Huellas registradas: ${fingerprintDatabase.length}`);
  console.log('\nEndpoints disponibles:');
  console.log(`  GET  /status     - Verificar estado del dispositivo`);
  console.log(`  POST /capture    - Capturar nueva huella`);
  console.log(`  POST /verify     - Verificar huella específica`);
  console.log(`  POST /identify   - Identificar huella desde sensor`);
  console.log('\n⚠️  Esto es un servidor MOCK para desarrollo/testing');
  console.log('    No requiere hardware real de sensor de huellas\n');
  console.log('='.repeat(60) + '\n');
});

// Manejo de errores
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
});

process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor Mock API...');
  process.exit(0);
});

