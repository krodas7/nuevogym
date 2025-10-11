import React, { useEffect, useState } from 'react';

function TicketRenovacion({ datosTicket, onClose }) {
  const [numeroTicket, setNumeroTicket] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  useEffect(() => {
    generarTicket();
  }, []);

  const generarTicket = async () => {
    try {
      // Obtener usuario actual del localStorage
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      setUsuarioActual(usuario);

      // Preparar datos del ticket
      const ticketData = {
        tipo: 'renovacion',
        cliente_id: datosTicket.cliente.id,
        usuario_id: usuario.id,
        monto: datosTicket.monto,
        metodo_pago: datosTicket.metodo_pago,
        datos: datosTicket
      };

      // Generar ticket en la base de datos
      const result = await window.electronAPI.generateTicket(ticketData);
      
      if (result.success) {
        setNumeroTicket(result.data.numero_ticket);
      } else {
        console.error('Error al generar ticket:', result.error);
        setNumeroTicket('ERROR');
      }
    } catch (error) {
      console.error('Error al generar ticket:', error);
      setNumeroTicket('ERROR');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatearHora = () => {
    return new Date().toLocaleTimeString('es-GT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!numeroTicket) {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ padding: '2rem' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p>Generando ticket...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={() => onClose()}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2 className="modal-title">Ticket de Renovación</h2>
          <button className="modal-close" onClick={() => onClose()}>×</button>
        </div>

        <div className="ticket-container" style={{ 
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          backgroundColor: 'white',
          color: 'black',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          maxWidth: '350px',
          margin: '0 auto'
        }}>
          {/* Logo y Header */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img 
              src="images/logo-ticket.png" 
              alt="GYM CENTER Logo"
              style={{ 
                width: '80px', 
                height: '80px', 
                objectFit: 'contain',
                marginBottom: '10px'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div style="font-size: 24px; margin-bottom: 10px;">💪</div>';
              }}
            />
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              GYM CENTER
            </div>
            <div style={{ fontSize: '10px', color: '#666' }}>
              Centro de Acondicionamiento Físico
            </div>
          </div>

          {/* Separador */}
          <div style={{ 
            borderTop: '2px dashed #000', 
            margin: '15px 0',
            textAlign: 'center',
            position: 'relative'
          }}>
            <span style={{ 
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'white',
              padding: '0 10px',
              fontSize: '10px',
              fontWeight: 'bold'
            }}>
              TICKET DE RENOVACIÓN
            </span>
          </div>

          {/* Número de Ticket */}
          <div style={{ 
            textAlign: 'center',
            marginBottom: '15px',
            padding: '8px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '10px', color: '#666' }}>No. de Ticket:</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
              #{numeroTicket.toString().padStart(6, '0')}
            </div>
          </div>

          {/* Información del Ticket */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Fecha:</span>
              <span>{formatearFecha(datosTicket.fecha_renovacion)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Hora:</span>
              <span>{formatearHora()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Vendedor:</span>
              <span>{usuarioActual?.nombre_completo || 'Sistema'}</span>
            </div>
          </div>

          {/* Separador */}
          <div style={{ borderTop: '1px dashed #ccc', margin: '15px 0' }}></div>

          {/* Información del Cliente */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              padding: '5px',
              borderRadius: '4px'
            }}>
              INFORMACIÓN DEL CLIENTE
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Cliente:</span>
              <span style={{ fontWeight: 'bold' }}>{datosTicket.cliente.nombre}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Teléfono:</span>
              <span>{datosTicket.cliente.telefono}</span>
            </div>
          </div>

          {/* Información de la Membresía */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              padding: '5px',
              borderRadius: '4px'
            }}>
              INFORMACIÓN DE LA MEMBRESÍA
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Tipo:</span>
              <span style={{ fontWeight: 'bold' }}>{datosTicket.membresia.nombre}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Duración:</span>
              <span>{datosTicket.membresia.duracion_dias} días</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Fecha Renovación:</span>
              <span>{formatearFecha(datosTicket.fecha_renovacion)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Fecha Vencimiento:</span>
              <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                {formatearFecha(datosTicket.fecha_vencimiento)}
              </span>
            </div>
          </div>

          {/* Información de Pago */}
          <div style={{ marginBottom: '15px' }}>
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '8px',
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              padding: '5px',
              borderRadius: '4px'
            }}>
              INFORMACIÓN DE PAGO
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Método de Pago:</span>
              <span style={{ fontWeight: 'bold' }}>{datosTicket.metodo_pago}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>Total:</span>
              <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#28a745' }}>
                Q{datosTicket.monto.toLocaleString('es-GT', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Separador */}
          <div style={{ borderTop: '2px dashed #000', margin: '15px 0' }}></div>

          {/* Versículo Bíblico */}
          <div style={{ 
            textAlign: 'center',
            fontSize: '10px',
            lineHeight: '1.3',
            marginBottom: '10px',
            fontStyle: 'italic'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Salmos 37:5
            </div>
            <div style={{ color: '#666' }}>
              "Encomienda al Señor tu camino,<br />
              Confía en Él, que Él actuará"
            </div>
          </div>

          {/* Separador Final */}
          <div style={{ borderTop: '1px dashed #ccc', margin: '10px 0' }}></div>

          {/* Footer */}
          <div style={{ 
            textAlign: 'center',
            fontSize: '10px',
            color: '#666',
            marginTop: '10px'
          }}>
            <div>¡Gracias por elegir GYM CENTER!</div>
            <div>Tu salud es nuestra prioridad</div>
          </div>
        </div>

        <div className="modal-footer" style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          marginTop: '20px'
        }}>
          <button className="btn btn-outline" onClick={() => onClose()}>
            Cerrar
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            Imprimir
          </button>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx>{`
        @media print {
          .modal-overlay {
            background: white !important;
          }
          .modal {
            max-width: none !important;
            width: 80mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          .modal-header,
          .modal-footer {
            display: none !important;
          }
          .ticket-container {
            border: none !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TicketRenovacion;