import React, { useState, useEffect } from 'react';
import TicketPago from './TicketPago';

function ClienteDetalle({ cliente, onClose, onEdit }) {
  const [asistencias, setAsistencias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [tab, setTab] = useState('info');
  const [mostrarPagoModal, setMostrarPagoModal] = useState(false);
  const [montoPago, setMontoPago] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [datosTicket, setDatosTicket] = useState(null);

  useEffect(() => {
    if (tab === 'asistencias') {
      cargarAsistencias();
    } else if (tab === 'pagos') {
      cargarPagos();
    }
  }, [tab]);

  const cargarAsistencias = async () => {
    const result = await window.electronAPI.getAsistencias({ cliente_id: cliente.id });
    if (result.success) {
      setAsistencias(result.data);
    }
  };

  const cargarPagos = async () => {
    const result = await window.electronAPI.getPagos(cliente.id);
    if (result.success) {
      setPagos(result.data);
    }
  };

  const handleRegistrarPago = async (e) => {
    e.preventDefault();
    
    const result = await window.electronAPI.registrarPago({
      cliente_id: cliente.id,
      monto: parseFloat(montoPago),
      metodo_pago: metodoPago,
      concepto: 'Pago de membresía'
    });

    if (result.success) {
      // Generar ticket de pago
      const ticketData = {
        id: result.data.id,
        cliente: {
          nombre: cliente.nombre,
          telefono: cliente.telefono
        },
        monto: montoPago,
        metodo_pago: metodoPago,
        concepto: 'Pago de membresía'
      };

      setDatosTicket(ticketData);
      setMostrarPagoModal(false);
      setMostrarTicket(true);
      setMontoPago('');
    } else {
      alert('Error al registrar pago: ' + result.error);
    }
  };

  const handleCerrarTicket = () => {
    setMostrarTicket(false);
    cargarPagos();
  };

  const esMembresiaNormal = () => {
    const hoy = new Date().toISOString().split('T')[0];
    return cliente.fecha_vencimiento >= hoy;
  };

  const diasRestantes = () => {
    const hoy = new Date();
    const vencimiento = new Date(cliente.fecha_vencimiento);
    const diff = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Si se generó el ticket de pago, mostrarlo
  if (mostrarTicket && datosTicket) {
    return <TicketPago datosTicket={datosTicket} onClose={handleCerrarTicket} />;
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', maxHeight: '90vh' }}>
        <div className="modal-header">
          <h2 className="modal-title">Detalles del Cliente</h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div className="flex items-center gap-4 mb-4">
            {cliente.foto ? (
              <img
                src={cliente.foto}
                alt={cliente.nombre}
                style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: 'white'
                }}
              >
                {cliente.nombre.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold">{cliente.nombre}</h3>
              <div className="flex gap-2" style={{ marginTop: '0.5rem' }}>
                {esMembresiaNormal() ? (
                  <span className="badge badge-success">Membresía Activa</span>
                ) : (
                  <span className="badge badge-danger">Membresía Vencida</span>
                )}
                {cliente.huella_id && (
                  <span className="badge badge-info">👆 Huella Registrada</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={onEdit}>
              ✏️ Editar
            </button>
            <button className="btn btn-success" onClick={() => setMostrarPagoModal(true)}>
              💰 Registrar Pago
            </button>
          </div>
        </div>

        <div style={{ borderBottom: '2px solid var(--border)', marginBottom: '1.5rem' }}>
          <div className="flex gap-4">
            <button
              className={`tab-button ${tab === 'info' ? 'active' : ''}`}
              onClick={() => setTab('info')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: tab === 'info' ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === 'info' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                marginBottom: '-2px'
              }}
            >
              📋 Información
            </button>
            <button
              className={`tab-button ${tab === 'asistencias' ? 'active' : ''}`}
              onClick={() => setTab('asistencias')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: tab === 'asistencias' ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === 'asistencias' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                marginBottom: '-2px'
              }}
            >
              ✅ Asistencias
            </button>
            <button
              className={`tab-button ${tab === 'pagos' ? 'active' : ''}`}
              onClick={() => setTab('pagos')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: tab === 'pagos' ? '2px solid var(--primary)' : '2px solid transparent',
                color: tab === 'pagos' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                marginBottom: '-2px'
              }}
            >
              💰 Pagos
            </button>
          </div>
        </div>

        {tab === 'info' && (
          <div>
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Teléfono
                </h4>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{cliente.telefono}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Tipo de Membresía
                </h4>
                <p style={{ fontSize: '1rem', fontWeight: 600 }}>{cliente.tipo_membresia}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Fecha de Inicio
                </h4>
                <p>{new Date(cliente.fecha_inicio).toLocaleDateString('es-GT', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Fecha de Vencimiento
                </h4>
                <p>
                  {new Date(cliente.fecha_vencimiento).toLocaleDateString('es-GT', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                  <br />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: diasRestantes() > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {diasRestantes() > 0 ? `✅ ${diasRestantes()} días restantes` : `❌ Vencido hace ${Math.abs(diasRestantes())} días`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {tab === 'asistencias' && (
          <div>
            <h3 className="text-lg font-bold mb-4">Historial de Asistencias</h3>
            {asistencias.length === 0 ? (
              <div className="empty-state">
                <p className="empty-text">No hay asistencias registradas</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha y Hora</th>
                      <th>Tipo</th>
                      <th>Método</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias.map(asistencia => (
                      <tr key={asistencia.id}>
                        <td>
                          {new Date(asistencia.fecha_hora).toLocaleString('es-GT', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td>
                          <span className={`badge ${asistencia.tipo === 'entrada' ? 'badge-success' : 'badge-info'}`}>
                            {asistencia.tipo === 'entrada' ? '🚪 Entrada' : '👋 Salida'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${asistencia.metodo === 'huella' ? 'badge-info' : 'badge-warning'}`}>
                            {asistencia.metodo === 'huella' ? '👆 Huella' : '✍️ Manual'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'pagos' && (
          <div>
            <h3 className="text-lg font-bold mb-4">Historial de Pagos</h3>
            {pagos.length === 0 ? (
              <div className="empty-state">
                <p className="empty-text">No hay pagos registrados</p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Monto</th>
                      <th>Método</th>
                      <th>Concepto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.map(pago => (
                      <tr key={pago.id}>
                        <td>
                          {new Date(pago.fecha_pago).toLocaleString('es-GT', {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="font-bold">
                          Q{pago.monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {pago.metodo_pago}
                          </span>
                        </td>
                        <td>{pago.concepto}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {mostrarPagoModal && (
          <div className="modal-overlay" onClick={() => setMostrarPagoModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                <h2 className="modal-title">Registrar Pago</h2>
                <button className="modal-close" onClick={() => setMostrarPagoModal(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleRegistrarPago}>
                <div className="form-group">
                  <label className="label">Monto *</label>
                  <input
                    type="number"
                    className="input"
                    value={montoPago}
                    onChange={(e) => setMontoPago(e.target.value)}
                    step="0.01"
                    min="0"
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
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setMostrarPagoModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-success">
                    💰 Registrar Pago
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClienteDetalle;

