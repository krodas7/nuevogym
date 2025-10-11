import React, { useState, useEffect } from 'react';
import RenovacionModal from '../components/RenovacionModal';

function RenovarMembresias() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    filtrarClientes();
  }, [busqueda, filtroEstado, clientes]);

  const cargarClientes = async () => {
    setLoading(true);
    const result = await window.electronAPI.getClientes();
    if (result.success) {
      setClientes(result.data);
    }
    setLoading(false);
  };

  const filtrarClientes = () => {
    let filtrados = [...clientes];
    
    // Filtro de búsqueda
    if (busqueda.trim()) {
      filtrados = filtrados.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (cliente.telefono && cliente.telefono.includes(busqueda))
      );
    }

    // Filtro por estado
    const hoy = new Date();
    const en7dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (filtroEstado === 'vencidas') {
      filtrados = filtrados.filter(c => new Date(c.fecha_vencimiento) < hoy);
    } else if (filtroEstado === 'proximas') {
      filtrados = filtrados.filter(c => {
        const vence = new Date(c.fecha_vencimiento);
        return vence >= hoy && vence <= en7dias;
      });
    } else if (filtroEstado === 'activas') {
      filtrados = filtrados.filter(c => new Date(c.fecha_vencimiento) >= hoy);
    }

    setClientesFiltrados(filtrados);
  };

  const handleRenovar = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  const handleModalClose = (reload) => {
    setMostrarModal(false);
    setClienteSeleccionado(null);
    if (reload) {
      cargarClientes();
    }
  };

  const getEstadoMembresia = (cliente) => {
    const hoy = new Date();
    const vencimiento = new Date(cliente.fecha_vencimiento);
    const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

    if (vencimiento < hoy) {
      return {
        tipo: 'vencida',
        texto: `Vencida hace ${Math.abs(diasRestantes)} días`,
        badge: 'badge-danger',
        icono: '❌'
      };
    } else if (diasRestantes <= 7) {
      return {
        tipo: 'proxima',
        texto: `${diasRestantes} día${diasRestantes !== 1 ? 's' : ''} restante${diasRestantes !== 1 ? 's' : ''}`,
        badge: 'badge-warning',
        icono: '⚠️'
      };
    } else {
      return {
        tipo: 'activa',
        texto: `${diasRestantes} días restantes`,
        badge: 'badge-success',
        icono: '✅'
      };
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Estadísticas
  const hoy = new Date();
  const vencidas = clientes.filter(c => new Date(c.fecha_vencimiento) < hoy).length;
  const proximasVencer = clientes.filter(c => {
    const v = new Date(c.fecha_vencimiento);
    const en7dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    return v >= hoy && v <= en7dias;
  }).length;
  const activas = clientes.filter(c => new Date(c.fecha_vencimiento) >= hoy).length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Renovar Membresías</h1>
        <p className="page-subtitle">Gestiona las renovaciones de membresías de tus clientes</p>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFiltroEstado('vencidas')}>
          <div className="stat-header">
            <span className="stat-title">Vencidas</span>
            <span className="stat-icon">❌</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{vencidas}</div>
          <div className="stat-footer">Requieren renovación urgente</div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFiltroEstado('proximas')}>
          <div className="stat-header">
            <span className="stat-title">Por Vencer (7 días)</span>
            <span className="stat-icon">⚠️</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{proximasVencer}</div>
          <div className="stat-footer">Vencen en los próximos 7 días</div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFiltroEstado('activas')}>
          <div className="stat-header">
            <span className="stat-title">Activas</span>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{activas}</div>
          <div className="stat-footer">Membresías vigentes</div>
        </div>

        <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => setFiltroEstado('todos')}>
          <div className="stat-header">
            <span className="stat-title">Total Clientes</span>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{clientes.length}</div>
          <div className="stat-footer">Todos los clientes</div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="grid grid-2">
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
            <label className="label">Filtrar por Estado</label>
            <select
              className="input"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los clientes</option>
              <option value="vencidas">❌ Membresías vencidas</option>
              <option value="proximas">⚠️ Próximas a vencer (7 días)</option>
              <option value="activas">✅ Membresías activas</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card">
        {clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔄</div>
            <h3 className="empty-title">No hay clientes para mostrar</h3>
            <p className="empty-text">
              {busqueda ? 'No se encontraron clientes con ese criterio' : 'No hay clientes en este filtro'}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Membresía Actual</th>
                  <th>Fecha Vencimiento</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientesFiltrados.map(cliente => {
                  const estado = getEstadoMembresia(cliente);
                  return (
                    <tr key={cliente.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              borderRadius: '50%',
                              background: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              fontWeight: 600,
                              color: '#475569'
                            }}
                          >
                            {cliente.nombre.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold">{cliente.nombre}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                              {cliente.telefono}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info">
                          {cliente.tipo_membresia}
                        </span>
                      </td>
                      <td>
                        {new Date(cliente.fecha_vencimiento).toLocaleDateString('es-GT', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </td>
                      <td>
                        <span className={`badge ${estado.badge}`}>
                          {estado.icono} {estado.texto}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`btn ${estado.tipo === 'vencida' ? 'btn-danger' : estado.tipo === 'proxima' ? 'btn-warning' : 'btn-success'}`}
                          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                          onClick={() => handleRenovar(cliente)}
                        >
                          🔄 Renovar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && clienteSeleccionado && (
        <RenovacionModal
          cliente={clienteSeleccionado}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default RenovarMembresias;

