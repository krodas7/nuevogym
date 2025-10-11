// Script de verificación del sistema
const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

console.log('🔍 Verificando sistema...');

try {
  // Obtener ruta de la base de datos
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'nuevogym.db');
  
  console.log('📁 Ruta de DB:', dbPath);
  
  // Conectar a la base de datos
  const db = new Database(dbPath);
  
  // Verificar tablas
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('📊 Tablas encontradas:', tables.map(t => t.name));
  
  // Verificar estructura de clientes
  const clientesColumns = db.prepare("PRAGMA table_info(clientes)").all();
  console.log('👥 Columnas de clientes:', clientesColumns.map(c => c.name));
  
  // Verificar datos de prueba
  const clientesCount = db.prepare('SELECT COUNT(*) as count FROM clientes').get();
  const membresiasCount = db.prepare('SELECT COUNT(*) as count FROM membresias').get();
  const usuariosCount = db.prepare('SELECT COUNT(*) as count FROM usuarios').get();
  
  console.log('📈 Datos:');
  console.log('  - Clientes:', clientesCount.count);
  console.log('  - Membresías:', membresiasCount.count);
  console.log('  - Usuarios:', usuariosCount.count);
  
  db.close();
  console.log('✅ Verificación completada exitosamente');
  
} catch (error) {
  console.error('❌ Error en verificación:', error.message);
}
