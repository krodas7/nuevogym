import React, { useState, useEffect } from 'react';
import TicketRenovacion from './TicketRenovacion';

function RenovacionModal({ cliente, onClose }) {
  const [membresias, setMembresias] = useState([]);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [renovando, setRenovando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [datosTicket, setDatosTicket] = useState(null);

  useEffect(() => {
    cargarMembresias();
  }, []);

  const cargarMembresias = async () => {
    const result = await window.electronAPI.getMembresias();
    if (result.success) {
      setMembresias(result.data);
      // Seleccionar la membresía actual por defecto
      const actual = result.data.find(m => m.nombre === cliente.tipo_membresia);
      if (actual) {
        setMembresiaSeleccionada(actual);
        setMonto(actual.precio.toString());
      }
    }
  };

  const handleMembresiaChange = (membresiaId) => {
    const membresia = membresias.find(m => m.id === parseInt(membresiaId));
    if (membresia) {
      setMembresiaSeleccionada(membresia);
      setMonto(membresia.precio.toString());
    }
  };

  const calcularFechaVencimiento = () => {
    if (!membresiaSeleccionada) return '';
    
    const inicio = new Date(fechaInicio);
    inicio.setDate(inicio.getDate() + membresiaSeleccionada.duracion_dias);
    return inicio.toISOString().split('T')[0];
  };

  const getDiasRestantes = () => {
    const hoy = new Date();
    const vencimiento = new Date(cliente.fecha_vencimiento);
    const dias = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return dias;
  };

  const handleRenovar = async (e) => {
    e.preventDefault();
    
    if (!membresiaSeleccionada) {
      setError('Debes seleccionar una membresía');
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    setRenovando(true);
    setError(null);

    try {
      // 1. Actualizar membresía del cliente
      const datosCliente = {
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        fecha_inicio: fechaInicio,
        fecha_vencimiento: calcularFechaVencimiento(),
        tipo_membresia: membresiaSeleccionada.nombre,
        estado: 'activo',
        huella_id: cliente.huella_id || null,
        foto: cliente.foto || null
      };

      const resultCliente = await window.electronAPI.updateCliente(cliente.id, datosCliente);
      
      if (!resultCliente.success) {
        setError('Error al actualizar la membresía: ' + resultCliente.error);
        setRenovando(false);
        return;
      }

      // 2. Registrar el pago
      const datoPago = {
        cliente_id: cliente.id,
        monto: parseFloat(monto),
        metodo_pago: metodoPago,
        concepto: `Renovación de membresía ${membresiaSeleccionada.nombre}`
      };

      const resultPago = await window.electronAPI.registrarPago(datoPago);
      
      if (!resultPago.success) {
        setError('Membresía actualizada pero error al registrar pago: ' + resultPago.error);
        setRenovando(false);
        return;
      }

      // 3. Generar ticket y mostrar
      const ticketData = {
        id: resultPago.data.id,
        cliente: {
          id: cliente.id,
          nombre: cliente.nombre,
          telefono: cliente.telefono
        },
        membresiaAnterior: {
          nombre: cliente.tipo_membresia,
          fecha_vencimiento: cliente.fecha_vencimiento
        },
        membresia: {
          nombre: membresiaSeleccionada.nombre,
          duracion_dias: membresiaSeleccionada.duracion_dias
        },
        fecha_inicio: fechaInicio,
        fecha_vencimiento: calcularFechaVencimiento(),
        monto: monto,
        metodo_pago: metodoPago
      };

      setDatosTicket(ticketData);
      setMostrarTicket(true);
      setRenovando(false);
    } catch (err) {
      setError('Error inesperado: ' + err.message);
      setRenovando(false);
    }
  };

  const handleCerrarTicket = () => {
    setMostrarTicket(false);
    onClose(true);
  };

  const diasRestantes = getDiasRestantes();
  const estaVencida = diasRestantes < 0;

  // Si se generó el ticket, mostrarlo
  if (mostrarTicket && datosTicket) {
    return <TicketRenovacion datosTicket={datosTicket} onClose={handleCerrarTicket} />;
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">🔄 Renovar Membresía</h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        {/* Info del cliente */}
        <div style={{ 
          background: 'var(--bg-tertiary)', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {cliente.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold">{cliente.nombre}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>{cliente.telefono}</p>
            </div>
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Membresía Actual
              </div>
              <div className="font-bold">{cliente.tipo_membresia}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Fecha de Vencimiento
              </div>
              <div className="font-bold">
                {new Date(cliente.fecha_vencimiento).toLocaleDateString('es-GT')}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <span className={`badge ${estaVencida ? 'badge-danger' : diasRestantes <= 7 ? 'badge-warning' : 'badge-success'}`}>
              {estaVencida 
                ? `❌ Vencida hace ${Math.abs(diasRestantes)} días` 
                : `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restante${diasRestantes !== 1 ? 's' : ''}`
              }
            </span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleRenovar}>
          <div className="form-group">
            <label className="label">Nueva Membresía *</label>
            <select
              className="input"
              value={membresiaSeleccionada?.id || ''}
              onChange={(e) => handleMembresiaChange(e.target.value)}
              required
            >
              <option value="">Selecciona una membresía...</option>
              {membresias.map(membresia => (
                <option key={membresia.id} value={membresia.id}>
                  {membresia.nombre} - {membresia.duracion_dias} días - Q{membresia.precio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">Fecha de Inicio *</label>
              <input
                type="date"
                className="input"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Nueva Fecha de Vencimiento</label>
              <input
                type="text"
                className="input"
                value={membresiaSeleccionada 
                  ? new Date(calcularFechaVencimiento()).toLocaleDateString('es-GT', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })
                  : '-'
                }
                disabled
                style={{ background: 'var(--bg-tertiary)', cursor: 'not-allowed', fontWeight: 600 }}
              />
            </div>
          </div>

          <div style={{ 
            background: '#dbeafe', 
            padding: '1rem', 
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1e40af' }}>
              💰 Información de Pago
            </h4>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="label">Monto a Pagar (Q) *</label>
                <input
                  type="number"
                  className="input"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="label">Método de Pago</label>
                <select
                  className="input"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="tarjeta">💳 Tarjeta</option>
                  <option value="transferencia">🏦 Transferencia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onClose(false)}
              disabled={renovando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={renovando}
            >
              {renovando ? 'Renovando...' : '✅ Confirmar Renovación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RenovacionModal;

