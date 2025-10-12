import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { safeElectronCall, ElectronWarning } from '../utils/electronAPI.jsx';

function Dashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cargandoGraficos, setCargandoGraficos] = useState(true);

  useEffect(() => {
    console.log('Dashboard montado, electronAPI disponible:', !!window.electronAPI);
    cargarEstadisticas();
  }, []);

  // Auto-actualizar dashboard cuando hay eventos del sensor
  useEffect(() => {
    if (!window.electronAPI) return;

    const handleSensorData = (data) => {
      console.log('📊 Dashboard: Evento del sensor detectado, actualizando estadísticas...');
      // Recargar estadísticas cuando hay una asistencia nueva
      if (data.type === 'fingerprint_success') {
        setTimeout(() => {
          cargarEstadisticas();
        }, 1000); // Esperar 1 segundo para que se guarde la asistencia
      }
    };

    window.electronAPI.onSensorData(handleSensorData);

    return () => {
      window.electronAPI.removeSensorDataListener();
    };
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    
    // Mostrar datos básicos inmediatamente
    setEstadisticas({
      totalClientes: 0,
      clientesActivos: 0,
      clientesVencidos: 0,
      membresiasProximasVencer: 0,
      clientesProximosVencer: [],
      asistenciasHoy: 0,
      asistenciasSemana: [],
      ingresosHoy: 0,
      ingresosMes: 0
    });

    try {
      // Usar función segura
      const result = await safeElectronCall('getEstadisticas');
      
      if (result && result.success) {
        setEstadisticas(result.data);
      } else {
        console.error('⚠️ Error en getEstadisticas:', result);
        setEstadisticas({
          totalClientes: 0,
          clientesActivos: 0,
          clientesVencidos: 0,
          membresiasProximasVencer: 0,
          clientesProximosVencer: [],
          asistenciasHoy: 0,
          asistenciasSemana: [],
          ingresosHoy: 0,
          ingresosMes: 0,
          error: result?.error || 'Error al cargar datos'
        });
      }
    } catch (error) {
      console.error('❌ Error al cargar estadísticas:', error);
      setEstadisticas({
        totalClientes: 0,
        clientesActivos: 0,
        clientesVencidos: 0,
        membresiasProximasVencer: 0,
        clientesProximosVencer: [],
        asistenciasHoy: 0,
        asistenciasSemana: [],
        ingresosHoy: 0,
        ingresosMes: 0,
        error: error.message
      });
    }
    
    setLoading(false);
    
    // Cargar gráficos después de un breve delay para mejor UX
    setTimeout(() => {
      setCargandoGraficos(false);
    }, 500);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div className="spinner" style={{ marginBottom: '1rem' }}></div>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Cargando Dashboard...</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Preparando las estadísticas del gimnasio
        </p>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⏳</div>
        <h3 className="empty-title">Cargando estadísticas...</h3>
        <p className="empty-text" style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
          Preparando el dashboard para ti.
        </p>
      </div>
    );
  }

  // Formatear datos para el gráfico
  const chartData = estadisticas.asistenciasSemana ? estadisticas.asistenciasSemana.map(item => ({
    fecha: new Date(item.fecha).toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric' }),
    asistencias: item.count
  })) : [];

  // Mostrar error si hay problemas con electronAPI
  if (estadisticas?.error) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vista general del gimnasio</p>
        </div>
        <div className="card">
          <div className="alert alert-warning" style={{ background: '#fff3cd', borderColor: '#ffc107', color: '#856404' }}>
            <span>⚠️</span>
            <div>
              <strong>Aplicación Desktop</strong><br />
              {estadisticas.error}<br />
              <small>Por favor ejecuta la aplicación usando Electron (npm start o el instalador .exe)</small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vista general del gimnasio</p>
        </div>
        <button 
          className="btn btn-outline btn-sm"
          onClick={cargarEstadisticas}
          disabled={loading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {estadisticas.totalClientes === 0 && (
        <div className="alert alert-warning mb-4">
          <span>🎯</span>
          <div>
            <strong>¡Bienvenido a NuevoGym!</strong> Tu sistema está listo. Comienza registrando tu primer cliente en la sección de <strong>Clientes</strong>.
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Clientes Registrados</span>
            <span className="stat-icon">👥</span>
          </div>
          <div className="stat-value">{estadisticas.totalClientes || 0}</div>
          <div className="stat-footer">
            {estadisticas.clientesActivos || 0} con membresía activa
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Asistencias Hoy</span>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-value">{estadisticas.asistenciasHoy || 0}</div>
          <div className="stat-footer">
            Registradas el día de hoy
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Ingresos del Mes</span>
            <span className="stat-icon">💰</span>
          </div>
          <div className="stat-value">
            Q{(estadisticas.ingresosMes || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}
          </div>
          <div className="stat-footer">
            Total del mes actual
          </div>
        </div>

        <div className="stat-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div className="stat-header">
            <span className="stat-title">Próximas a Vencer</span>
            <span className="stat-icon">⚠️</span>
          </div>
          <div className="stat-value">{estadisticas.membresiasProximasVencer || 0}</div>
          <div className="stat-footer">
            Membresías en los próximos 7 días
          </div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Asistencias de la Última Semana</h2>
          {cargandoGraficos ? (
            <div className="loading" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Cargando gráfico...</p>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="asistencias" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-icon" style={{ fontSize: '3rem' }}>📊</div>
              <p className="empty-text">No hay asistencias registradas aún</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Registra tu primera asistencia para ver las estadísticas aquí
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Membresías Próximas a Vencer</h2>
          {estadisticas.clientesProximosVencer && estadisticas.clientesProximosVencer.length > 0 ? (
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {estadisticas.clientesProximosVencer.map(cliente => {
                const diasRestantes = Math.ceil((new Date(cliente.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div 
                    key={cliente.id}
                    style={{
                      padding: '0.75rem',
                      marginBottom: '0.5rem',
                      background: diasRestantes <= 3 ? '#fee2e2' : '#fef3c7',
                      borderRadius: '0.5rem',
                      borderLeft: `4px solid ${diasRestantes <= 3 ? '#ef4444' : '#f59e0b'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                          {cliente.nombre}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {cliente.telefono} • {cliente.tipo_membresia}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: diasRestantes <= 3 ? '#991b1b' : '#92400e' }}>
                          {diasRestantes === 0 ? 'Vence hoy' : `${diasRestantes} día${diasRestantes > 1 ? 's' : ''}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(cliente.fecha_vencimiento).toLocaleDateString('es-GT', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon" style={{ fontSize: '3rem' }}>✅</div>
              <p className="empty-text">
                {estadisticas.totalClientes === 0 
                  ? 'Sin clientes registrados' 
                  : 'No hay membresías próximas a vencer'}
              </p>
              {estadisticas.totalClientes === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Aquí verás las membresías que vencen en los próximos 7 días
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {estadisticas.clientesVencidos > 0 && (
        <div className="alert alert-warning mt-4">
          <span>⚠️</span>
          <div>
            <strong>Atención:</strong> Hay {estadisticas.clientesVencidos} cliente(s) con membresía vencida que necesitan renovar.
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

