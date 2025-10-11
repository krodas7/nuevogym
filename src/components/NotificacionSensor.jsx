import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

function NotificacionSensor({ tipo, cliente, onClose }) {
  useEffect(() => {
    // Reproducir sonido según el tipo
    reproducirSonido(tipo);

    const timer = setTimeout(() => {
      onClose();
    }, 4000); // Desaparece después de 4 segundos

    return () => clearTimeout(timer);
  }, [onClose, tipo]);

  const reproducirSonido = (tipo) => {
    try {
      const audio = new Audio();
      
      if (tipo === 'fingerprint_success') {
        // Sonido de éxito (beep agradable)
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGHm+46+KZSgsXVKXh8LZiFwiP1fDMei0GHXu56+KXSQwYU6Xh77VjGAiP0/HLeDEHH3y46N+WSwsZWKbh7bNjGQmQ0u/JdTAIG36359yUSwsaWqfg7bJiGgmR0u/JdC8JH3+45NuTTAwaW6jg7LFiGwqS0u7JdC4J';
      } else if (tipo === 'membership_expired') {
        // Sonido de advertencia
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGHm+46+KZSgsXVKXh8LZiFwiP1fDMei0GHXu56+KXSQwYU6Xh77VjGAiP0/HLeDEHH3y46N+WSwsZWKbh7bNjGQmQ0u/JdTAIG36359yUSwsaWqfg7bJiGgmR0u/JdC8JH3+45NuTTAwaW6jg7LFiGwqS0u7JdC4J';
      } else {
        // Sonido de error
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwGHm+46+KZSgsXVKXh8LZiFwiP1fDMei0GHXu56+KXSQwYU6Xh77VjGAiP0/HLeDEHH3y46N+WSwsZWKbh7bNjGQmQ0u/JdTAIG36359yUSwsaWqfg7bJiGgmR0u/JdC8JH3+45NuTTAwaW6jg7LFiGwqS0u7JdC4J';
      }
      
      audio.volume = 0.5; // 50% de volumen
      audio.play().catch(err => console.log('No se pudo reproducir el sonido:', err));
    } catch (error) {
      console.error('Error al reproducir sonido:', error);
    }
  };

  const esAccesoPermitido = tipo === 'fingerprint_success';
  const esAccesoDenegado = tipo === 'client_not_found' || tipo === 'no_enrolled_users';
  const esMembresiaVencida = tipo === 'membership_expired';

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
      }}
    >
      <div 
        style={{
          background: esAccesoPermitido ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                    : esMembresiaVencida ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          borderRadius: '12px',
          padding: '20px',
          minWidth: '320px',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        {/* Foto o icono */}
        <div style={{ flexShrink: 0 }}>
          {esAccesoPermitido && cliente?.foto ? (
            <img 
              src={cliente.foto} 
              alt={cliente.nombre}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
              }}
            />
          ) : (
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '3px solid white'
            }}>
              {esAccesoPermitido ? (
                <CheckCircleIcon style={{ width: '40px', height: '40px', color: 'white' }} />
              ) : (
                <XCircleIcon style={{ width: '40px', height: '40px', color: 'white' }} />
              )}
            </div>
          )}
        </div>

        {/* Información */}
        <div style={{ flex: 1 }}>
          {esAccesoPermitido && cliente ? (
            <>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cliente.nombre}
              </div>
              <div style={{ 
                fontSize: '14px', 
                opacity: 0.95,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircleIcon style={{ width: '18px', height: '18px' }} />
                <strong>ACCESO PERMITIDO</strong>
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.85,
                marginTop: '3px'
              }}>
                {cliente.tipo_membresia} • {new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </>
          ) : esMembresiaVencida && cliente ? (
            <>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {cliente.nombre}
              </div>
              <div style={{ 
                fontSize: '14px', 
                opacity: 0.95,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <XCircleIcon style={{ width: '18px', height: '18px' }} />
                <strong>MEMBRESÍA VENCIDA</strong>
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.85,
                marginTop: '3px'
              }}>
                Renovar para permitir acceso
              </div>
            </>
          ) : (
            <>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 'bold', 
                marginBottom: '5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                ACCESO DENEGADO
              </div>
              <div style={{ 
                fontSize: '14px', 
                opacity: 0.95,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <XCircleIcon style={{ width: '18px', height: '18px' }} />
                Huella no reconocida
              </div>
              <div style={{ 
                fontSize: '12px', 
                opacity: 0.85,
                marginTop: '3px'
              }}>
                {new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </>
          )}
        </div>

        {/* Barra de progreso */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'rgba(255,255,255,0.3)',
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'white',
            animation: 'progressBar 4s linear forwards'
          }} />
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export default NotificacionSensor;

