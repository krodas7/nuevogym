const { contextBridge, ipcRenderer } = require('electron');

console.log('🚀 Preload script cargado correctamente');

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Clientes
  getClientes: () => ipcRenderer.invoke('get-clientes'),
  createCliente: (cliente) => ipcRenderer.invoke('create-cliente', cliente),
  updateCliente: (id, cliente) => ipcRenderer.invoke('update-cliente', id, cliente),
  deleteCliente: (id) => ipcRenderer.invoke('delete-cliente', id),

  // Asistencias
  getAsistencias: () => ipcRenderer.invoke('get-asistencias'),
  registrarAsistencia: (data) => ipcRenderer.invoke('registrar-asistencia', data),

  // Membresías
  getMembresias: () => ipcRenderer.invoke('get-membresias'),
  createMembresia: (membresia) => ipcRenderer.invoke('create-membresia', membresia),
  updateMembresia: (id, membresia) => ipcRenderer.invoke('update-membresia', id, membresia),
  deleteMembresia: (id) => ipcRenderer.invoke('delete-membresia', id),

  // Estadísticas
  getEstadisticas: () => {
    console.log('📊 Llamando getEstadisticas desde preload');
    return ipcRenderer.invoke('get-estadisticas');
  },

  // Pagos
  getPagos: () => ipcRenderer.invoke('get-pagos'),
  createPago: (pago) => ipcRenderer.invoke('create-pago', pago),

  // Tickets
  generateTicket: (ticketData) => ipcRenderer.invoke('generate-ticket', ticketData),
  getTickets: () => ipcRenderer.invoke('get-tickets'),

  // Sensor de huellas
  fingerprintCapture: () => ipcRenderer.invoke('fingerprint-capture'),
  fingerprintEnroll: (data) => ipcRenderer.invoke('fingerprint-enroll', data),
  fingerprintIdentify: () => ipcRenderer.invoke('fingerprint-identify'),
  getFingerprintConfig: () => ipcRenderer.invoke('get-fingerprint-config'),
  saveFingerprintConfig: (data) => ipcRenderer.invoke('save-fingerprint-config', data),
  testFingerprintConnection: (data) => ipcRenderer.invoke('test-fingerprint-connection', data),

  // Autenticación
  login: (usuario, password) => ipcRenderer.invoke('login', usuario, password),
  cambiarPassword: (usuarioId, nuevaPassword) => ipcRenderer.invoke('cambiar-password', usuarioId, nuevaPassword),

  // Usuarios
  getUsuarios: () => ipcRenderer.invoke('get-usuarios'),
  createUsuario: (usuario) => ipcRenderer.invoke('create-usuario', usuario),
  updateUsuario: (id, usuario) => ipcRenderer.invoke('update-usuario', id, usuario),
  deleteUsuario: (id) => ipcRenderer.invoke('delete-usuario', id),

  // Configuración
  getConfiguracion: () => ipcRenderer.invoke('get-configuracion'),
  guardarConfiguracion: (config) => ipcRenderer.invoke('guardar-configuracion', config),
  listarPuertosCOM: () => ipcRenderer.invoke('listar-puertos-com'),
  probarConexionArduino: (config) => ipcRenderer.invoke('probar-conexion-arduino', config),
  abrirChapaElectrica: () => ipcRenderer.invoke('abrir-chapa-electrica'),

  // Backup de Base de Datos
  backupDatabase: () => ipcRenderer.invoke('backup-database'),
  restoreDatabase: () => ipcRenderer.invoke('restore-database'),
  getDatabaseInfo: () => ipcRenderer.invoke('get-database-info'),
  
  // Datos de prueba
  insertTestData: () => ipcRenderer.invoke('insert-test-data'),

  // Escuchar eventos del sensor de huellas
  onSensorData: (callback) => {
    ipcRenderer.on('sensor-data', (event, data) => callback(data));
  },
  removeSensorDataListener: () => {
    ipcRenderer.removeAllListeners('sensor-data');
  }
});