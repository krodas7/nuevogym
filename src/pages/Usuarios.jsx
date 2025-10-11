import React, { useState, useEffect } from 'react';
import UsuarioModal from '../components/UsuarioModal';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    // Obtener usuario actual
    const user = JSON.parse(localStorage.getItem('usuario') || '{}');
    setUsuarioActual(user);
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setLoading(true);
    const result = await window.electronAPI.getUsuarios();
    if (result.success) {
      setUsuarios(result.data);
    }
    setLoading(false);
  };

  const handleNuevoUsuario = () => {
    setUsuarioSeleccionado(null);
    setMostrarModal(true);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
  };

  const handleEliminarUsuario = async (id) => {
    if (id === usuarioActual?.id) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      return;
    }

    const result = await window.electronAPI.deleteUsuario(id);
    if (result.success) {
      alert('Usuario desactivado exitosamente');
      cargarUsuarios();
    } else {
      alert('Error al desactivar usuario: ' + result.error);
    }
  };

  const handleModalClose = (reload) => {
    setMostrarModal(false);
    setUsuarioSeleccionado(null);
    if (reload) {
      cargarUsuarios();
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
        <h1 className="page-title">Usuarios y Permisos</h1>
        <p className="page-subtitle">Gestiona los usuarios del sistema</p>
      </div>

      <div className="toolbar">
        <div style={{ flex: 1 }}>
          <p style={{ color: 'var(--text-secondary)' }}>
            Total de usuarios: <strong>{usuarios.length}</strong> ({usuarios.filter(u => u.activo).length} activos)
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNuevoUsuario}>
          ➕ Nuevo Usuario
        </button>
      </div>

      <div className="card">
        {usuarios.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h3 className="empty-title">No hay usuarios</h3>
            <p className="empty-text">Comienza agregando tu primer usuario</p>
            <button className="btn btn-primary mt-4" onClick={handleNuevoUsuario}>
              ➕ Agregar Usuario
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre Completo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(usuario => (
                  <tr key={usuario.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: usuario.activo ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#94a3b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.875rem'
                          }}
                        >
                          {usuario.nombre_completo.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold">@{usuario.usuario}</span>
                      </div>
                    </td>
                    <td>{usuario.nombre_completo}</td>
                    <td>
                      <span className={`badge ${usuario.rol === 'admin' ? 'badge-info' : 'badge-success'}`}>
                        {usuario.rol === 'admin' ? '👑 Administrador' : '👤 Usuario'}
                      </span>
                    </td>
                    <td>
                      {usuario.activo ? (
                        <span className="badge badge-success">✅ Activo</span>
                      ) : (
                        <span className="badge badge-danger">❌ Inactivo</span>
                      )}
                    </td>
                    <td>{new Date(usuario.created_at).toLocaleDateString('es-GT')}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                          onClick={() => handleEditarUsuario(usuario)}
                        >
                          ✏️ Editar
                        </button>
                        {usuario.id !== usuarioActual?.id && (
                          <button
                            className="btn btn-danger"
                            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
                            onClick={() => handleEliminarUsuario(usuario.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {mostrarModal && (
        <UsuarioModal
          usuario={usuarioSeleccionado}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default Usuarios;

