import React, { useState } from 'react';
import '../Login.css';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('🔐 Intentando login con usuario:', usuario);

    if (!usuario.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    console.log('🔐 Enviando credenciales...');

    try {
      const result = await window.electronAPI.login(usuario, password);
      console.log('🔐 Respuesta del login:', result);

      if (result.success) {
        console.log('✅ Login exitoso:', result.data);
        // Guardar sesión en localStorage
        localStorage.setItem('usuario', JSON.stringify(result.data));
        onLogin(result.data);
      } else {
        console.error('❌ Login fallido:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('❌ Error en login:', err);
      setError('Error al conectar con el servidor');
    }

    setCargando(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-icon">
            <img 
              src="images/apple-touch-icon.png" 
              alt="NuevoGym Logo"
              style={{ 
                width: 100, 
                height: 100, 
                objectFit: 'contain',
                margin: '0 auto',
                display: 'block'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="font-size: 4rem">💪</div>';
              }}
            />
          </div>
          <h1 className="login-title">NuevoGym</h1>
          <p className="login-subtitle">Sistema de Gestión</p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            <span>❌</span>
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Usuario</label>
            <input
              type="text"
              className="input"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              autoFocus
              disabled={cargando}
            />
          </div>

          <div className="form-group">
            <label className="label">Contraseña</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={cargando}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={cargando}
          >
            {cargando ? 'Iniciando sesión...' : '🔐 Iniciar Sesión'}
          </button>
        </form>

        <div className="login-footer">
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center', marginTop: '1.5rem' }}>
            Usuario por defecto: <strong>admin</strong><br />
            Contraseña: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

