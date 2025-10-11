import React, { useState, useEffect } from 'react';

function UsuarioModal({ usuario, onClose }) {
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    confirmarPassword: '',
    nombre_completo: '',
    rol: 'admin',
    activo: 1
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        usuario: usuario.usuario || '',
        password: '',
        confirmarPassword: '',
        nombre_completo: usuario.nombre_completo || '',
        rol: usuario.rol || 'admin',
        activo: usuario.activo
      });
    }
  }, [usuario]);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.usuario.trim()) {
      setError('El usuario es obligatorio');
      return;
    }

    if (!formData.nombre_completo.trim()) {
      setError('El nombre completo es obligatorio');
      return;
    }

    // Si es nuevo usuario, la contraseña es obligatoria
    if (!usuario && !formData.password) {
      setError('La contraseña es obligatoria');
      return;
    }

    // Si ingresó contraseña, validar confirmación
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }

      if (formData.password !== formData.confirmarPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
    }

    setGuardando(true);
    setError(null);

    const datosUsuario = {
      usuario: formData.usuario.trim(),
      nombre_completo: formData.nombre_completo.trim(),
      rol: formData.rol,
      activo: formData.activo ? 1 : 0
    };

    // Solo incluir password si se ingresó uno nuevo
    if (formData.password) {
      datosUsuario.password = formData.password;
    }

    let result;
    if (usuario) {
      result = await window.electronAPI.updateUsuario(usuario.id, datosUsuario);
    } else {
      datosUsuario.password = formData.password; // Para nuevo usuario es obligatorio
      result = await window.electronAPI.createUsuario(datosUsuario);
    }

    if (result.success) {
      onClose(true);
    } else {
      setError(result.error);
      setGuardando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
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
            <label className="label">Nombre de Usuario *</label>
            <input
              type="text"
              className="input"
              value={formData.usuario}
              onChange={(e) => handleChange('usuario', e.target.value)}
              placeholder="Ej: jperez"
              required
              autoFocus
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Este será el usuario para iniciar sesión
            </p>
          </div>

          <div className="form-group">
            <label className="label">Nombre Completo *</label>
            <input
              type="text"
              className="input"
              value={formData.nombre_completo}
              onChange={(e) => handleChange('nombre_completo', e.target.value)}
              placeholder="Juan Pérez"
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">
                {usuario ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
              </label>
              <input
                type="password"
                className="input"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required={!usuario}
              />
            </div>

            <div className="form-group">
              <label className="label">
                {usuario ? 'Confirmar Nueva Contraseña' : 'Confirmar Contraseña *'}
              </label>
              <input
                type="password"
                className="input"
                value={formData.confirmarPassword}
                onChange={(e) => handleChange('confirmarPassword', e.target.value)}
                placeholder="Repetir contraseña"
                required={!usuario || formData.password}
              />
            </div>
          </div>

          {usuario && (
            <div className="alert alert-warning" style={{ marginBottom: '1rem' }}>
              <span>ℹ️</span>
              <div>
                <strong>Nota:</strong> Deja los campos de contraseña vacíos si no deseas cambiarla.
              </div>
            </div>
          )}

          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">Rol</label>
              <select
                className="input"
                value={formData.rol}
                onChange={(e) => handleChange('rol', e.target.value)}
              >
                <option value="admin">👑 Administrador</option>
                <option value="usuario">👤 Usuario</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Los administradores tienen acceso completo
              </p>
            </div>

            <div className="form-group">
              <label className="label">Estado</label>
              <select
                className="input"
                value={formData.activo}
                onChange={(e) => handleChange('activo', parseInt(e.target.value))}
              >
                <option value={1}>✅ Activo</option>
                <option value={0}>❌ Inactivo</option>
              </select>
            </div>
          </div>

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
              {guardando ? 'Guardando...' : (usuario ? 'Actualizar Usuario' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioModal;

