// Script para resetear usuario admin en Windows/Mac
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const os = require('os');

// Determinar ruta de la base de datos según el sistema operativo
let dbPath;
if (process.platform === 'win32') {
  dbPath = path.join(process.env.APPDATA, 'nuevogym', 'nuevogym.db');
} else if (process.platform === 'darwin') {
  dbPath = path.join(os.homedir(), 'Library', 'Application Support', 'nuevogym', 'nuevogym.db');
} else {
  dbPath = path.join(os.homedir(), '.config', 'nuevogym', 'nuevogym.db');
}

console.log('\n========================================');
console.log('   RESETEAR USUARIO ADMIN');
console.log('========================================\n');
console.log('📂 Ruta de base de datos:', dbPath);
console.log('');

try {
  const db = new Database(dbPath);
  
  // Verificar si existe la tabla usuarios
  const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='usuarios'").get();
  
  if (!tableExists) {
    console.log('⚠️  Tabla usuarios no existe. Creándola...');
    db.exec(`
      CREATE TABLE usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nombre_completo TEXT NOT NULL,
        rol TEXT DEFAULT 'admin',
        activo INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  // Eliminar usuario admin si existe
  const deleteStmt = db.prepare('DELETE FROM usuarios WHERE usuario = ?');
  const deleted = deleteStmt.run('admin');
  
  if (deleted.changes > 0) {
    console.log('🗑️  Usuario admin anterior eliminado');
  }
  
  // Crear nuevo usuario admin con contraseña hasheada
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  const insertStmt = db.prepare(`
    INSERT INTO usuarios (usuario, password, nombre_completo, rol, activo)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  insertStmt.run('admin', hashedPassword, 'Administrador', 'admin', 1);
  
  console.log('✅ Usuario admin creado correctamente\n');
  console.log('========================================');
  console.log('   CREDENCIALES');
  console.log('========================================');
  console.log('Usuario: admin');
  console.log('Contraseña: admin123');
  console.log('Rol: Administrador');
  console.log('========================================\n');
  
  // Verificar que se creó correctamente
  const user = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get('admin');
  
  if (user) {
    console.log('✅ Verificación exitosa:');
    console.log('   ID:', user.id);
    console.log('   Usuario:', user.usuario);
    console.log('   Nombre:', user.nombre_completo);
    console.log('   Rol:', user.rol);
    console.log('   Activo:', user.activo === 1 ? 'Sí' : 'No');
    
    // Probar login
    const passwordMatch = bcrypt.compareSync('admin123', user.password);
    console.log('   Password válido:', passwordMatch ? '✅ Sí' : '❌ No');
  }
  
  db.close();
  
  console.log('\n🚀 Ahora puedes iniciar la aplicación:');
  console.log('   npm start');
  console.log('\n   O ejecutar: INICIAR-NUEVOGYM.bat\n');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('\n📝 Detalles:', error);
  
  if (error.code === 'SQLITE_CANTOPEN') {
    console.log('\n💡 La base de datos no existe o no se puede abrir');
    console.log('   Inicia la aplicación primero para crear la base de datos:');
    console.log('   npm start\n');
  }
  
  process.exit(1);
}

