import React, { useState, useEffect } from 'react';
import MembresiaModal from '../components/MembresiaModal';

function TiposMembresia() {
  const [membresias, setMembresias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [membresiaSeleccionada, setMembresiaSeleccionada] = useState(null);

  useEffect(() => {
    cargarMembresias();
  }, []);

  const cargarMembresias = async () => {
    setLoading(true);
    const result = await window.electronAPI.getMembresias();
    if (result.success) {
      setMembresias(result.data);
    }
    setLoading(false);
  };

  const handleNuevaMembresia = () => {
    setMembresiaSeleccionada(null);
    setMostrarModal(true);
  };

  const handleEditarMembresia = (membresia) => {
    setMembresiaSeleccionada(membresia);
    setMostrarModal(true);
  };

  const handleEliminarMembresia = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este tipo de membresía?')) {
      return;
    }

    const result = await window.electronAPI.deleteMembresia(id);
    if (result.success) {
      alert('Membresía eliminada exitosamente');
      cargarMembresias();
    } else {
      alert('Error al eliminar membresía: ' + result.error);
    }
  };

  const handleModalClose = (reload) => {
    setMostrarModal(false);
    setMembresiaSeleccionada(null);
    if (reload) {
      cargarMembresias();
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Tipos de Membresía</h1>
        <p className="page-subtitle">Gestiona los planes de membresía del gimnasio</p>
      </div>

      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Total de membresías: <strong>{membresias.length}</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNuevaMembresia}>
          ➕ Nueva Membresía
        </button>
      </div>

      <div className="card">
        {membresias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎫</div>
            <h3 className="empty-title">No hay membresías configuradas</h3>
            <p className="empty-text">Comienza agregando tu primera membresía</p>
            <button className="btn btn-primary mt-4" onClick={handleNuevaMembresia}>
              ➕ Agregar Membresía
            </button>
          </div>
        ) : (
          <div className="grid grid-3">
            {membresias.map(membresia => (
              <div
                key={membresia.id}
                className="card"
                style={{
                  padding: '1.5rem',
                  background: membresia.activo ? 'var(--bg-primary)' : 'var(--bg-tertiary)',
                  border: membresia.activo ? '2px solid var(--primary)' : '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {membresia.nombre}
                  </h3>
                  <span className={`badge ${membresia.activo ? 'badge-success' : 'badge-danger'}`}>
                    {membresia.activo ? '✅ Activa' : '❌ Inactiva'}
                  </span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Q{membresia.precio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {membresia.duracion_dias} días de duración
                  </div>
                </div>

                {membresia.descripcion && (
                  <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    marginBottom: '1rem',
                    minHeight: '2.5rem'
                  }}>
                    {membresia.descripcion}
                  </p>
                )}

                <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                  <button
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.5rem' }}
                    onClick={() => handleEditarMembresia(membresia)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => handleEliminarMembresia(membresia.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {mostrarModal && (
        <MembresiaModal
          membresia={membresiaSeleccionada}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default TiposMembresia;

