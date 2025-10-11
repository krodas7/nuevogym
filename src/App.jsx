import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  ChartBarIcon,
  UsersIcon,
  CheckCircleIcon,
  TicketIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import AnimatedGymBuddy from './components/AnimatedGymBuddy';
import NotificacionSensor from './components/NotificacionSensor';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Asistencias from './pages/Asistencias';
import TiposMembresia from './pages/TiposMembresia';
import RenovarMembresias from './pages/RenovarMembresias';
import Reportes from './pages/Reportes';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';
import './App.css';
import './theme.css';

function AppContent() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [notificacionSensor, setNotificacionSensor] = useState(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    console.log('🚀 App iniciando...');
    // Verificar si hay sesión guardada
    const usuarioGuardado = localStorage.getItem('usuario');
    console.log('👤 Usuario guardado en localStorage:', usuarioGuardado);
    if (usuarioGuardado) {
      const user = JSON.parse(usuarioGuardado);
      console.log('✅ Sesión encontrada:', user);
      setUsuario(user);
    } else {
      console.log('❌ No hay sesión guardada');
    }
    setCargando(false);
  }, []);

  // Escuchar eventos del sensor de huellas
  useEffect(() => {
    if (!window.electronAPI || !usuario) return;

    console.log('👂 Escuchando eventos del sensor...');

    const handleSensorData = (data) => {
      console.log('📡 Evento del sensor recibido:', data);
      setNotificacionSensor(data);
    };

    window.electronAPI.onSensorData(handleSensorData);

    return () => {
      window.electronAPI.removeSensorDataListener();
    };
  }, [usuario]);

  const handleLogin = (user) => {
    console.log('🔐 handleLogin llamado con:', user);
    setUsuario(user);
    console.log('✅ Usuario establecido en App.jsx');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  if (cargando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      {!usuario ? (
        <Login onLogin={handleLogin} />
      ) : (
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div style={{ 
              width: 60, 
              height: 60, 
              background: 'rgba(255, 255, 255, 0.15)', 
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.5rem',
              padding: '0.4rem',
              overflow: 'hidden'
            }}>
              <img 
                src="images/apple-touch-icon.png" 
                alt="NuevoGym Logo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span style="font-size: 2rem">💪</span>';
                }}
              />
            </div>
            <h1 className="sidebar-title" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>NuevoGym</h1>
            <p className="sidebar-subtitle" style={{ fontSize: '0.7rem' }}>Sistema de Gestión</p>
          </div>
          
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <ChartBarIcon className="nav-icon" />
              Dashboard
            </NavLink>
            <NavLink to="clientes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <UsersIcon className="nav-icon" />
              Clientes
            </NavLink>
            <NavLink to="asistencias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <CheckCircleIcon className="nav-icon" />
              Asistencias
            </NavLink>
            <NavLink to="membresias" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <TicketIcon className="nav-icon" />
              Tipos de Membresía
            </NavLink>
            <NavLink to="renovar" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <ArrowPathIcon className="nav-icon" />
              Renovar Membresías
            </NavLink>
            <NavLink to="reportes" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <DocumentChartBarIcon className="nav-icon" />
              Reportes
            </NavLink>
            <NavLink to="usuarios" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <UserGroupIcon className="nav-icon" />
              Usuarios
            </NavLink>
            <NavLink to="configuracion" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <Cog6ToothIcon className="nav-icon" />
              Configuración
            </NavLink>
          </nav>

      {/* Información del usuario y logout */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: 'auto', flexShrink: 0 }}>
        <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{usuario.nombre_completo}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>@{usuario.usuario}</div>
        </div>
        <button
          onClick={toggleTheme}
          className="btn btn-outline"
          style={{
            width: '100%',
            padding: '0.4rem',
            fontSize: '0.8rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            marginBottom: '0.4rem'
          }}
        >
          {theme === 'light' ? (
            <><MoonIcon style={{ width: '1rem', height: '1rem' }} /> Modo Oscuro</>
          ) : (
            <><SunIcon style={{ width: '1rem', height: '1rem' }} /> Modo Claro</>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{
            width: '100%',
            padding: '0.4rem',
            fontSize: '0.8rem',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          <ArrowRightOnRectangleIcon style={{ width: '1rem', height: '1rem' }} />
          Cerrar Sesión
        </button>
      </div>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="asistencias" element={<Asistencias />} />
            <Route path="membresias" element={<TiposMembresia />} />
            <Route path="renovar" element={<RenovarMembresias />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Notificación del sensor */}
        {notificacionSensor && (
          <NotificacionSensor 
            tipo={notificacionSensor.type}
            cliente={notificacionSensor.cliente}
            onClose={() => setNotificacionSensor(null)}
          />
        )}
      </div>
      )}
    </Router>
  );
}

// Wrapper principal con ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

