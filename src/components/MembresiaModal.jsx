import React, { useState, useEffect } from 'react';

function MembresiaModal({ membresia, onClose }) {
  const [formData, setFormData] = useState({
    nombre: '',
    duracion_dias: '',
    precio: '',
    descripcion: '',
    activo: 1
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (membresia) {
      setFormData({
        nombre: membresia.nombre || '',
        duracion_dias: membresia.duracion_dias || '',
        precio: membresia.precio || '',
        descripcion: membresia.descripcion || '',
        activo: membresia.activo
      });
    }
  }, [membresia]);

  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (!formData.duracion_dias || formData.duracion_dias <= 0) {
      setError('La duración debe ser mayor a 0 días');
      return;
    }

    if (!formData.precio || formData.precio <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    setGuardando(true);
    setError(null);

    const datosMembresia = {
      nombre: formData.nombre.trim(),
      duracion_dias: parseInt(formData.duracion_dias),
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion.trim(),
      activo: formData.activo ? 1 : 0
    };

    let result;
    if (membresia) {
      result = await window.electronAPI.updateMembresia(membresia.id, datosMembresia);
    } else {
      result = await window.electronAPI.createMembresia(datosMembresia);
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
            {membresia ? 'Editar Membresía' : 'Nueva Membresía'}
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
            <label className="label">Nombre de la Membresía *</label>
            <input
              type="text"
              className="input"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              placeholder="Ej: Mensual, Trimestral, Anual"
              required
            />
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="label">Duración (días) *</label>
              <input
                type="number"
                className="input"
                value={formData.duracion_dias}
                onChange={(e) => handleChange('duracion_dias', e.target.value)}
                placeholder="30"
                min="1"
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Número de días que dura la membresía
              </p>
            </div>

            <div className="form-group">
              <label className="label">Precio (Q) *</label>
              <input
                type="number"
                className="input"
                value={formData.precio}
                onChange={(e) => handleChange('precio', e.target.value)}
                placeholder="150.00"
                step="0.01"
                min="0.01"
                required
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                Precio en Quetzales guatemaltecos
              </p>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Descripción</label>
            <textarea
              className="input"
              value={formData.descripcion}
              onChange={(e) => handleChange('descripcion', e.target.value)}
              rows="3"
              placeholder="Descripción breve de los beneficios"
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleChange('activo', e.target.checked ? 1 : 0)}
                style={{ width: 'auto', margin: 0 }}
              />
              Membresía activa
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginLeft: '1.5rem' }}>
              Solo las membresías activas aparecen al registrar clientes
            </p>
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
              {guardando ? 'Guardando...' : (membresia ? 'Actualizar' : 'Crear Membresía')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MembresiaModal;

