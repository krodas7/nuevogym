const path = require('path');
const { app } = require('electron');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

// Simular el path de userData
const userDataPath = path.join(__dirname, 'test-db');
const dbPath = path.join(userDataPath, 'nuevogym.db');

console.log('🔄 Reseteando usuario admin...');
console.log('📍 Base de datos:', dbPath);

try {
  // Eliminar la base de datos existente
  const fs = require('fs');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('🗑️ Base de datos anterior eliminada');
  }

  // Crear nueva base de datos
  const db = new Database(dbPath);
  
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

  // Crear usuario admin con contraseña hasheada
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  const insertUsuario = db.prepare(`
    INSERT INTO usuarios (usuario, password, nombre_completo, rol, activo)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  insertUsuario.run('admin', hashedPassword, 'Administrador', 'admin', 1);
  
  console.log('✅ Usuario admin creado exitosamente');
  console.log('👤 Usuario: admin');
  console.log('🔑 Contraseña: admin123');
  console.log('🔐 Contraseña hasheada:', hashedPassword.substring(0, 20) + '...');
  
  // Verificar que se creó correctamente
  const usuario = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get('admin');
  console.log('✅ Usuario verificado:', usuario ? 'SÍ' : 'NO');
  
  // Probar login
  const passwordCorrecta = bcrypt.compareSync('admin123', usuario.password);
  console.log('🔐 Login funciona:', passwordCorrecta ? 'SÍ' : 'NO');
  
  db.close();
  console.log('🎉 Reset completado. Ahora puedes usar admin/admin123');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
