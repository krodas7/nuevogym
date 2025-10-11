import React, { useState, useEffect } from 'react';
import RegistroAsistenciaModal from '../components/RegistroAsistenciaModal';

function Asistencias() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filtros, setFiltros] = useState({
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    cargarAsistencias();
  }, [filtros]);

  const cargarAsistencias = async () => {
    setLoading(true);
    const result = await window.electronAPI.getAsistencias(filtros);
    if (result.success) {
      setAsistencias(result.data);
    }
    setLoading(false);
  };

  const handleRegistrarAsistencia = () => {
    setMostrarModal(true);
  };

  const handleModalClose = (reload) => {
    setMostrarModal(false);
    if (reload) {
      cargarAsistencias();
    }
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const totalAsistencias = asistencias.length;
  const asistenciasHoy = asistencias.filter(a =>
    new Date(a.fecha_hora).toDateString() === new Date().toDateString()
  ).length;

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
        <h1 className="page-title">Asistencias</h1>
        <p className="page-subtitle">Registro de asistencias al gimnasio</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Hoy</span>
            <span className="stat-icon">📅</span>
          </div>
          <div className="stat-value">{asistenciasHoy}</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Total Periodo</span>
            <span className="stat-icon">📊</span>
          </div>
          <div className="stat-value">{totalAsistencias}</div>
        </div>
      </div>

      <div className="card mb-4">
        <h3 className="text-lg font-bold mb-4">Filtros</h3>
        <div className="grid grid-3">
          <div className="form-group">
            <label className="label">Fecha Inicio</label>
            <input
              type="date"
              className="input"
              value={filtros.fecha_inicio}
              onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">Fecha Fin</label>
            <input
              type="date"
              className="input"
              value={filtros.fecha_fin}
              onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="label">&nbsp;</label>
            <button className="btn btn-primary" onClick={handleRegistrarAsistencia}>
              ➕ Registrar Asistencia
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        {asistencias.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            <h3 className="empty-title">No hay asistencias registradas</h3>
            <p className="empty-text">Comienza registrando la primera asistencia</p>
            <button className="btn btn-primary mt-4" onClick={handleRegistrarAsistencia}>
              ➕ Registrar Asistencia
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Fecha y Hora</th>
                  <th>Tipo</th>
                  <th>Método</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map(asistencia => (
                  <tr key={asistencia.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {asistencia.foto ? (
                          <img
                            src={asistencia.foto}
                            alt={asistencia.nombre || 'Cliente'}
                            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#475569'
                            }}
                          >
                            {asistencia.nombre ? asistencia.nombre.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        <span className="font-bold">{asistencia.nombre || 'Cliente desconocido'}</span>
                      </div>
                    </td>
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

      {mostrarModal && (
        <RegistroAsistenciaModal onClose={handleModalClose} />
      )}
    </div>
  );
}

export default Asistencias;

