import React, { useState, useEffect } from 'react';
import { Cog6ToothIcon, WifiIcon, KeyIcon, InformationCircleIcon, CodeBracketIcon, ComputerDesktopIcon, ArrowDownTrayIcon, ArrowUpTrayIcon, CircleStackIcon, LockClosedIcon } from '@heroicons/react/24/outline';

function Configuracion() {
  const [apiUrl, setApiUrl] = useState('http://localhost:8080');
  const [conectando, setConectando] = useState(false);
  const [conexionEstado, setConexionEstado] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  
  // Cambio de contraseña
  const [usuario, setUsuario] = useState(null);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [passwordConfirmar, setPasswordConfirmar] = useState('');
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [mensajePassword, setMensajePassword] = useState(null);

  // Configuración de Arduino/Chapa eléctrica
  const [configuracion, setConfiguracion] = useState({
    puertoCOM: '',
    baudRate: 9600,
    tiempoApertura: 3,
    habilitarChapa: false,
    sensorIP: '192.168.0.5' // IP del sensor de huellas
  });
  const [puertosDisponibles, setPuertosDisponibles] = useState([]);
  const [conectadoArduino, setConectadoArduino] = useState(false);
  const [probandoConexion, setProbandoConexion] = useState(false);

  // Estado para backup de base de datos
  const [databaseInfo, setDatabaseInfo] = useState(null);
  const [backupMessage, setBackupMessage] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuario(user);
    cargarConfiguracion();
    listarPuertosCOM();
    cargarInfoBaseDatos();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      const config = await window.electronAPI.getConfiguracion();
      if (config.success) {
        setConfiguracion(config.data);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const listarPuertosCOM = async () => {
    try {
      const puertos = await window.electronAPI.listarPuertosCOM();
      if (puertos.success) {
        setPuertosDisponibles(puertos.data);
      }
    } catch (error) {
      console.error('Error al listar puertos:', error);
    }
  };

  const probarConexionArduino = async () => {
    setProbandoConexion(true);
    try {
      const result = await window.electronAPI.probarConexionArduino(configuracion);
      if (result.success) {
        setConectadoArduino(true);
        setMensaje({ tipo: 'success', texto: 'Conexión con Arduino exitosa!' });
      } else {
        setConectadoArduino(false);
        setMensaje({ tipo: 'error', texto: `Error al conectar: ${result.error}` });
      }
    } catch (error) {
      setConectadoArduino(false);
      setMensaje({ tipo: 'error', texto: `Error: ${error.message}` });
    }
    setProbandoConexion(false);
  };

  const guardarConfiguracion = async () => {
    try {
      const result = await window.electronAPI.guardarConfiguracion(configuracion);
      if (result.success) {
        setMensaje({ tipo: 'success', texto: 'Configuración guardada exitosamente' });
      } else {
        setMensaje({ tipo: 'error', texto: `Error al guardar: ${result.error}` });
      }
    } catch (error) {
      setMensaje({ tipo: 'error', texto: `Error: ${error.message}` });
    }
  };

  const handleTestConexion = async () => {
    setConectando(true);
    setConexionEstado(null);
    setMensaje(null);

    try {
      const result = await window.electronAPI.testFingerprintConnection({ url: apiUrl });
      if (result.success) {
        setConexionEstado('conectado');
        setMensaje({ tipo: 'success', texto: 'Conexión exitosa con el sensor de huellas' });
      } else {
        setConexionEstado('error');
        setMensaje({ tipo: 'error', texto: result.error });
      }
    } catch (error) {
      setConexionEstado('error');
      setMensaje({ tipo: 'error', texto: 'Error de conexión: ' + error.message });
    }

    setConectando(false);
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    
    if (passwordNueva !== passwordConfirmar) {
      setMensajePassword({ tipo: 'error', texto: 'Las contraseñas no coinciden' });
      return;
    }

    if (passwordNueva.length < 6) {
      setMensajePassword({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setCambiandoPassword(true);
    setMensajePassword(null);

    try {
      const result = await window.electronAPI.cambiarPassword(usuario.id, passwordNueva);
      if (result.success) {
        setMensajePassword({ tipo: 'success', texto: 'Contraseña cambiada exitosamente' });
        setPasswordActual('');
        setPasswordNueva('');
        setPasswordConfirmar('');
      } else {
        setMensajePassword({ tipo: 'error', texto: result.error });
      }
    } catch (error) {
      setMensajePassword({ tipo: 'error', texto: 'Error al cambiar contraseña: ' + error.message });
    }

    setCambiandoPassword(false);
  };

  const cargarInfoBaseDatos = async () => {
    const result = await window.electronAPI.getDatabaseInfo();
    if (result.success) {
      setDatabaseInfo(result.data);
    }
  };

  const handleBackupDatabase = async () => {
    setBackupMessage(null);
    try {
      const result = await window.electronAPI.backupDatabase();
      if (result.success) {
        setBackupMessage({ tipo: 'success', texto: result.message });
        await cargarInfoBaseDatos(); // Recargar información
      } else {
        setBackupMessage({ tipo: 'error', texto: result.error });
      }
    } catch (error) {
      setBackupMessage({ tipo: 'error', texto: `Error: ${error.message}` });
    }
  };

  const handleRestoreDatabase = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de que quieres restaurar la base de datos? Esto reemplazará todos los datos actuales.')) {
      return;
    }

    setBackupMessage(null);
    try {
      const result = await window.electronAPI.restoreDatabase();
      if (result.success) {
        setBackupMessage({ tipo: 'success', texto: result.message });
        await cargarInfoBaseDatos(); // Recargar información
        // Recargar la página para actualizar todos los datos
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setBackupMessage({ tipo: 'error', texto: result.error });
      }
    } catch (error) {
      setBackupMessage({ tipo: 'error', texto: `Error: ${error.message}` });
    }
  };

  const handleInsertTestData = async () => {
    if (!window.confirm('🎲 ¿Deseas insertar datos de prueba? Se agregarán 8 clientes y 24 tickets (3 meses)')) {
      return;
    }

    setBackupMessage(null);
    try {
      const result = await window.electronAPI.insertTestData();
      if (result.success) {
        setBackupMessage({ tipo: 'success', texto: '✅ Datos de prueba insertados correctamente. Recarga la página para verlos.' });
        await cargarInfoBaseDatos();
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setBackupMessage({ tipo: 'error', texto: result.error });
      }
    } catch (error) {
      setBackupMessage({ tipo: 'error', texto: `Error: ${error.message}` });
    }
  };

  const formatearTamano = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Cog6ToothIcon style={{ width: '24px', height: '24px', flexShrink: 0 }} />
          Configuración del Sistema
        </div>
        <p className="page-subtitle">Administra la configuración general, Arduino y respaldos de datos</p>
      </div>

      <div className="grid grid-2">
        {/* Cambiar Contraseña */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            Cambiar Contraseña
          </h2>
          <p className="text-secondary mb-6">
            Actualiza tu contraseña de acceso al sistema.
          </p>

          {mensajePassword && (
            <div className={`alert alert-${mensajePassword.tipo} mb-4`}>
              <span>{mensajePassword.tipo === 'success' ? '✅' : '❌'}</span>
              <div>{mensajePassword.texto}</div>
            </div>
          )}

          <form onSubmit={handleCambiarPassword}>
            <div className="form-group">
              <label className="label">Usuario Actual</label>
              <input
                type="text"
                className="input"
                value={usuario?.nombre_completo || ''}
                disabled
              />
            </div>

            <div className="form-group">
              <label className="label">Nueva Contraseña</label>
              <input
                type="password"
                className="input"
                value={passwordNueva}
                onChange={(e) => setPasswordNueva(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={cambiandoPassword}
              />
            </div>

            <div className="form-group">
              <label className="label">Confirmar Nueva Contraseña</label>
              <input
                type="password"
                className="input"
                value={passwordConfirmar}
                onChange={(e) => setPasswordConfirmar(e.target.value)}
                placeholder="Repite la nueva contraseña"
                required
                disabled={cambiandoPassword}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={cambiandoPassword}
            >
              {cambiandoPassword ? 'Cambiando...' : '🔐 Cambiar Contraseña'}
            </button>
          </form>
        </div>

        {/* Sensor de Huellas */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <WifiIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            Sensor de Huellas
          </h2>
          <p className="text-secondary mb-6">
            Configura la dirección IP de la computadora donde está conectado el sensor de huellas (api.exe).
          </p>

          <div className="form-group">
            <label className="label">IP del Sensor de Huellas</label>
            <input
              type="text"
              className="input"
              value={configuracion.sensorIP || ''}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, sensorIP: e.target.value }))}
              placeholder="192.168.0.5"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Dirección IP de la computadora donde está corriendo api.exe (ej. 192.168.0.5).
            </p>
          </div>

          <div style={{ 
            padding: '0.75rem', 
            background: 'var(--bg-tertiary)', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            fontSize: '0.8125rem'
          }}>
            <strong>ℹ️ Cómo obtener la IP:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              <li><strong>Windows:</strong> Abre CMD y ejecuta <code>ipconfig</code></li>
              <li><strong>Mac:</strong> Ve a Preferencias del Sistema → Red</li>
              <li>Busca "Dirección IPv4" o "IP Address"</li>
            </ul>
          </div>

          <button
            className="btn btn-secondary"
            onClick={guardarConfiguracion}
          >
            💾 Guardar Configuración
          </button>
        </div>

        {/* Control de Chapa Eléctrica (Arduino) */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LockClosedIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            Control de Chapa Eléctrica (Arduino)
          </h2>
          <p className="text-secondary mb-6">
            Configura la conexión con tu Arduino para controlar una chapa eléctrica.
          </p>

          {mensaje && (
            <div className={`alert alert-${mensaje.tipo} mb-4`}>
              <span>{mensaje.tipo === 'success' ? '✅' : '❌'}</span>
              <div>{mensaje.texto}</div>
            </div>
          )}

          <div className="form-group flex items-center justify-between">
            <label className="label mb-0">Habilitar Chapa Eléctrica</label>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={configuracion.habilitarChapa}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, habilitarChapa: e.target.checked }))}
            />
          </div>

          <div className="form-group">
            <label className="label">Puerto COM</label>
            <div className="flex gap-2">
              <select
                className="input flex-grow"
                value={configuracion.puertoCOM}
                onChange={(e) => setConfiguracion(prev => ({ ...prev, puertoCOM: e.target.value }))}
              >
                <option value="">Seleccionar puerto...</option>
                {puertosDisponibles.map(port => (
                  <option key={port.path} value={port.path}>
                    {port.path} ({port.manufacturer || 'Desconocido'})
                  </option>
                ))}
              </select>
              <button className="btn btn-outline" onClick={listarPuertosCOM}>
                🔄
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Selecciona el puerto al que está conectado tu Arduino.
            </p>
          </div>

          <div className="form-group">
            <label className="label">Baud Rate</label>
            <input
              type="number"
              className="input"
              value={configuracion.baudRate}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, baudRate: parseInt(e.target.value) }))}
              placeholder="9600"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Debe coincidir con el baud rate configurado en tu Arduino (ej. 9600).
            </p>
          </div>

          <div className="form-group">
            <label className="label">Tiempo de Apertura (segundos)</label>
            <input
              type="number"
              className="input"
              value={configuracion.tiempoApertura}
              onChange={(e) => setConfiguracion(prev => ({ ...prev, tiempoApertura: parseInt(e.target.value) }))}
              placeholder="3"
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Duración en segundos que la chapa permanecerá abierta.
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="btn btn-primary flex-grow"
              onClick={probarConexionArduino}
              disabled={probandoConexion || !configuracion.puertoCOM}
            >
              {probandoConexion ? 'Probando...' : '🔗 Probar Conexión Arduino'}
            </button>
            <button
              className="btn btn-secondary flex-grow"
              onClick={guardarConfiguracion}
            >
              💾 Guardar Configuración
            </button>
          </div>
        </div>

        {/* Backup de Base de Datos */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CircleStackIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            Respaldo de Base de Datos
          </h2>
          <p className="text-secondary mb-6">
            Crea copias de seguridad de todos los datos del sistema y restaura desde copias anteriores.
          </p>

          {backupMessage && (
            <div className={`alert alert-${backupMessage.tipo} mb-4`}>
              <span>{backupMessage.tipo === 'success' ? '✅' : '❌'}</span>
              <div>{backupMessage.texto}</div>
            </div>
          )}

          {/* Información de la base de datos */}
          {databaseInfo && databaseInfo.exists && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">📊 Información de la Base de Datos</h3>
              <div className="grid grid-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tamaño:</span>
                  <br />
                  <span className="text-secondary">{formatearTamano(databaseInfo.size)}</span>
                </div>
                <div>
                  <span className="font-medium">Última modificación:</span>
                  <br />
                  <span className="text-secondary">
                    {new Date(databaseInfo.lastModified).toLocaleString('es-GT')}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Clientes:</span>
                  <br />
                  <span className="text-secondary">{databaseInfo.statistics?.clientes || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Asistencias:</span>
                  <br />
                  <span className="text-secondary">{databaseInfo.statistics?.asistencias || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Pagos:</span>
                  <br />
                  <span className="text-secondary">{databaseInfo.statistics?.pagos || 0}</span>
                </div>
                <div>
                  <span className="font-medium">Usuarios:</span>
                  <br />
                  <span className="text-secondary">{databaseInfo.statistics?.usuarios || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleBackupDatabase}
              className="btn btn-primary flex-grow flex items-center justify-center"
            >
              <ArrowDownTrayIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              Crear Copia de Seguridad
            </button>
            <button
              onClick={handleRestoreDatabase}
              className="btn btn-warning flex-grow flex items-center justify-center"
            >
              <ArrowUpTrayIcon style={{ width: '16px', height: '16px', marginRight: '6px' }} />
              Restaurar desde Backup
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={handleInsertTestData}
              className="btn btn-secondary w-full"
            >
              🎲 Insertar Datos de Prueba
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', textAlign: 'center' }}>
              Agrega 8 clientes y 24 tickets de prueba (3 meses)
            </p>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Las copias de seguridad incluyen todos los datos del sistema</li>
              <li>• Restaurar reemplazará todos los datos actuales</li>
              <li>• Se crea automáticamente un backup antes de restaurar</li>
              <li>• Guarda las copias en un lugar seguro</li>
            </ul>
          </div>
        </div>

        {/* Código Arduino */}
        <div className="card">
          <h2 className="text-xl font-bold mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CodeBracketIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
            Código Arduino
          </h2>
          <p className="text-secondary mb-6">
            Copia este código en tu Arduino para controlar la chapa eléctrica:
          </p>

          <div style={{ 
            background: '#1e1e1e', 
            color: '#d4d4d4', 
            padding: '1rem', 
            borderRadius: '0.5rem', 
            fontSize: '0.8125rem',
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            overflow: 'auto',
            marginBottom: '1rem'
          }}>
            <pre>{`// NuevoGym - Control de Chapa Eléctrica
// Código personalizado para tu Arduino

int chapa = 4; // Pin de la chapa eléctrica

void setup() {
  pinMode(chapa, OUTPUT);
  digitalWrite(chapa, HIGH); // Inicializar cerrada
  Serial.begin(9600);
  Serial.println("NuevoGym - Chapa Lista");
}

char lectura;

void loop() {
  delay(200);
  
  if (Serial.available() > 0) {
    lectura = Serial.read();
    
    if (lectura == 'o') {  // Comando para abrir
      Serial.println("cerrar \\n");
      digitalWrite(chapa, LOW);   // Abrir chapa
      delay(1000);               // Mantener abierta 1 segundo
      Serial.println("abrir \\n");
      digitalWrite(chapa, HIGH); // Cerrar chapa
    }
    
    if (lectura == 'c') {  // Comando para cerrar
      Serial.println("cerrar \\n");
      digitalWrite(chapa, LOW);  // Cerrar chapa
    }
  }
}

// Conexiones:
// Arduino Pin 4 -> Chapa Eléctrica (+)
// GND -> Chapa Eléctrica (-)
// 
// NOTA: Tu código ya está listo para usar!
// Solo configura el puerto COM en la aplicación.`}</pre>
          </div>

          <div style={{ 
            padding: '1rem', 
            background: 'var(--warning-light)', 
            borderRadius: '0.5rem',
            border: '1px solid var(--warning)'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--warning-dark)' }}>
              ⚠️ Instrucciones de Conexión:
            </h4>
            <ul style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', paddingLeft: '1.5rem' }}>
              <li>Conecta la chapa eléctrica al pin 4 del Arduino</li>
              <li>Conecta el GND de la chapa al GND del Arduino</li>
              <li>Sube tu código al Arduino (ya está listo)</li>
              <li>Configura el puerto COM en la configuración</li>
              <li>Prueba la conexión</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracion;