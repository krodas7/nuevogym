import React, { useState, useEffect } from 'react';
import TicketNuevoCliente from './TicketNuevoCliente';
import CameraCapture from './CameraCapture';
import { CameraIcon, UserCircleIcon } from '@heroicons/react/24/outline';

function ClienteModal({ cliente, onClose }) {
  const [membresias, setMembresias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    tipo_membresia: '',
    duracion_dias: 30
  });
  const [capturandoHuella, setCapturandoHuella] = useState(false);
  const [huellaId, setHuellaId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [datosTicket, setDatosTicket] = useState(null);
  const [imprimirTicket, setImprimirTicket] = useState(true);
  const [fotoCliente, setFotoCliente] = useState(null);
  const [mostrarCamera, setMostrarCamera] = useState(false);

  useEffect(() => {
    cargarMembresias();
    
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        fecha_inicio: cliente.fecha_inicio || new Date().toISOString().split('T')[0],
        tipo_membresia: cliente.tipo_membresia || '',
        duracion_dias: 30
      });
      setHuellaId(cliente.huella_id);
      setFotoCliente(cliente.foto);
    }
  }, [cliente]);

  const cargarMembresias = async () => {
    const result = await window.electronAPI.getMembresias();
    if (result.success) {
      setMembresias(result.data);
      if (!cliente && result.data.length > 0) {
        setFormData(prev => ({
          ...prev,
          tipo_membresia: result.data[0].nombre,
          duracion_dias: result.data[0].duracion_dias
        }));
      }
    }
  };

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const handleMembresiaChange = (nombreMembresia) => {
    const membresia = membresias.find(m => m.nombre === nombreMembresia);
    if (membresia) {
      setFormData(prev => ({
        ...prev,
        tipo_membresia: nombreMembresia,
        duracion_dias: membresia.duracion_dias
      }));
    }
  };

  const calcularFechaVencimiento = () => {
    const inicio = new Date(formData.fecha_inicio);
    inicio.setDate(inicio.getDate() + parseInt(formData.duracion_dias));
    return inicio.toISOString().split('T')[0];
  };

  const handleCapturarHuella = async () => {
    setCapturandoHuella(true);
    setError(null);
    
    const result = await window.electronAPI.fingerprintCapture();
    
    if (result.success && result.data.fingerprint_id) {
      setHuellaId(result.data.fingerprint_id);
      alert('Huella capturada exitosamente');
    } else {
      setError(result.error || 'Error al capturar huella');
    }
    
    setCapturandoHuella(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.telefono.trim()) {
      setError('El teléfono es obligatorio');
      return;
    }

    if (!formData.tipo_membresia) {
      setError('Debes seleccionar un tipo de membresía');
      return;
    }

    setGuardando(true);
    setError(null);

    const datosCliente = {
      ...formData,
      fecha_vencimiento: calcularFechaVencimiento(),
      huella_id: huellaId,
      foto: fotoCliente,
      estado: 'activo'
    };

    let result;
    if (cliente) {
      result = await window.electronAPI.updateCliente(cliente.id, datosCliente);
      if (result.success) {
        onClose(true);
      } else {
        setError(result.error);
        setGuardando(false);
      }
    } else {
      result = await window.electronAPI.createCliente(datosCliente);
      
      if (result.success) {
        // Si es nuevo cliente y desea imprimir ticket
        if (imprimirTicket) {
          const membresiaInfo = membresias.find(m => m.nombre === formData.tipo_membresia);
          
          const ticketData = {
            cliente: {
              id: result.data.id,
              nombre: datosCliente.nombre,
              telefono: datosCliente.telefono
            },
            membresia: {
              nombre: formData.tipo_membresia,
              duracion_dias: formData.duracion_dias
            },
            fecha_inicio: datosCliente.fecha_inicio,
            fecha_vencimiento: datosCliente.fecha_vencimiento,
            monto: membresiaInfo?.precio || 0,
            metodo_pago: 'efectivo'
          };

          setDatosTicket(ticketData);
          setMostrarTicket(true);
          setGuardando(false);
        } else {
          onClose(true);
        }
      } else {
        setError(result.error);
        setGuardando(false);
      }
    }
  };

  const handleCerrarTicket = () => {
    setMostrarTicket(false);
    onClose(true);
  };

  // Si se generó el ticket, mostrarlo
  if (mostrarTicket && datosTicket) {
    return <TicketNuevoCliente datosTicket={datosTicket} onClose={handleCerrarTicket} />;
  }

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button className="modal-close" onClick={() => onClose(false)}>
            ×
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>❌</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Nombre Completo *</label>
            <input
              type="text"
              className="input"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Nombre completo del cliente"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="label">Teléfono *</label>
            <input
              type="tel"
              className="input"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              placeholder="10 dígitos"
              required
            />
          </div>

          {/* CAMPO DE FOTO - MUY VISIBLE */}
          <div className="form-group" style={{ 
            border: '3px solid #007bff', 
            borderRadius: '12px', 
            padding: '20px', 
            background: 'linear-gradient(135deg, #e3f2fd 0%, #f8f9fa 100%)',
            marginBottom: '20px',
            boxShadow: '0 4px 8px rgba(0,123,255,0.2)'
          }}>
            <label className="label" style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              color: '#007bff',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📸 CAPTURAR FOTO DEL CLIENTE
            </label>
            
            <div style={{ 
              border: '3px dashed #007bff', 
              borderRadius: '12px', 
              padding: '30px', 
              textAlign: 'center',
              background: 'white',
              marginBottom: '15px'
            }}>
              {fotoCliente ? (
                <div>
                  <img 
                    src={fotoCliente} 
                    alt="Foto del cliente" 
                    style={{ 
                      width: '150px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '12px',
                      marginBottom: '15px',
                      border: '3px solid #28a745'
                    }}
                  />
                  <div>
                    <p style={{ color: '#28a745', marginBottom: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                      ✅ ¡FOTO CAPTURADA EXITOSAMENTE!
                    </p>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setMostrarCamera(true)}
                      style={{ fontSize: '14px', padding: '10px 20px' }}
                    >
                      📷 Cambiar Foto
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '80px', marginBottom: '20px', color: '#007bff' }}>📷</div>
                  <p style={{ marginBottom: '20px', color: '#333', fontSize: '16px', fontWeight: '500' }}>
                    ¡Captura la foto del cliente!
                  </p>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={() => setMostrarCamera(true)}
                    style={{ 
                      fontSize: '16px', 
                      padding: '15px 30px',
                      fontWeight: 'bold',
                      background: '#007bff',
                      border: 'none',
                      borderRadius: '8px'
                    }}
                  >
                    📷 CAPTURAR FOTO AHORA
                  </button>
                </div>
              )}
            </div>
            
            <div style={{ 
              background: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: '10px',
              fontSize: '14px',
              color: '#856404'
            }}>
              💡 <strong>Importante:</strong> La foto ayuda a identificar al cliente en el sistema
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">Tipo de Membresía *</label>
              <select
                className="input"
                value={formData.tipo_membresia}
                onChange={(e) => handleMembresiaChange(e.target.value)}
                required
              >
                <option value="">Selecciona una membresía...</option>
                {membresias.map(membresia => (
                  <option key={membresia.id} value={membresia.nombre}>
                    {membresia.nombre} - {membresia.duracion_dias} días - Q{membresia.precio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Fecha de Inicio *</label>
              <input
                type="date"
                className="input"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Fecha de Vencimiento</label>
            <input
              type="text"
              className="input"
              value={new Date(calcularFechaVencimiento()).toLocaleDateString('es-GT', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              disabled
              style={{ background: 'var(--bg-tertiary)', cursor: 'not-allowed', fontWeight: 600 }}
            />
          </div>

          <div className="form-group">
            <label className="label">Huella Dactilar</label>
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCapturarHuella}
                disabled={capturandoHuella}
              >
                {capturandoHuella ? 'Capturando...' : '👆 Capturar Huella'}
              </button>
              {huellaId && (
                <span className="badge badge-success">
                  ✅ Huella registrada
                </span>
              )}
            </div>
          </div>

          {!cliente && (
            <div className="form-group">
              <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={imprimirTicket}
                  onChange={(e) => setImprimirTicket(e.target.checked)}
                  style={{ width: 'auto', margin: 0 }}
                />
                Imprimir ticket de registro
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
                Se generará un comprobante imprimible con los datos del cliente
              </p>
            </div>
          )}

          <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onClose(false)}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : (cliente ? 'Actualizar' : 'Crear Cliente')}
            </button>
          </div>
        </form>
      </div>

      {mostrarCamera && (
        <CameraCapture
          existingPhoto={fotoCliente}
          onCapture={(foto) => setFotoCliente(foto)}
          onClose={() => setMostrarCamera(false)}
        />
      )}
    </div>
  );
}

export default ClienteModal;

