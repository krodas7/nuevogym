const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');

// Usar sqlite3 en lugar de better-sqlite3 para evitar compilación
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: false // Para desarrollo
}));
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Configuración de base de datos para Windows
const dbPath = process.platform === 'win32' 
  ? path.join(process.env.APPDATA, 'NuevoGym', 'database.db')
  : path.join(process.env.HOME || process.env.USERPROFILE, '.nuevogym', 'database.db');

// Crear directorio si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializar base de datos
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
  } else {
    console.log('✅ Base de datos conectada:', dbPath);
    initDatabase();
  }
});

// Función para ejecutar queries de forma síncrona
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
};

const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Inicializar tablas
const initDatabase = async () => {
  try {
    // Tabla de usuarios
    await runQuery(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'usuario',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de clientes
    await runQuery(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT 1
      )
    `);

    // Tabla de tipos de membresía
    await runQuery(`
      CREATE TABLE IF NOT EXISTS tipos_membresia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        duracion_dias INTEGER NOT NULL,
        activo BOOLEAN DEFAULT 1
      )
    `);

    // Tabla de membresías
    await runQuery(`
      CREATE TABLE IF NOT EXISTS membresias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        tipo_membresia_id INTEGER NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_vencimiento DATE NOT NULL,
        precio_pagado DECIMAL(10,2) NOT NULL,
        activa BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id),
        FOREIGN KEY (tipo_membresia_id) REFERENCES tipos_membresia (id)
      )
    `);

    // Tabla de asistencias
    await runQuery(`
      CREATE TABLE IF NOT EXISTS asistencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id)
      )
    `);

    // Tabla de pagos
    await runQuery(`
      CREATE TABLE IF NOT EXISTS pagos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        membresia_id INTEGER,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago TEXT NOT NULL,
        fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
        observaciones TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id),
        FOREIGN KEY (membresia_id) REFERENCES membresias (id)
      )
    `);

    // Tabla de tickets
    await runQuery(`
      CREATE TABLE IF NOT EXISTS tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numero_ticket TEXT UNIQUE NOT NULL,
        cliente_id INTEGER,
        tipo TEXT NOT NULL,
        monto DECIMAL(10,2) NOT NULL,
        metodo_pago TEXT NOT NULL,
        fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
        observaciones TEXT,
        FOREIGN KEY (cliente_id) REFERENCES clientes (id)
      )
    `);

    // Insertar usuario admin por defecto si no existe
    const adminExists = await getQuery('SELECT COUNT(*) as count FROM usuarios WHERE username = ?', ['admin']);
    if (adminExists.count === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await runQuery('INSERT INTO usuarios (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin']);
      console.log('✅ Usuario admin creado');
    }

    // Insertar tipos de membresía por defecto
    const tiposExists = await getQuery('SELECT COUNT(*) as count FROM tipos_membresia');
    if (tiposExists.count === 0) {
      await runQuery('INSERT INTO tipos_membresia (nombre, precio, duracion_dias) VALUES (?, ?, ?)', ['Mensual', 1500, 30]);
      await runQuery('INSERT INTO tipos_membresia (nombre, precio, duracion_dias) VALUES (?, ?, ?)', ['Trimestral', 4000, 90]);
      await runQuery('INSERT INTO tipos_membresia (nombre, precio, duracion_dias) VALUES (?, ?, ?)', ['Anual', 15000, 365]);
      console.log('✅ Tipos de membresía creados');
    }

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  }
};

// API Routes

// Autenticación
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await getQuery('SELECT * FROM usuarios WHERE username = ?', [username]);
    
    if (user && bcrypt.compareSync(password, user.password)) {
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.json({ success: false, error: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await allQuery('SELECT * FROM clientes WHERE activo = 1 ORDER BY nombre');
    res.json(clientes);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/clientes', async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;
    const result = await runQuery('INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)', [nombre, telefono, email]);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

app.put('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body;
    await runQuery('UPDATE clientes SET nombre = ?, telefono = ?, email = ? WHERE id = ?', [nombre, telefono, email, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error actualizando cliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await runQuery('UPDATE clientes SET activo = 0 WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando cliente:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Tipos de membresía
app.get('/api/tipos-membresia', async (req, res) => {
  try {
    const tipos = await allQuery('SELECT * FROM tipos_membresia WHERE activo = 1 ORDER BY nombre');
    res.json(tipos);
  } catch (error) {
    console.error('Error obteniendo tipos de membresía:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/tipos-membresia', async (req, res) => {
  try {
    const { nombre, precio, duracion_dias } = req.body;
    const result = await runQuery('INSERT INTO tipos_membresia (nombre, precio, duracion_dias) VALUES (?, ?, ?)', [nombre, precio, duracion_dias]);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creando tipo de membresía:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Membresías
app.get('/api/membresias', async (req, res) => {
  try {
    const membresias = await allQuery(`
      SELECT m.*, c.nombre as cliente_nombre, tm.nombre as tipo_nombre, tm.precio as tipo_precio
      FROM membresias m
      JOIN clientes c ON m.cliente_id = c.id
      JOIN tipos_membresia tm ON m.tipo_membresia_id = tm.id
      WHERE m.activa = 1
      ORDER BY m.fecha_vencimiento DESC
    `);
    res.json(membresias);
  } catch (error) {
    console.error('Error obteniendo membresías:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/membresias', async (req, res) => {
  try {
    const { cliente_id, tipo_membresia_id, fecha_inicio, fecha_vencimiento, precio_pagado } = req.body;
    const result = await runQuery('INSERT INTO membresias (cliente_id, tipo_membresia_id, fecha_inicio, fecha_vencimiento, precio_pagado) VALUES (?, ?, ?, ?, ?)', [cliente_id, tipo_membresia_id, fecha_inicio, fecha_vencimiento, precio_pagado]);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creando membresía:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Asistencias
app.get('/api/asistencias', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    let query = `
      SELECT a.*, c.nombre as cliente_nombre
      FROM asistencias a
      JOIN clientes c ON a.cliente_id = c.id
    `;
    
    if (fecha_inicio && fecha_fin) {
      query += ' WHERE DATE(a.fecha_hora) BETWEEN ? AND ?';
      const asistencias = await allQuery(query, [fecha_inicio, fecha_fin]);
      res.json(asistencias);
    } else {
      query += ' ORDER BY a.fecha_hora DESC LIMIT 100';
      const asistencias = await allQuery(query);
      res.json(asistencias);
    }
  } catch (error) {
    console.error('Error obteniendo asistencias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Pagos
app.get('/api/pagos', async (req, res) => {
  try {
    const pagos = await allQuery(`
      SELECT p.*, c.nombre as cliente_nombre
      FROM pagos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.fecha_pago DESC
    `);
    res.json(pagos);
  } catch (error) {
    console.error('Error obteniendo pagos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/pagos', async (req, res) => {
  try {
    const { cliente_id, membresia_id, monto, metodo_pago, observaciones } = req.body;
    const result = await runQuery('INSERT INTO pagos (cliente_id, membresia_id, monto, metodo_pago, observaciones) VALUES (?, ?, ?, ?, ?)', [cliente_id, membresia_id, monto, metodo_pago, observaciones]);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creando pago:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Tickets
app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await allQuery(`
      SELECT t.*, c.nombre as cliente_nombre
      FROM tickets t
      LEFT JOIN clientes c ON t.cliente_id = c.id
      ORDER BY t.fecha_emision DESC
    `);
    res.json(tickets);
  } catch (error) {
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/tickets', async (req, res) => {
  try {
    const { numero_ticket, cliente_id, tipo, monto, metodo_pago, observaciones } = req.body;
    const result = await runQuery('INSERT INTO tickets (numero_ticket, cliente_id, tipo, monto, metodo_pago, observaciones) VALUES (?, ?, ?, ?, ?, ?)', [numero_ticket, cliente_id, tipo, monto, metodo_pago, observaciones]);
    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error creando ticket:', error);
    res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Reportes
app.get('/api/reportes/ingresos', async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const query = `
      SELECT 
        DATE(fecha_pago) as fecha,
        SUM(monto) as total
      FROM pagos 
      WHERE DATE(fecha_pago) BETWEEN ? AND ?
      GROUP BY DATE(fecha_pago)
      ORDER BY fecha DESC
    `;
    const ingresos = await allQuery(query, [fecha_inicio, fecha_fin]);
    res.json(ingresos);
  } catch (error) {
    console.error('Error obteniendo reporte de ingresos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Configuración
app.get('/api/config', (req, res) => {
  res.json({
    platform: process.platform,
    database: dbPath,
    version: '1.0.0'
  });
});

// Servir React app para todas las rutas no API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servidor...');
  db.close((err) => {
    if (err) {
      console.error('Error cerrando base de datos:', err.message);
    } else {
      console.log('✅ Base de datos cerrada');
    }
    process.exit(0);
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor NuevoGym iniciado en puerto ${PORT}`);
  console.log(`🌐 Accede a: http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${dbPath}`);
  console.log(`🖥️  Plataforma: ${process.platform}`);
});
