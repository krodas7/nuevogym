import React, { useState, useEffect } from 'react';
import NuevoClienteModal from '../components/NuevoClienteModal';
import ClienteDetalle from '../components/ClienteDetalle';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 10;

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    if (busqueda.trim()) {
      const filtrados = clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        (cliente.telefono && cliente.telefono.includes(busqueda))
      );
      setClientesFiltrados(filtrados);
    } else {
      setClientesFiltrados(clientes);
    }
  }, [busqueda, clientes]);

  const cargarClientes = async () => {
    setLoading(true);
    const result = await window.electronAPI.getClientes();
    if (result.success) {
      setClientes(result.data);
      setClientesFiltrados(result.data);
    }
    setLoading(false);
  };

  const handleNuevoCliente = () => {
    setClienteSeleccionado(null);
    setMostrarModal(true);
  };

  const handleEditarCliente = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarModal(true);
  };

  const handleVerDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setMostrarDetalle(true);
  };

  const handleEliminarCliente = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      return;
    }

    const result = await window.electronAPI.deleteCliente(id);
    if (result.success) {
      alert('Cliente eliminado exitosamente');
      cargarClientes();
    } else {
      alert('Error al eliminar cliente: ' + result.error);
    }
  };

  const handleModalClose = (reload) => {
    setMostrarModal(false);
    setClienteSeleccionado(null);
    if (reload) {
      cargarClientes();
    }
  };

  const handleDetalleClose = (reload) => {
    setMostrarDetalle(false);
    setClienteSeleccionado(null);
    if (reload) {
      cargarClientes();
    }
  };

  const esMembresiaNormal = (cliente) => {
    const hoy = new Date().toISOString().split('T')[0];
    return cliente.fecha_vencimiento >= hoy;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Calcular paginación
  const indexUltimo = paginaActual * clientesPorPagina;
  const indexPrimero = indexUltimo - clientesPorPagina;
  const clientesPaginados = clientesFiltrados.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Clientes</h1>
        <p className="page-subtitle">
          Gestión de clientes del gimnasio • {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o teléfono..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1); // Resetear a página 1 al buscar
            }}
          />
        </div>
        <button className="btn btn-primary" onClick={handleNuevoCliente}>
          ➕ Nuevo Cliente
        </button>
      </div>

      <div className="card">
        {clientesFiltrados.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3 className="empty-title">No hay clientes</h3>
            <p className="empty-text">
              {busqueda ? 'No se encontraron clientes con ese criterio de búsqueda' : 'Comienza agregando tu primer cliente'}
            </p>
            {!busqueda && (
              <button className="btn btn-primary mt-4" onClick={handleNuevoCliente}>
                ➕ Agregar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Membresía</th>
                  <th>Vencimiento</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clientesPaginados.map(cliente => (
                  <tr key={cliente.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        {cliente.foto ? (
                          <img
                            src={cliente.foto}
                            alt={cliente.nombre}
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
                            {cliente.nombre.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-bold">{cliente.nombre}</span>
                      </div>
                    </td>
                    <td>{cliente.telefono || '-'}</td>
                    <td>{cliente.tipo_membresia}</td>
                    <td>{new Date(cliente.fecha_vencimiento).toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
                    <td>
                      {esMembresiaNormal(cliente) ? (
                        <span className="badge badge-success">Activa</span>
                      ) : (
                        <span className="badge badge-danger">Vencida</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleVerDetalle(cliente)}
                        >
                          👁️ Ver
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleEditarCliente(cliente)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleEliminarCliente(cliente.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Controles de paginación */}
        {totalPaginas > 1 && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginTop: '1.5rem',
            padding: '1rem',
            borderTop: '1px solid var(--border-color)'
          }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Mostrando {indexPrimero + 1}-{Math.min(indexUltimo, clientesFiltrados.length)} de {clientesFiltrados.length}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setPaginaActual(prev => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
              >
                ← Anterior
              </button>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(totalPaginas)].map((_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${paginaActual === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setPaginaActual(i + 1)}
                    style={{ minWidth: '2.5rem' }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setPaginaActual(prev => Math.min(prev + 1, totalPaginas))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}
      </div>

      {mostrarModal && (
        <NuevoClienteModal
          cliente={clienteSeleccionado}
          onClose={handleModalClose}
        />
      )}

      {mostrarDetalle && clienteSeleccionado && (
        <ClienteDetalle
          cliente={clienteSeleccionado}
          onClose={handleDetalleClose}
          onEdit={() => {
            setMostrarDetalle(false);
            handleEditarCliente(clienteSeleccionado);
          }}
        />
      )}
    </div>
  );
}

export default Clientes;

