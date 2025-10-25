const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const SerialPort = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const axios = require('axios');
const fs = require('fs');
const http = require('http');
const bcrypt = require('bcryptjs');

let mainWindow;
let db;
let arduinoPort = null;
let webhookServer = null;
let configuracion = {
  puertoCOM: '',
  baudRate: 9600,
  tiempoApertura: 3,
  habilitarChapa: false,
  webhookPort: 9000,
  webhookIP: '192.168.0.5'
};

// Función para inicializar la base de datos
function initDatabase() {
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'nuevogym.db');
  
  console.log('Base de datos inicializada en:', dbPath);
  
  db = new Database(dbPath);
  
  // Crear tabla de clientes
  db.exec(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      telefono TEXT NOT NULL,
      fecha_inicio TEXT NOT NULL,
      fecha_vencimiento TEXT NOT NULL,
      tipo_membresia TEXT NOT NULL,
      estado TEXT DEFAULT 'activo',
      huella_id TEXT,
      foto TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // La tabla se crea con el esquema correcto desde el inicio
  console.log('✅ Base de datos inicializada correctamente');

  // Crear tabla de tipos de membresía
  db.exec(`
    CREATE TABLE IF NOT EXISTS membresias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      duracion_dias INTEGER NOT NULL,
      precio REAL NOT NULL,
      descripcion TEXT,
      activo INTEGER DEFAULT 1
    )
  `);

  // Migración: Agregar columna 'activo' si no existe
  try {
    const columns = db.prepare("PRAGMA table_info(membresias)").all();
    const hasActivo = columns.some(col => col.name === 'activo');
    if (!hasActivo) {
      console.log('🔄 Agregando columna activo a tabla membresias...');
      db.exec('ALTER TABLE membresias ADD COLUMN activo INTEGER DEFAULT 1');
      // Actualizar registros existentes
      db.exec('UPDATE membresias SET activo = 1 WHERE activo IS NULL');
      console.log('✅ Columna activo agregada y datos actualizados');
    }
  } catch (error) {
    console.log('ℹ️ No se pudo verificar/agregar columna activo:', error.message);
  }
  
  // Migración similar para otras tablas si es necesario
  try {
    // Migración para tabla membresias - asegurar que existe
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='membresias'").get();
    if (tableExists) {
      const membershipsColumns = db.prepare("PRAGMA table_info(membresias)").all();
      console.log('📋 Columnas en membresias:', membershipsColumns.map(c => c.name).join(', '));
    }
  } catch (error) {
    console.log('ℹ️ Error al verificar tabla membresias:', error.message);
  }

  // Crear tabla de asistencias
  db.exec(`
    CREATE TABLE IF NOT EXISTS asistencias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      fecha_hora TEXT NOT NULL,
      tipo_entrada TEXT DEFAULT 'entrada',
      metodo_verificacion TEXT DEFAULT 'manual',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `);

  // Crear tabla de pagos
  db.exec(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      monto REAL NOT NULL,
      fecha_pago TEXT NOT NULL,
      tipo_pago TEXT NOT NULL,
      descripcion TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id)
    )
  `);

  // Crear tabla de configuración
  db.exec(`
    CREATE TABLE IF NOT EXISTS configuracion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clave TEXT UNIQUE NOT NULL,
      valor TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre_completo TEXT NOT NULL,
      rol TEXT DEFAULT 'admin',
      activo INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Crear tabla de tickets
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      numero_ticket INTEGER UNIQUE NOT NULL,
      tipo_ticket TEXT NOT NULL,
      cliente_id INTEGER,
      usuario_id INTEGER,
      monto REAL,
      metodo_pago TEXT,
      fecha_generacion DATETIME DEFAULT CURRENT_TIMESTAMP,
      datos_json TEXT,
      FOREIGN KEY (cliente_id) REFERENCES clientes (id),
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `);

  // Crear tabla de auditoría
  db.exec(`
    CREATE TABLE IF NOT EXISTS auditoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER,
      usuario_nombre TEXT,
      accion TEXT NOT NULL,
      modulo TEXT NOT NULL,
      detalles TEXT,
      ip TEXT,
      fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
    )
  `);

  // Insertar datos por defecto si no existen
  const membresiasCount = db.prepare('SELECT COUNT(*) as count FROM membresias').get();
  if (membresiasCount.count === 0) {
    const insertMembresia = db.prepare(`
      INSERT INTO membresias (nombre, duracion_dias, precio, descripcion, activo)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insertMembresia.run('Mensual', 30, 150.0, 'Membresía mensual con acceso completo', 1);
    insertMembresia.run('Trimestral', 90, 400.0, 'Membresía de 3 meses con 10% descuento', 1);
    insertMembresia.run('Semestral', 180, 750.0, 'Membresía de 6 meses con 20% descuento', 1);
    insertMembresia.run('Anual', 365, 1300.0, 'Membresía anual con 30% descuento', 1);
    console.log('✅ Membresías por defecto creadas');
  }

  // Insertar cliente de prueba si no existe
  const clientesCount = db.prepare('SELECT COUNT(*) as count FROM clientes').get();
  if (clientesCount.count === 0) {
    const hoy = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(hoy.getDate() + 30); // 30 días desde hoy
    
    const insertCliente = db.prepare(`
      INSERT INTO clientes (nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado, huella_id, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertCliente.run(
      'Cliente Demo',
      '12345678',
      hoy.toISOString().split('T')[0],
      vencimiento.toISOString().split('T')[0],
      'Mensual',
      'activo',
      null,
      null
    );
    console.log('✅ Cliente de prueba creado');
  }

  // Función para obtener el próximo número de ticket
  global.getNextTicketNumber = function() {
    const result = db.prepare('SELECT MAX(numero_ticket) as max_number FROM tickets').get();
    return (result.max_number || 0) + 1;
  };

  // Insertar usuario admin por defecto si no existe
  const usuariosCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get();
  if (usuariosCount.count === 0) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    const insertUsuario = db.prepare(`
      INSERT INTO usuarios (usuario, password, nombre_completo, rol, activo)
      VALUES (?, ?, ?, ?, ?)
    `);
    insertUsuario.run('admin', hashedPassword, 'Administrador', 'admin', 1);
    console.log('✅ Usuario admin creado con contraseña encriptada');
  }

  // Insertar configuración por defecto
  const configCount = db.prepare('SELECT COUNT(*) as count FROM configuracion').get();
  if (configCount.count === 0) {
    const insertConfig = db.prepare(`
      INSERT INTO configuracion (clave, valor)
      VALUES (?, ?)
    `);
    insertConfig.run('fingerprint_api_url', 'http://localhost:8080');
  }
}

// Función para inicializar el servidor webhook para el sensor de huellas
function initWebhookServer() {
  try {
    // Cerrar servidor anterior si existe
    if (webhookServer) {
      webhookServer.close();
    }

    // Crear servidor HTTP
    webhookServer = http.createServer((req, res) => {
      // Configurar CORS
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
          body += chunk.toString();
        });
        
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            console.log('📡 Datos recibidos del sensor de huellas:', data);
            
            // Procesar datos del sensor
            procesarDatosSensor(data);
            
            // Responder al api.exe
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Datos recibidos correctamente',
              timestamp: new Date().toISOString()
            }));
          } catch (error) {
            console.error('❌ Error al procesar datos del sensor:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              error: error.message 
            }));
          }
        });
      } else if (req.method === 'GET') {
        // Endpoint para verificar que el servidor está funcionando
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'active',
          message: 'Servidor webhook funcionando correctamente',
          port: configuracion.webhookPort,
          timestamp: new Date().toISOString()
        }));
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: false, 
          error: 'Método no permitido' 
        }));
      }
    });

    // Iniciar servidor
    webhookServer.listen(configuracion.webhookPort, '0.0.0.0', () => {
      console.log(`🌐 Servidor webhook iniciado en puerto ${configuracion.webhookPort}`);
      console.log(`📡 Escuchando en: http://${configuracion.webhookIP}:${configuracion.webhookPort}`);
      console.log(`🔗 URL para api.exe: http://${configuracion.webhookIP}:${configuracion.webhookPort}/webhook`);
    });

    webhookServer.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Puerto ${configuracion.webhookPort} ya está en uso`);
      } else {
        console.error('❌ Error en servidor webhook:', error);
      }
    });

  } catch (error) {
    console.error('❌ Error al inicializar servidor webhook:', error);
  }
}

// Función para procesar datos del sensor de huellas
async function procesarDatosSensor(data) {
  try {
    console.log('🔍 Procesando datos del sensor:', data);
    
    // El api.exe envía { template_b64: "..." }
    if (!data.template_b64) {
      console.log('❌ No se recibió template_b64');
      return;
    }
    
    console.log('👆 Huella detectada, comparando con clientes registrados...');
    
    // Obtener todos los clientes con huella registrada
    let clientesConHuella;
    try {
      clientesConHuella = db.prepare("SELECT * FROM clientes WHERE huella_id IS NOT NULL AND huella_id != ''").all();
      console.log(`📋 Clientes con huella en BD: ${clientesConHuella.length}`);
      if (clientesConHuella.length > 0) {
        console.log('📝 Primeros clientes:', clientesConHuella.slice(0, 3).map(c => ({ id: c.id, nombre: c.nombre, tiene_huella: !!c.huella_id })));
      }
    } catch (error) {
      console.error('❌ Error al consultar clientes:', error.message);
      return;
    }
    
    if (clientesConHuella.length === 0) {
      console.log('⚠️ No hay clientes con huella registrada');
      
      if (mainWindow) {
        mainWindow.webContents.send('sensor-data', {
          type: 'no_enrolled_users',
          mensaje: 'No hay clientes con huella registrada'
        });
      }
      return;
    }
    
    console.log(`🔍 Comparando con ${clientesConHuella.length} clientes...`);
    
    // Comparar con cada cliente usando el api.exe
    let clienteEncontrado = null;
    let mejorScore = 0;
    
    for (const cliente of clientesConHuella) {
      try {
        console.log(`🔍 Verificando ${cliente.nombre} (ID: ${cliente.id})...`);
        
        // Verificar templates usando el endpoint /Fingerprint/verifyTemplates
        const response = await axios.post('http://192.168.0.5:9000/Fingerprint/verifyTemplates', {
          enrolled_b64: cliente.huella_id, // Template guardado en DB
          probe_b64: data.template_b64     // Template capturado ahora
        }, { timeout: 5000 });
        
        console.log(`📊 ${cliente.nombre}: score=${response.data.score}, match=${response.data.match}`);
        
        if (response.data.match && response.data.score > mejorScore) {
          mejorScore = response.data.score;
          clienteEncontrado = cliente;
          console.log(`✅ Match encontrado: ${cliente.nombre} (score: ${response.data.score})`);
        }
      } catch (error) {
        console.error(`❌ Error al verificar huella de ${cliente.nombre}:`, error.message);
      }
    }
    
    if (!clienteEncontrado) {
      console.log('❌ Huella no reconocida');
      
      if (mainWindow) {
        mainWindow.webContents.send('sensor-data', {
          type: 'client_not_found',
          mensaje: 'Huella no reconocida'
        });
      }
      return;
    }
    
    console.log(`✅ Cliente identificado: ${clienteEncontrado.nombre} (score: ${mejorScore})`);
    
    // Verificar si la membresía está vigente
    const fechaVencimiento = new Date(clienteEncontrado.fecha_vencimiento);
    const hoy = new Date();
    
    if (fechaVencimiento >= hoy) {
      console.log(`✅ Membresía vigente para ${clienteEncontrado.nombre}`);
      
      // Registrar asistencia
      const insertAsistencia = db.prepare(`
        INSERT INTO asistencias (cliente_id, fecha_hora, tipo_entrada, metodo_verificacion)
        VALUES (?, ?, ?, ?)
      `);
      
      insertAsistencia.run(
        clienteEncontrado.id, 
        new Date().toISOString(), 
        'entrada', 
        'huella_dactilar'
      );
      
      console.log(`📝 Asistencia registrada para ${clienteEncontrado.nombre}`);
      
      // Abrir chapa eléctrica si está habilitada
      if (configuracion.habilitarChapa && arduinoPort && arduinoPort.isOpen) {
        console.log('🔓 Abriendo chapa eléctrica...');
        await abrirChapaElectrica();
      }
      
      // Notificar al frontend
      if (mainWindow) {
        mainWindow.webContents.send('sensor-data', {
          type: 'fingerprint_success',
          cliente: clienteEncontrado,
          score: mejorScore,
          mensaje: `✅ Acceso autorizado: ${clienteEncontrado.nombre}`
        });
      }
    } else {
      console.log(`❌ Membresía vencida para ${clienteEncontrado.nombre}`);
      
      // Notificar al frontend
      if (mainWindow) {
        mainWindow.webContents.send('sensor-data', {
          type: 'membership_expired',
          cliente: clienteEncontrado,
          mensaje: `⚠️ Membresía vencida: ${clienteEncontrado.nombre}`
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error al procesar datos del sensor:', error);
  }
}

// Función para conectar con Arduino
async function conectarArduino(config) {
  try {
    if (arduinoPort && arduinoPort.isOpen) {
      await arduinoPort.close();
    }

    arduinoPort = new SerialPort({
      path: config.puertoCOM,
      baudRate: config.baudRate,
      autoOpen: false
    });

    const parser = arduinoPort.pipe(new ReadlineParser({ delimiter: '\n' }));

    return new Promise((resolve, reject) => {
      arduinoPort.open((error) => {
        if (error) {
          reject(error);
        } else {
          // Verificar conexión - enviar comando de prueba
          setTimeout(() => {
            arduinoPort.write('c', (err) => { // Enviar 'c' para cerrar/probar
              if (err) {
                reject(err);
              } else {
                resolve(true);
              }
            });
          }, 1000);
        }
      });

      parser.on('data', (data) => {
        console.log('Arduino:', data.toString());
      });

      arduinoPort.on('error', (error) => {
        console.error('Error Arduino:', error);
        reject(error);
      });
    });
  } catch (error) {
    throw error;
  }
}

// Función para abrir chapa eléctrica
function abrirChapaElectrica() {
  if (arduinoPort && arduinoPort.isOpen && configuracion.habilitarChapa) {
    // Enviar comando 'o' para abrir la chapa (según tu código Arduino)
    arduinoPort.write('o', (error) => {
      if (error) {
        console.error('Error al abrir chapa:', error);
      } else {
        console.log('Comando "o" enviado al Arduino - Chapa abierta');
      }
    });
  }
}

// Función para crear la ventana principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'NuevoGym - Sistema de Gestión de Gimnasio'
  });

  console.log('🔧 Ruta del preload:', path.join(__dirname, 'preload.js'));
  console.log('🔧 Preload existe?', require('fs').existsSync(path.join(__dirname, 'preload.js')));

  // Cargar la aplicación React
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log('🌐 Cargando desde http://localhost:4000');
    mainWindow.loadURL('http://localhost:4000');
    // DevTools removido - ya no se abre automáticamente
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.on('dom-ready', () => {
    console.log('✅ DOM listo, verificando electronAPI...');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Eventos de la aplicación
app.whenReady().then(() => {
  initDatabase();
  initWebhookServer(); // Iniciar servidor para recibir datos del sensor
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Cerrar puerto Arduino
  if (arduinoPort && arduinoPort.isOpen) {
    arduinoPort.close();
  }
  
  // Cerrar servidor webhook
  if (webhookServer) {
    webhookServer.close();
    console.log('🌐 Servidor webhook cerrado');
  }
  
  if (process.platform !== 'darwin') {
    db.close();
    app.quit();
  }
});

// ==================== IPC Handlers ====================

// CONFIGURACIÓN Y ARDUINO
ipcMain.handle('get-configuracion', async () => {
  try {
    // Obtener la IP del sensor desde la base de datos
    const configIP = db.prepare('SELECT valor FROM configuracion WHERE clave = ?').get('sensor_ip');
    const sensorIP = configIP ? configIP.valor : '192.168.0.5';
    
    return { 
      success: true, 
      data: {
        ...configuracion,
        sensorIP: sensorIP
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('guardar-configuracion', async (event, config) => {
  try {
    configuracion = { ...config };
    
    // Guardar la IP del sensor en la base de datos
    if (config.sensorIP) {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO configuracion (clave, valor)
        VALUES (?, ?)
      `);
      stmt.run('sensor_ip', config.sensorIP);
      console.log(`💾 IP del sensor guardada: ${config.sensorIP}`);
    }
    
    // Si cambió el puerto o configuración, reconectar Arduino
    if (configuracion.habilitarChapa && configuracion.puertoCOM) {
      try {
        await conectarArduino(configuracion);
        console.log('Arduino reconectado con nueva configuración');
      } catch (error) {
        console.error('Error al reconectar Arduino:', error);
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('listar-puertos-com', async () => {
  try {
    const puertos = await SerialPort.list();
    return { success: true, data: puertos };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('probar-conexion-arduino', async (event, config) => {
  try {
    await conectarArduino(config);
    configuracion = { ...config };
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('abrir-chapa-electrica', async () => {
  try {
    abrirChapaElectrica();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// CLIENTES
ipcMain.handle('get-clientes', async () => {
  try {
    const clientes = db.prepare('SELECT * FROM clientes ORDER BY created_at DESC').all();
    return { success: true, data: clientes };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-cliente', async (event, cliente) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO clientes (nombre, telefono, fecha_inicio, fecha_vencimiento, tipo_membresia, estado, foto, huella_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      cliente.nombre,
      cliente.telefono,
      cliente.fecha_inicio,
      cliente.fecha_vencimiento,
      cliente.tipo_membresia,
      'activo',
      cliente.foto || null,
      cliente.huella_id || null
    );
    
    // Registrar en auditoría
    registrarAuditoria(null, 'Sistema', 'CREAR_CLIENTE', 'Clientes', `Cliente registrado: ${cliente.nombre}`);
    
    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-cliente', async (event, id, cliente) => {
  try {
    const stmt = db.prepare(`
      UPDATE clientes SET
        nombre = ?, telefono = ?, fecha_inicio = ?, fecha_vencimiento = ?,
        tipo_membresia = ?, foto = ?, huella_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      cliente.nombre,
      cliente.telefono,
      cliente.fecha_inicio,
      cliente.fecha_vencimiento,
      cliente.tipo_membresia,
      cliente.foto || null,
      cliente.huella_id || null,
      id
    );
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-cliente', async (event, id) => {
  try {
    // No eliminar, solo marcar como inactivo
    db.prepare('UPDATE clientes SET estado = "inactivo" WHERE id = ?').run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ASISTENCIAS
ipcMain.handle('get-asistencias', async () => {
  try {
    const asistencias = db.prepare(`
      SELECT a.*, c.nombre as cliente_nombre 
      FROM asistencias a 
      LEFT JOIN clientes c ON a.cliente_id = c.id 
      ORDER BY a.fecha_hora DESC
    `).all();
    return { success: true, data: asistencias };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('registrar-asistencia', async (event, data) => {
  try {
    // Verificar que el cliente existe y está activo
    const cliente = db.prepare('SELECT * FROM clientes WHERE id = ? AND estado = "activo"').get(data.cliente_id);
    
    if (!cliente) {
      return { success: false, error: 'Cliente no encontrado o inactivo' };
    }
    
    const stmt = db.prepare(`
      INSERT INTO asistencias (cliente_id, fecha_hora, tipo_entrada, metodo_verificacion)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      data.cliente_id,
      data.fecha_hora,
      data.tipo_entrada || 'entrada',
      data.metodo_verificacion || 'manual'
    );
    
    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// MEMBRESÍAS
ipcMain.handle('get-membresias', async () => {
  try {
    const membresias = db.prepare('SELECT * FROM membresias WHERE activo = 1 ORDER BY duracion_dias').all();
    return { success: true, data: membresias };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-membresia', async (event, membresia) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO membresias (nombre, duracion_dias, precio, descripcion, activo)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      membresia.nombre,
      membresia.duracion_dias,
      membresia.precio,
      membresia.descripcion || null,
      membresia.activo
    );
    
    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-membresia', async (event, id, membresia) => {
  try {
    const stmt = db.prepare(`
      UPDATE membresias SET
        nombre = ?, duracion_dias = ?, precio = ?,
        descripcion = ?, activo = ?
      WHERE id = ?
    `);
    
    stmt.run(
      membresia.nombre,
      membresia.duracion_dias,
      membresia.precio,
      membresia.descripcion || null,
      membresia.activo,
      id
    );
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-membresia', async (event, id) => {
  try {
    // En lugar de eliminar, marcamos como inactiva
    db.prepare('UPDATE membresias SET activo = 0 WHERE id = ?').run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ESTADÍSTICAS
ipcMain.handle('get-estadisticas', async () => {
  try {
    // Verificar si la tabla clientes existe
    const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='clientes'").get();
    if (!tableExists) {
      return { 
        success: true, 
        data: {
          totalClientes: 0,
          clientesActivos: 0,
          clientesVencidos: 0,
          membresiasProximasVencer: 0,
          clientesProximosVencer: [],
          asistenciasHoy: 0,
          asistenciasSemana: [],
          ingresosHoy: 0,
          ingresosMes: 0
        }
      };
    }

    // Total de clientes
    const totalClientes = db.prepare('SELECT COUNT(*) as count FROM clientes').get();
    
    // Clientes activos (con membresía vigente)
    const clientesActivos = db.prepare(
      "SELECT COUNT(*) as count FROM clientes WHERE fecha_vencimiento >= DATE('now')"
    ).get();
    
    // Clientes vencidos
    const clientesVencidos = db.prepare(
      "SELECT COUNT(*) as count FROM clientes WHERE fecha_vencimiento < DATE('now')"
    ).get();
    
    // Membresías próximas a vencer (7 días)
    const membresiasProximasVencer = db.prepare(`
      SELECT COUNT(*) as count FROM clientes 
      WHERE fecha_vencimiento >= DATE('now') 
      AND fecha_vencimiento <= DATE('now', '+7 days')
    `).get();
    
    // Clientes próximos a vencer (detalle)
    const clientesProximosVencer = db.prepare(`
      SELECT id, nombre, telefono, tipo_membresia, fecha_vencimiento
      FROM clientes 
      WHERE fecha_vencimiento >= DATE('now') 
      AND fecha_vencimiento <= DATE('now', '+7 days')
      ORDER BY fecha_vencimiento ASC
    `).all();
    // Asistencias de hoy
    const asistenciasHoy = db.prepare(`
      SELECT COUNT(*) as count FROM asistencias 
      WHERE DATE(fecha_hora) = DATE('now')
    `).get();
    
    // Asistencias de la semana
    const asistenciasSemana = db.prepare(`
      SELECT DATE(fecha_hora) as fecha, COUNT(*) as count
      FROM asistencias 
      WHERE DATE(fecha_hora) >= DATE('now', '-6 days')
      GROUP BY DATE(fecha_hora)
      ORDER BY fecha ASC
    `).all();
    
    // Ingresos de hoy
    const ingresosHoy = db.prepare(`
      SELECT COALESCE(SUM(monto), 0) as total FROM pagos 
      WHERE DATE(fecha_pago) = DATE('now')
    `).get();
    
    // Ingresos del mes
    const ingresosMes = db.prepare(`
      SELECT COALESCE(SUM(monto), 0) as total FROM pagos 
      WHERE strftime('%Y-%m', fecha_pago) = strftime('%Y-%m', 'now')
    `).get();
    
    return {
      success: true,
      data: {
        totalClientes: totalClientes.count,
        clientesActivos: clientesActivos.count,
        clientesVencidos: clientesVencidos.count,
        membresiasProximasVencer: membresiasProximasVencer.count,
        clientesProximosVencer: clientesProximosVencer,
        asistenciasHoy: asistenciasHoy.count,
        asistenciasSemana: asistenciasSemana,
        ingresosHoy: ingresosHoy.total,
        ingresosMes: ingresosMes.total
      }
    };
  } catch (error) {
    console.error('❌ Error en get-estadisticas:', error);
    return { success: false, error: error.message };
  }
});

// PAGOS
ipcMain.handle('get-pagos', async () => {
  try {
    const pagos = db.prepare(`
      SELECT p.*, c.nombre as cliente_nombre 
      FROM pagos p 
      LEFT JOIN clientes c ON p.cliente_id = c.id 
      ORDER BY p.fecha_pago DESC
    `).all();
    return { success: true, data: pagos };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-pago', async (event, pago) => {
  try {
    const stmt = db.prepare(`
      INSERT INTO pagos (cliente_id, monto, fecha_pago, tipo_pago, descripcion)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      pago.cliente_id,
      pago.monto,
      pago.fecha_pago,
      pago.tipo_pago,
      pago.descripcion || null
    );
    
    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// SENSOR DE HUELLAS
ipcMain.handle('fingerprint-enroll', async (event, data) => {
  try {
    const config = db.prepare('SELECT valor FROM configuracion WHERE clave = ?').get('fingerprint_api_url');
    
    if (!config) {
      return { success: false, error: 'No se ha configurado la URL del API de huellas' };
    }
    
    const response = await axios.post(`${config.valor}/enroll`, {
      fingerprint_id: data.fingerprint_id
    }, { timeout: 30000 });
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al registrar huella: ' + error.message };
  }
});

ipcMain.handle('fingerprint-identify', async () => {
  try {
    const config = db.prepare('SELECT valor FROM configuracion WHERE clave = ?').get('fingerprint_api_url');
    
    if (!config) {
      return { success: false, error: 'No se ha configurado la URL del API de huellas' };
    }
    
    // Identificar huella (buscar en la base de datos)
    const response = await axios.post(`${config.valor}/identify`, {}, { timeout: 30000 });
    
    if (response.data.success && response.data.fingerprint_id) {
      // Buscar cliente por huella_id
      const cliente = db.prepare('SELECT * FROM clientes WHERE huella_id = ? AND estado = "activo"').get(response.data.fingerprint_id);
      
      if (cliente) {
        // Verificar que la membresía esté vigente
        const fechaVencimiento = new Date(cliente.fecha_vencimiento);
        const hoy = new Date();
        
        if (fechaVencimiento >= hoy) {
          // Usuario autorizado - abrir chapa eléctrica
          if (configuracion.habilitarChapa) {
            abrirChapaElectrica();
            console.log(`Chapa abierta para: ${cliente.nombre}`);
          }
          
          // Registrar asistencia automáticamente
          const fechaHora = new Date().toISOString();
          const insertAsistencia = db.prepare(`
            INSERT INTO asistencias (cliente_id, fecha_hora, tipo_entrada, metodo_verificacion)
            VALUES (?, ?, ?, ?)
          `);
          insertAsistencia.run(cliente.id, fechaHora, 'entrada', 'huella_dactilar');
          
          return { 
            success: true, 
            data: { ...response.data, cliente },
            mensaje: 'Acceso autorizado - Chapa abierta'
          };
        } else {
          return { 
            success: false, 
            error: 'Membresía vencida - Renovar para acceder',
            data: { ...response.data, cliente }
          };
        }
      } else {
        return { success: false, error: 'Usuario no encontrado o inactivo' };
      }
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error al identificar huella: ' + error.message };
  }
});

// CONFIGURACIÓN DEL SENSOR
ipcMain.handle('get-fingerprint-config', async () => {
  try {
    const config = db.prepare('SELECT valor FROM configuracion WHERE clave = ?').get('fingerprint_api_url');
    return { success: true, data: { url: config ? config.valor : '' } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-fingerprint-config', async (event, data) => {
  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO configuracion (clave, valor)
      VALUES (?, ?)
    `);
    stmt.run('fingerprint_api_url', data.url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('test-fingerprint-connection', async (event, data) => {
  try {
    const response = await axios.get(`${data.url}/status`, { timeout: 5000 });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: 'Error de conexión: ' + error.message };
  }
});

// CAPTURAR HUELLA (para registro de clientes)
ipcMain.handle('fingerprint-capture', async () => {
  try {
    console.log('📸 Iniciando captura de huella...');
    
    // Obtener la configuración de la IP del sensor
    const configIP = db.prepare('SELECT valor FROM configuracion WHERE clave = ?').get('sensor_ip');
    const sensorIP = configIP ? configIP.valor : '192.168.0.5'; // IP por defecto
    
    console.log(`🔗 Conectando al sensor en: http://${sensorIP}:9000`);
    
    // Llamar al endpoint /Fingerprint/captureWait del api.exe
    const response = await axios.post(`http://${sensorIP}:9000/Fingerprint/captureWait`, {
      timeoutMs: 15000 // 15 segundos de espera para colocar el dedo
    }, { 
      timeout: 20000 // Timeout HTTP de 20 segundos
    });
    
    console.log('✅ Huella capturada:', response.data);
    
    return { 
      success: true, 
      data: {
        template_b64: response.data.template_b64
      }
    };
  } catch (error) {
    console.error('❌ Error al capturar huella:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      return { 
        success: false, 
        error: 'No se puede conectar al sensor. Verifica:\n1. Que api.exe esté corriendo en la computadora del sensor\n2. Que la IP del sensor esté correcta en Configuración\n3. Que ambas computadoras estén en la misma red' 
      };
    }
    
    return { 
      success: false, 
      error: error.response?.data || error.message || 'Error al capturar huella'
    };
  }
});

// Handler para generar tickets
ipcMain.handle('generate-ticket', async (event, ticketData) => {
  try {
    const numeroTicket = getNextTicketNumber();
    
    const insertTicket = db.prepare(`
      INSERT INTO tickets (numero_ticket, tipo_ticket, cliente_id, usuario_id, monto, metodo_pago, datos_json)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertTicket.run(
      numeroTicket,
      ticketData.tipo,
      ticketData.cliente_id || null,
      ticketData.usuario_id || null,
      ticketData.monto || 0,
      ticketData.metodo_pago || '',
      JSON.stringify(ticketData)
    );
    
    return {
      success: true,
      data: {
        numero_ticket: numeroTicket,
        ...ticketData
      }
    };
  } catch (error) {
    console.error('Error al generar ticket:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Obtener todos los tickets
ipcMain.handle('get-tickets', async () => {
  try {
    const tickets = db.prepare(`
      SELECT * FROM tickets
      ORDER BY fecha_generacion DESC
    `).all();
    
    return {
      success: true,
      data: tickets
    };
  } catch (error) {
    console.error('Error al obtener tickets:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// Insertar datos de prueba
ipcMain.handle('insert-test-data', async () => {
  try {
    const fs = require('fs');
    const sqlPath = path.join(__dirname, '../datos-prueba.sql');
    
    if (!fs.existsSync(sqlPath)) {
      return {
        success: false,
        error: 'Archivo datos-prueba.sql no encontrado'
      };
    }
    
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Ejecutar el SQL
    db.exec(sqlContent);
    
    console.log('✅ Datos de prueba insertados correctamente');
    
    return {
      success: true,
      message: 'Datos de prueba insertados correctamente'
    };
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    return {
      success: false,
      error: error.message
    };
  }
});

// AUTENTICACIÓN
// Función para registrar auditoría
function registrarAuditoria(usuario_id, usuario_nombre, accion, modulo, detalles = null) {
  try {
    const stmt = db.prepare(`
      INSERT INTO auditoria (usuario_id, usuario_nombre, accion, modulo, detalles)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(usuario_id, usuario_nombre, accion, modulo, detalles);
  } catch (error) {
    console.error('Error al registrar auditoría:', error);
  }
}

ipcMain.handle('login', async (event, usuario, password) => {
  try {
    const user = db.prepare(`
      SELECT id, usuario, password, nombre_completo, rol, activo 
      FROM usuarios 
      WHERE usuario = ? AND activo = 1
    `).get(usuario);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      // Registrar login en auditoría
      registrarAuditoria(user.id, user.nombre_completo, 'LOGIN', 'Sistema', 'Inicio de sesión exitoso');
      
      // No devolver la contraseña
      const { password: _, ...userSinPassword } = user;
      return { success: true, data: userSinPassword };
    } else {
      // Registrar intento fallido
      registrarAuditoria(null, usuario, 'LOGIN_FALLIDO', 'Sistema', 'Intento de inicio de sesión fallido');
      return { success: false, error: 'Credenciales inválidas' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('cambiar-password', async (event, usuarioId, nuevaPassword) => {
  try {
    const hashedPassword = bcrypt.hashSync(nuevaPassword, 10);
    const stmt = db.prepare('UPDATE usuarios SET password = ? WHERE id = ?');
    stmt.run(hashedPassword, usuarioId);
    
    // Registrar cambio de contraseña en auditoría
    const user = db.prepare('SELECT nombre_completo FROM usuarios WHERE id = ?').get(usuarioId);
    registrarAuditoria(usuarioId, user.nombre_completo, 'CAMBIO_PASSWORD', 'Usuarios', 'Cambio de contraseña');
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// USUARIOS
ipcMain.handle('get-usuarios', async () => {
  try {
    const usuarios = db.prepare('SELECT id, usuario, nombre_completo, rol, activo FROM usuarios').all();
    return { success: true, data: usuarios };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-usuario', async (event, usuario) => {
  try {
    const hashedPassword = bcrypt.hashSync(usuario.password, 10);
    const stmt = db.prepare(`
      INSERT INTO usuarios (usuario, password, nombre_completo, rol, activo)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      usuario.usuario,
      hashedPassword,
      usuario.nombre_completo,
      usuario.rol,
      usuario.activo ? 1 : 0
    );
    
    // Registrar creación en auditoría
    registrarAuditoria(null, 'Sistema', 'CREAR_USUARIO', 'Usuarios', `Usuario creado: ${usuario.usuario}`);
    
    return { success: true, data: { id: result.lastInsertRowid } };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('update-usuario', async (event, id, usuario) => {
  try {
    let query, params;
    
    // Si viene nueva contraseña, actualizarla con hash
    if (usuario.password) {
      const hashedPassword = bcrypt.hashSync(usuario.password, 10);
      query = `
        UPDATE usuarios SET
          usuario = ?, password = ?, nombre_completo = ?, rol = ?, activo = ?
        WHERE id = ?
      `;
      params = [
        usuario.usuario,
        hashedPassword,
        usuario.nombre_completo,
        usuario.rol,
        usuario.activo ? 1 : 0,
        id
      ];
    } else {
      query = `
        UPDATE usuarios SET
          usuario = ?, nombre_completo = ?, rol = ?, activo = ?
        WHERE id = ?
      `;
      params = [
        usuario.usuario,
        usuario.nombre_completo,
        usuario.rol,
        usuario.activo ? 1 : 0,
        id
      ];
    }
    
    const stmt = db.prepare(query);
    stmt.run(...params);
    
    // Registrar actualización en auditoría
    registrarAuditoria(null, 'Sistema', 'ACTUALIZAR_USUARIO', 'Usuarios', `Usuario actualizado: ${usuario.usuario}`);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-usuario', async (event, id) => {
  try {
    // No eliminar, solo desactivar
    db.prepare('UPDATE usuarios SET activo = 0 WHERE id = ?').run(id);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// BACKUP DE BASE DE DATOS
ipcMain.handle('backup-database', async (event) => {
  try {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'nuevogym.db');
    
    // Verificar que la base de datos existe
    if (!fs.existsSync(dbPath)) {
      return { success: false, error: 'Base de datos no encontrada' };
    }
    
    // Crear nombre de archivo con fecha y hora
    const fecha = new Date();
    const fechaStr = fecha.toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_');
    const fileName = `nuevogym_backup_${fechaStr}.db`;
    
    // Mostrar diálogo para guardar archivo
    const result = await dialog.showSaveDialog(mainWindow, {
      title: 'Guardar copia de seguridad de la base de datos',
      defaultPath: fileName,
      filters: [
        { name: 'Base de datos SQLite', extensions: ['db'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (result.canceled) {
      return { success: false, error: 'Operación cancelada por el usuario' };
    }
    
    // Copiar archivo de base de datos
    fs.copyFileSync(dbPath, result.filePath);
    
    return { 
      success: true, 
      message: 'Copia de seguridad creada exitosamente',
      filePath: result.filePath
    };
  } catch (error) {
    console.error('Error al crear backup:', error);
    return { success: false, error: 'Error al crear copia de seguridad: ' + error.message };
  }
});

ipcMain.handle('restore-database', async (event) => {
  try {
    // Mostrar diálogo para seleccionar archivo
    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Restaurar base de datos desde copia de seguridad',
      filters: [
        { name: 'Base de datos SQLite', extensions: ['db'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ],
      properties: ['openFile']
    });
    
    if (result.canceled) {
      return { success: false, error: 'Operación cancelada por el usuario' };
    }
    
    const backupPath = result.filePaths[0];
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'nuevogym.db');
    
    // Verificar que el archivo de backup existe
    if (!fs.existsSync(backupPath)) {
      return { success: false, error: 'Archivo de copia de seguridad no encontrado' };
    }
    
    // Cerrar la base de datos actual
    if (db) {
      db.close();
    }
    
    // Crear copia de seguridad de la base actual (por si acaso)
    const backupCurrentPath = path.join(userDataPath, `nuevogym_backup_before_restore_${Date.now()}.db`);
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupCurrentPath);
    }
    
    // Restaurar desde el backup
    fs.copyFileSync(backupPath, dbPath);
    
    // Reinicializar la base de datos
    initDatabase();
    
    return { 
      success: true, 
      message: 'Base de datos restaurada exitosamente',
      backupCurrentPath: backupCurrentPath
    };
  } catch (error) {
    console.error('Error al restaurar backup:', error);
    return { success: false, error: 'Error al restaurar base de datos: ' + error.message };
  }
});

ipcMain.handle('get-database-info', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'nuevogym.db');
    
    if (!fs.existsSync(dbPath)) {
      return { 
        success: true, 
        data: { 
          exists: false, 
          size: 0, 
          lastModified: null,
          path: dbPath
        }
      };
    }
    
    const stats = fs.statSync(dbPath);
    
    // Obtener estadísticas de la base de datos
    const totalClientes = db.prepare('SELECT COUNT(*) as count FROM clientes').get();
    const totalAsistencias = db.prepare('SELECT COUNT(*) as count FROM asistencias').get();
    const totalPagos = db.prepare('SELECT COUNT(*) as count FROM pagos').get();
    const totalUsuarios = db.prepare('SELECT COUNT(*) as count FROM usuarios').get();
    
    return { 
      success: true, 
      data: { 
        exists: true,
        size: stats.size,
        lastModified: stats.mtime,
        path: dbPath,
        statistics: {
          clientes: totalClientes.count,
          asistencias: totalAsistencias.count,
          pagos: totalPagos.count,
          usuarios: totalUsuarios.count
        }
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
});