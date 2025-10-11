import React, { useState, useEffect } from 'react';

function RegistroAsistenciaModal({ onClose }) {
  const [metodo, setMetodo] = useState('manual');
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [identificando, setIdentificando] = useState(false);
  const [registrando, setRegistrando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (metodo === 'manual') {
      cargarClientes();
    }
  }, [metodo]);

  const cargarClientes = async () => {
    const result = await window.electronAPI.getClientes();
    if (result.success) {
      setClientes(result.data.filter(c => c.estado === 'activo'));
    }
  };

  const handleIdentificarHuella = async () => {
    setIdentificando(true);
    setMensaje(null);
    
    const result = await window.electronAPI.fingerprintIdentify();
    
    if (result.success && result.data.cliente) {
      const cliente = result.data.cliente;
      setMensaje({
        tipo: 'success',
        texto: `Cliente identificado: ${cliente.nombre}`
      });
      
      // Registrar automáticamente la asistencia
      await registrarAsistencia(cliente.id, 'huella');
    } else if (result.success && !result.data.cliente) {
      setMensaje({
        tipo: 'error',
        texto: 'Huella no reconocida. Por favor registra el cliente primero.'
      });
    } else {
      setMensaje({
        tipo: 'error',
        texto: result.error || 'Error al identificar huella'
      });
    }
    
    setIdentificando(false);
  };

  const registrarAsistencia = async (clienteId, metodoRegistro) => {
    setRegistrando(true);
    
    const result = await window.electronAPI.registrarAsistencia({
      cliente_id: clienteId,
      tipo: tipo,
      metodo: metodoRegistro
    });
    
    if (result.success) {
      if (result.cliente) {
        alert(`✅ Asistencia registrada exitosamente\n\nCliente: ${result.cliente.nombre}\nMembresía: ${result.cliente.tipo_membresia}\nVence: ${new Date(result.cliente.fecha_vencimiento).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}`);
      } else {
        alert('Asistencia registrada exitosamente');
      }
      onClose(true);
    } else {
      setMensaje({
        tipo: 'error',
        texto: result.error
      });
      
      // Si la membresía está vencida, mostrar información del cliente
      if (result.cliente) {
        alert(`⚠️ ${result.error}\n\nCliente: ${result.cliente.nombre}\nMembresía: ${result.cliente.tipo_membresia}\nVencimiento: ${new Date(result.cliente.fecha_vencimiento).toLocaleDateString('es-GT', { day: '2-digit', month: 'long', year: 'numeric' })}`);
      }
    }
    
    setRegistrando(false);
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    
    if (!clienteSeleccionado) {
      setMensaje({
        tipo: 'error',
        texto: 'Debes seleccionar un cliente'
      });
      return;
    }
    
    await registrarAsistencia(parseInt(clienteSeleccionado), 'manual');
  };

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    (cliente.telefono && cliente.telefono.includes(busqueda))
  );

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Registrar Asistencia</h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo}`}>
            <span>{mensaje.tipo === 'success' ? '✅' : '❌'}</span>
            <div>{mensaje.texto}</div>
          </div>
        )}

        <div className="form-group">
          <label className="label">Método de Registro</label>
          <div className="flex gap-2">
            <button
              className={`btn ${metodo === 'manual' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMetodo('manual')}
              style={{ flex: 1 }}
            >
              ✍️ Manual
            </button>
            <button
              className={`btn ${metodo === 'huella' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setMetodo('huella')}
              style={{ flex: 1 }}
            >
              👆 Sensor de Huellas
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Tipo de Registro</label>
          <div className="flex gap-2">
            <button
              className={`btn ${tipo === 'entrada' ? 'btn-success' : 'btn-outline'}`}
              onClick={() => setTipo('entrada')}
              style={{ flex: 1 }}
            >
              🚪 Entrada
            </button>
            <button
              className={`btn ${tipo === 'salida' ? 'btn-secondary' : 'btn-outline'}`}
              onClick={() => setTipo('salida')}
              style={{ flex: 1 }}
            >
              👋 Salida
            </button>
          </div>
        </div>

        {metodo === 'manual' ? (
          <form onSubmit={handleSubmitManual}>
            <div className="form-group">
              <label className="label">Buscar Cliente</label>
              <input
                type="text"
                className="input"
                placeholder="Buscar por nombre o teléfono..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Cliente *</label>
              <select
                className="input"
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value)}
                required
                size="10"
                style={{ height: '250px' }}
              >
                <option value="">Selecciona un cliente...</option>
                {clientesFiltrados.map(cliente => {
                  const vencido = new Date(cliente.fecha_vencimiento) < new Date();
                  return (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nombre} ({cliente.telefono}) - {cliente.tipo_membresia}
                      {vencido ? ' ⚠️ VENCIDA' : ''}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onClose(false)}
                disabled={registrando}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={registrando}
              >
                {registrando ? 'Registrando...' : '✅ Registrar Asistencia'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              background: 'var(--bg-tertiary)',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {identificando ? '⏳' : '👆'}
              </div>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {identificando ? 'Identificando huella...' : 'Coloca el dedo en el sensor'}
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {identificando
                  ? 'Por favor espera mientras identificamos la huella'
                  : 'El sistema identificará automáticamente al cliente'
                }
              </p>
            </div>

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => onClose(false)}
                disabled={identificando}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleIdentificarHuella}
                disabled={identificando}
              >
                {identificando ? 'Identificando...' : '👆 Iniciar Identificación'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistroAsistenciaModal;

