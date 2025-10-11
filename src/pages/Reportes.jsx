import React, { useState } from 'react';

function Reportes() {
  const [tipoReporte, setTipoReporte] = useState('clientes');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [generando, setGenerando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const generarReporte = async () => {
    setGenerando(true);
    setResultado(null);

    try {
      let data;
      
      switch (tipoReporte) {
        case 'clientes':
          data = await generarReporteClientes();
          break;
        case 'asistencias':
          data = await generarReporteAsistencias();
          break;
        case 'ingresos':
          data = await generarReporteIngresos();
          break;
        case 'membresias':
          data = await generarReporteMembresias();
          break;
        case 'tickets':
          data = await generarReporteTickets();
          break;
        default:
          break;
      }

      setResultado(data);
    } catch (error) {
      alert('Error al generar reporte: ' + error.message);
    }

    setGenerando(false);
  };

  const generarReporteClientes = async () => {
    const result = await window.electronAPI.getClientes();
    if (result.success) {
      const clientes = result.data;
      const hoy = new Date().toISOString().split('T')[0];
      
      return {
        titulo: 'Reporte de Clientes',
        resumen: {
          total: clientes.length,
          activos: clientes.filter(c => c.fecha_vencimiento >= hoy).length,
          vencidos: clientes.filter(c => c.fecha_vencimiento < hoy).length
        },
        datos: clientes,
        columnas: ['ID', 'Nombre', 'Teléfono', 'Membresía', 'Vencimiento', 'Estado']
      };
    }
    return null;
  };

  const generarReporteAsistencias = async () => {
    const result = await window.electronAPI.getAsistencias({
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    });
    
    if (result.success) {
      const asistencias = result.data;
      
      // Agrupar por fecha
      const porFecha = {};
      asistencias.forEach(a => {
        const fecha = new Date(a.fecha_hora).toLocaleDateString('es-GT');
        porFecha[fecha] = (porFecha[fecha] || 0) + 1;
      });

      return {
        titulo: 'Reporte de Asistencias',
        periodo: `${new Date(fechaInicio).toLocaleDateString('es-GT')} - ${new Date(fechaFin).toLocaleDateString('es-GT')}`,
        resumen: {
          total: asistencias.length,
          promedioDiario: Object.keys(porFecha).length > 0 
            ? (asistencias.length / Object.keys(porFecha).length).toFixed(1)
            : 0,
          dias: Object.keys(porFecha).length
        },
        datos: asistencias,
        columnas: ['Fecha/Hora', 'Cliente', 'Tipo', 'Método'],
        porFecha
      };
    }
    return null;
  };

  const generarReporteIngresos = async () => {
    const resultPagos = await window.electronAPI.getPagos();
    const resultClientes = await window.electronAPI.getClientes();
    
    if (resultPagos.success && resultClientes.success) {
      let pagos = resultPagos.data;
      const clientes = resultClientes.data;
      
      // Crear mapa de clientes para búsqueda rápida
      const clientesMap = {};
      clientes.forEach(c => {
        clientesMap[c.id] = c.nombre;
      });
      
      // Filtrar por fechas y agregar nombre del cliente
      pagos = pagos.filter(p => {
        const fecha = p.fecha_pago.split(' ')[0];
        return fecha >= fechaInicio && fecha <= fechaFin;
      }).map(p => ({
        ...p,
        cliente_nombre: clientesMap[p.cliente_id] || 'Cliente desconocido'
      }));

      const totalIngresos = pagos.reduce((sum, p) => sum + p.monto, 0);
      
      // Agrupar por método de pago
      const porMetodo = {};
      pagos.forEach(p => {
        porMetodo[p.metodo_pago] = (porMetodo[p.metodo_pago] || 0) + p.monto;
      });

      return {
        titulo: 'Reporte de Ingresos',
        periodo: `${new Date(fechaInicio).toLocaleDateString('es-GT')} - ${new Date(fechaFin).toLocaleDateString('es-GT')}`,
        resumen: {
          total: totalIngresos,
          cantidad: pagos.length,
          promedio: pagos.length > 0 ? (totalIngresos / pagos.length) : 0
        },
        datos: pagos,
        columnas: ['Fecha', 'Cliente', 'Monto', 'Método', 'Concepto'],
        porMetodo
      };
    }
    return null;
  };

  const generarReporteMembresias = async () => {
    const result = await window.electronAPI.getClientes();
    
    if (result.success) {
      const clientes = result.data;
      const hoy = new Date();
      const en7dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
      const en30dias = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const proximasVencer = clientes.filter(c => {
        const vencimiento = new Date(c.fecha_vencimiento);
        return vencimiento >= hoy && vencimiento <= en30dias;
      }).sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));

      return {
        titulo: 'Reporte de Membresías',
        resumen: {
          vencen7dias: clientes.filter(c => {
            const v = new Date(c.fecha_vencimiento);
            return v >= hoy && v <= en7dias;
          }).length,
          vencen30dias: proximasVencer.length,
          vencidas: clientes.filter(c => new Date(c.fecha_vencimiento) < hoy).length
        },
        datos: proximasVencer,
        columnas: ['Cliente', 'Teléfono', 'Membresía', 'Vencimiento', 'Días Restantes']
      };
    }
    return null;
  };

  const generarReporteTickets = async () => {
    const result = await window.electronAPI.getTickets();
    
    if (result.success) {
      let tickets = result.data;
      
      // Filtrar por mes seleccionado
      const [year, month] = mesSeleccionado.split('-');
      tickets = tickets.filter(t => {
        const fechaTicket = new Date(t.fecha_generacion);
        return fechaTicket.getFullYear() === parseInt(year) && 
               (fechaTicket.getMonth() + 1) === parseInt(month);
      });

      // Ordenar por número de ticket descendente
      tickets.sort((a, b) => b.numero_ticket - a.numero_ticket);

      const totalIngresos = tickets.reduce((sum, t) => sum + (t.monto || 0), 0);
      
      // Agrupar por tipo de ticket
      const porTipo = {};
      tickets.forEach(t => {
        porTipo[t.tipo_ticket] = (porTipo[t.tipo_ticket] || 0) + 1;
      });

      // Agrupar por método de pago
      const porMetodo = {};
      tickets.forEach(t => {
        if (t.metodo_pago) {
          porMetodo[t.metodo_pago] = (porMetodo[t.metodo_pago] || 0) + (t.monto || 0);
        }
      });

      const nombreMes = new Date(mesSeleccionado + '-01').toLocaleDateString('es-GT', { 
        month: 'long', 
        year: 'numeric' 
      });

      return {
        titulo: 'Reporte de Tickets Generados',
        periodo: nombreMes,
        resumen: {
          total: tickets.length,
          totalIngresos: totalIngresos,
          promedio: tickets.length > 0 ? (totalIngresos / tickets.length) : 0
        },
        datos: tickets,
        columnas: ['# Ticket', 'Cliente', 'Tipo', 'Monto', 'Método Pago', 'Fecha'],
        porTipo,
        porMetodo
      };
    }
    return null;
  };

  const exportarCSV = () => {
    if (!resultado || !resultado.datos) return;

    let csv = '';
    
    // Encabezado
    csv += resultado.columnas.join(',') + '\n';
    
    // Datos
    resultado.datos.forEach(item => {
      const fila = [];
      switch (tipoReporte) {
        case 'clientes':
          fila.push(item.id, `"${item.nombre}"`, item.telefono, item.tipo_membresia, item.fecha_vencimiento, 
            new Date(item.fecha_vencimiento) >= new Date() ? 'Activa' : 'Vencida');
          break;
        case 'asistencias':
          fila.push(
            new Date(item.fecha_hora).toLocaleString('es-GT'),
            `"${item.nombre || 'Cliente desconocido'}"`,
            item.tipo_entrada || item.tipo || 'entrada',
            item.metodo_verificacion || item.metodo || 'manual'
          );
          break;
        case 'ingresos':
          fila.push(
            new Date(item.fecha_pago).toLocaleDateString('es-GT'),
            `"${item.cliente_nombre || 'Cliente desconocido'}"`,
            item.monto,
            item.metodo_pago,
            `"${item.concepto || item.descripcion || '-'}"`
          );
          break;
        case 'membresias':
          const dias = Math.ceil((new Date(item.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
          fila.push(
            `"${item.nombre}"`,
            item.telefono,
            item.tipo_membresia,
            item.fecha_vencimiento,
            dias
          );
          break;
        case 'tickets':
          let clienteNombre = 'N/A';
          try {
            const datos = typeof item.datos_json === 'string' ? JSON.parse(item.datos_json) : item.datos_json;
            clienteNombre = datos?.cliente?.nombre || 'N/A';
          } catch (e) {
            clienteNombre = 'N/A';
          }
          fila.push(
            String(item.numero_ticket).padStart(6, '0'),
            `"${clienteNombre}"`,
            item.tipo_ticket,
            item.monto || 0,
            item.metodo_pago || '-',
            new Date(item.fecha_generacion).toLocaleString('es-GT')
          );
          break;
      }
      csv += fila.join(',') + '\n';
    });

    // Descargar archivo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${tipoReporte}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const imprimir = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reportes</h1>
        <p className="page-subtitle">Genera reportes del gimnasio</p>
      </div>

      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Configuración del Reporte</h2>
        
        <div className="grid grid-2">
          <div className="form-group">
            <label className="label">Tipo de Reporte</label>
            <select
              className="input"
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
            >
              <option value="clientes">📊 Clientes</option>
              <option value="asistencias">✅ Asistencias</option>
              <option value="ingresos">💰 Ingresos</option>
              <option value="membresias">⚠️ Membresías por Vencer</option>
              <option value="tickets">🎫 Tickets Generados</option>
            </select>
          </div>

          <div></div>

          {tipoReporte === 'tickets' && (
            <div className="form-group">
              <label className="label">Mes y Año</label>
              <input
                type="month"
                className="input"
                value={mesSeleccionado}
                onChange={(e) => setMesSeleccionado(e.target.value)}
              />
            </div>
          )}

          {(tipoReporte === 'asistencias' || tipoReporte === 'ingresos') && (
            <>
              <div className="form-group">
                <label className="label">Fecha Inicio</label>
                <input
                  type="date"
                  className="input"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="label">Fecha Fin</label>
                <input
                  type="date"
                  className="input"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2" style={{ marginTop: '1rem' }}>
          <button
            className="btn btn-primary"
            onClick={generarReporte}
            disabled={generando}
          >
            {generando ? '⏳ Generando...' : '📊 Generar Reporte'}
          </button>

          {resultado && (
            <>
              <button
                className="btn btn-success"
                onClick={exportarCSV}
              >
                📥 Exportar Excel/CSV
              </button>
              <button
                className="btn btn-secondary"
                onClick={imprimir}
              >
                🖨️ Imprimir
              </button>
            </>
          )}
        </div>
      </div>

      {resultado && (
        <div className="card" id="reporte-content">
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 className="text-2xl font-bold" style={{ marginBottom: '0.5rem' }}>
              {resultado.titulo}
            </h2>
            {resultado.periodo && (
              <p style={{ color: 'var(--text-secondary)' }}>
                Período: {resultado.periodo}
              </p>
            )}
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Generado el {new Date().toLocaleString('es-GT')}
            </p>
          </div>

          {/* Resumen */}
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {tipoReporte === 'clientes' && (
              <>
                <div className="stat-card">
                  <div className="stat-title">Total Clientes</div>
                  <div className="stat-value">{resultado.resumen.total}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Activos</div>
                  <div className="stat-value" style={{ color: 'var(--success)' }}>
                    {resultado.resumen.activos}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Vencidos</div>
                  <div className="stat-value" style={{ color: 'var(--danger)' }}>
                    {resultado.resumen.vencidos}
                  </div>
                </div>
              </>
            )}

            {tipoReporte === 'asistencias' && (
              <>
                <div className="stat-card">
                  <div className="stat-title">Total Asistencias</div>
                  <div className="stat-value">{resultado.resumen.total}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Días con Registro</div>
                  <div className="stat-value">{resultado.resumen.dias}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Promedio Diario</div>
                  <div className="stat-value">{resultado.resumen.promedioDiario}</div>
                </div>
              </>
            )}

            {tipoReporte === 'ingresos' && (
              <>
                <div className="stat-card">
                  <div className="stat-title">Total Ingresos</div>
                  <div className="stat-value" style={{ color: 'var(--success)' }}>
                    Q{resultado.resumen.total.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Cantidad de Pagos</div>
                  <div className="stat-value">{resultado.resumen.cantidad}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Promedio por Pago</div>
                  <div className="stat-value">
                    Q{resultado.resumen.promedio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </>
            )}

            {tipoReporte === 'membresias' && (
              <>
                <div className="stat-card">
                  <div className="stat-title">Vencen en 7 días</div>
                  <div className="stat-value" style={{ color: 'var(--danger)' }}>
                    {resultado.resumen.vencen7dias}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Vencen en 30 días</div>
                  <div className="stat-value" style={{ color: 'var(--warning)' }}>
                    {resultado.resumen.vencen30dias}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Ya Vencidas</div>
                  <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                    {resultado.resumen.vencidas}
                  </div>
                </div>
              </>
            )}

            {tipoReporte === 'tickets' && (
              <>
                <div className="stat-card">
                  <div className="stat-title">Total Tickets</div>
                  <div className="stat-value">{resultado.resumen.total}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Total Ingresos</div>
                  <div className="stat-value" style={{ color: 'var(--success)' }}>
                    Q{resultado.resumen.totalIngresos.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Promedio por Ticket</div>
                  <div className="stat-value">
                    Q{resultado.resumen.promedio.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Desglose por método (solo ingresos) */}
          {tipoReporte === 'ingresos' && resultado.porMetodo && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-bold mb-3">Ingresos por Método de Pago</h3>
              <div className="grid grid-3">
                {Object.entries(resultado.porMetodo).map(([metodo, monto]) => (
                  <div key={metodo} className="stat-card">
                    <div className="stat-title">{metodo}</div>
                    <div className="stat-value">
                      Q{monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desglose por tipo de ticket */}
          {tipoReporte === 'tickets' && resultado.porTipo && Object.keys(resultado.porTipo).length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-bold mb-3">Tickets por Tipo</h3>
              <div className="grid grid-3">
                {Object.entries(resultado.porTipo).map(([tipo, cantidad]) => (
                  <div key={tipo} className="stat-card">
                    <div className="stat-title">{tipo}</div>
                    <div className="stat-value">{cantidad}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Desglose por método de pago (tickets) */}
          {tipoReporte === 'tickets' && resultado.porMetodo && Object.keys(resultado.porMetodo).length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 className="text-lg font-bold mb-3">Ingresos por Método de Pago</h3>
              <div className="grid grid-3">
                {Object.entries(resultado.porMetodo).map(([metodo, monto]) => (
                  <div key={metodo} className="stat-card">
                    <div className="stat-title">{metodo}</div>
                    <div className="stat-value">
                      Q{monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tabla de datos */}
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  {resultado.columnas.map((col, idx) => (
                    <th key={idx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.datos.map((item, idx) => (
                  <tr key={idx}>
                    {tipoReporte === 'clientes' && (
                      <>
                        <td>{item.id}</td>
                        <td className="font-bold">{item.nombre}</td>
                        <td>{item.telefono}</td>
                        <td>{item.tipo_membresia}</td>
                        <td>{new Date(item.fecha_vencimiento).toLocaleDateString('es-GT')}</td>
                        <td>
                          <span className={`badge ${new Date(item.fecha_vencimiento) >= new Date() ? 'badge-success' : 'badge-danger'}`}>
                            {new Date(item.fecha_vencimiento) >= new Date() ? 'Activa' : 'Vencida'}
                          </span>
                        </td>
                      </>
                    )}
                    
                    {tipoReporte === 'asistencias' && (
                      <>
                        <td>{new Date(item.fecha_hora).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className="font-bold">{item.nombre || 'Cliente desconocido'}</td>
                        <td>
                          <span className={`badge ${(item.tipo_entrada || item.tipo) === 'entrada' ? 'badge-success' : 'badge-info'}`}>
                            {item.tipo_entrada || item.tipo || 'entrada'}
                          </span>
                        </td>
                        <td>{item.metodo_verificacion || item.metodo || 'manual'}</td>
                      </>
                    )}

                    {tipoReporte === 'ingresos' && (
                      <>
                        <td>{new Date(item.fecha_pago).toLocaleDateString('es-GT')}</td>
                        <td className="font-bold">{item.cliente_nombre || 'Cliente desconocido'}</td>
                        <td className="font-bold">Q{item.monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                        <td>
                          <span className="badge badge-info">{item.metodo_pago}</span>
                        </td>
                        <td>{item.concepto || item.descripcion || '-'}</td>
                      </>
                    )}

                    {tipoReporte === 'membresias' && (
                      <>
                        <td className="font-bold">{item.nombre}</td>
                        <td>{item.telefono}</td>
                        <td>{item.tipo_membresia}</td>
                        <td>{new Date(item.fecha_vencimiento).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                        <td>
                          {(() => {
                            const dias = Math.ceil((new Date(item.fecha_vencimiento) - new Date()) / (1000 * 60 * 60 * 24));
                            return (
                              <span style={{ fontWeight: 600, color: dias <= 7 ? 'var(--danger)' : 'var(--warning)' }}>
                                {dias} día{dias !== 1 ? 's' : ''}
                              </span>
                            );
                          })()}
                        </td>
                      </>
                    )}

                    {tipoReporte === 'tickets' && (
                      <>
                        <td className="font-bold">#{String(item.numero_ticket).padStart(6, '0')}</td>
                        <td>{(() => {
                          try {
                            const datos = typeof item.datos_json === 'string' ? JSON.parse(item.datos_json) : item.datos_json;
                            return datos?.cliente?.nombre || 'N/A';
                          } catch {
                            return 'N/A';
                          }
                        })()}</td>
                        <td>
                          <span className="badge badge-info">{item.tipo_ticket}</span>
                        </td>
                        <td className="font-bold">Q{(item.monto || 0).toLocaleString('es-GT', { minimumFractionDigits: 2 })}</td>
                        <td>{item.metodo_pago || '-'}</td>
                        <td>{new Date(item.fecha_generacion).toLocaleString('es-GT', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!resultado && !generando && (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">Selecciona un tipo de reporte</h3>
            <p className="empty-text">Configura las opciones y haz clic en "Generar Reporte"</p>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .page-header, .btn, .form-group, .nav-link, .sidebar {
            display: none !important;
          }
          #reporte-content {
            margin: 0;
            padding: 20px;
          }
          .stat-card {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

export default Reportes;

