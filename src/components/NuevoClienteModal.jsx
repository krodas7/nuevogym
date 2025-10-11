import React, { useState, useEffect } from 'react';
import { CameraIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import CameraCapture from './CameraCapture';

function NuevoClienteModal({ cliente, onClose }) {
  const [membresias, setMembresias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    tipo_membresia: '',
    duracion_dias: 30
  });
  const [huellaId, setHuellaId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
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
    try {
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
    } catch (error) {
      console.error('Error al cargar membresías:', error);
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

  const [capturandoHuella, setCapturandoHuella] = useState(false);

  const handleCapturarHuella = async () => {
    setCapturandoHuella(true);
    setError(null);
    
    try {
      // Mostrar mensaje de espera
      alert('Coloca el dedo en el sensor. Esperando...');
      
      const result = await window.electronAPI.fingerprintCapture();
      
      if (result.success && result.data.template_b64) {
        setHuellaId(result.data.template_b64);
        alert('✅ Huella capturada y registrada exitosamente');
      } else {
        setError(result.error || 'Error al capturar huella');
        alert('❌ ' + (result.error || 'Error al capturar huella'));
      }
    } catch (error) {
      const errorMsg = 'Error al capturar huella: ' + error.message;
      setError(errorMsg);
      alert('❌ ' + errorMsg);
    } finally {
      setCapturandoHuella(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    try {
      let result;
      if (cliente) {
        result = await window.electronAPI.updateCliente(cliente.id, datosCliente);
      } else {
        result = await window.electronAPI.createCliente(datosCliente);
      }
      
      if (result.success) {
        onClose(true);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error al guardar cliente: ' + error.message);
    }
    
    setGuardando(false);
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {cliente ? 'Editar Cliente' : '🆕 NUEVO CLIENTE'}
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
          {/* DATOS BÁSICOS */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '15px', fontSize: '18px' }}>
              📝 Datos Básicos
            </h3>
            
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
          </div>

          {/* FOTO DEL CLIENTE - MINIMALISTA */}
          <div className="form-group">
            <label className="label">Foto del Cliente</label>
            <div style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px', 
              padding: '16px', 
              textAlign: 'center',
              background: '#f9fafb',
              marginBottom: '8px'
            }}>
              {fotoCliente ? (
                <div>
                  <img 
                    src={fotoCliente} 
                    alt="Foto del cliente" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '2px solid #d1d5db'
                    }}
                  />
                  <div>
                    <button 
                      type="button" 
                      className="btn btn-outline btn-sm"
                      onClick={() => setMostrarCamera(true)}
                      style={{ fontSize: '14px', padding: '8px 16px' }}
                    >
                      📷 Cambiar
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '32px', marginBottom: '12px', color: '#6b7280' }}>📷</div>
                  <button 
                    type="button" 
                    className="btn btn-primary btn-sm"
                    onClick={() => setMostrarCamera(true)}
                    style={{ 
                      fontSize: '14px', 
                      padding: '8px 16px'
                    }}
                  >
                    📷 Capturar Foto
                  </button>
                </div>
              )}
            </div>
            <p style={{ 
              fontSize: '12px', 
              color: '#6b7280', 
              margin: 0,
              textAlign: 'center'
            }}>
              La foto ayuda a identificar al cliente
            </p>
          </div>

          {/* MEMBRESÍA */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '15px', fontSize: '18px' }}>
              💳 Membresía
            </h3>
            
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
                style={{ background: '#f8f9fa', cursor: 'not-allowed', fontWeight: 600 }}
              />
            </div>
          </div>

          {/* HUELLA DACTILAR */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#007bff', marginBottom: '15px', fontSize: '18px' }}>
              👆 Huella Dactilar
            </h3>
            
            <div className="form-group">
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCapturarHuella}
                  disabled={capturandoHuella}
                >
                  {capturandoHuella ? '⏳ Esperando huella...' : '👆 Capturar Huella'}
                </button>
                {huellaId && (
                  <span className="badge badge-success">
                    ✅ Huella registrada
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* OPCIONES */}
          {!cliente && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#007bff', marginBottom: '15px', fontSize: '18px' }}>
                🎫 Opciones
              </h3>
              
              <div className="form-group">
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    checked={imprimirTicket}
                    onChange={(e) => setImprimirTicket(e.target.checked)}
                    style={{ width: '20px', height: '20px', margin: 0 }}
                  />
                  Imprimir ticket de registro
                </label>
                <p style={{ fontSize: '14px', color: '#666', marginTop: '5px', marginLeft: '30px' }}>
                  Se generará un comprobante imprimible con los datos del cliente
                </p>
              </div>
            </div>
          )}

          {/* BOTONES */}
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            justifyContent: 'flex-end', 
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '2px solid #e9ecef'
          }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => onClose(false)}
              disabled={guardando}
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
              style={{ fontSize: '16px', padding: '12px 24px' }}
            >
              {guardando ? 'Guardando...' : (cliente ? 'Actualizar' : '✅ Crear Cliente')}
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

export default NuevoClienteModal;
