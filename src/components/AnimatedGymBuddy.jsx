import React, { useState, useEffect } from 'react';

const exercises = [
  { 
    text: '¡Entrenando duro!',
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="gym-illustration">
        {/* Cuerpo */}
        <ellipse cx="30" cy="35" rx="8" ry="12" fill="#FFB74D" />
        {/* Cabeza */}
        <circle cx="30" cy="20" r="6" fill="#FFB74D" />
        {/* Brazos levantando barra */}
        <g className="arms">
          <ellipse cx="22" cy="28" rx="3" ry="8" fill="#FFB74D" transform="rotate(-20 22 28)" />
          <ellipse cx="38" cy="28" rx="3" ry="8" fill="#FFB74D" transform="rotate(20 38 28)" />
          {/* Barra de levantamiento */}
          <line x1="18" y1="22" x2="42" y2="22" stroke="#2E7D32" strokeWidth="3" strokeLinecap="round" />
          {/* Pesas en los extremos */}
          <circle cx="16" cy="22" r="3" fill="#424242" />
          <circle cx="44" cy="22" r="3" fill="#424242" />
          <rect x="14" y="20" width="4" height="4" fill="#616161" />
          <rect x="42" y="20" width="4" height="4" fill="#616161" />
          {/* Agarre de la barra */}
          <rect x="26" y="20" width="8" height="2" fill="#8D6E63" rx="1" />
        </g>
        {/* Piernas */}
        <ellipse cx="26" cy="48" rx="3" ry="6" fill="#1976D2" />
        <ellipse cx="34" cy="48" rx="3" ry="6" fill="#1976D2" />
        {/* Ojos */}
        <circle cx="28" cy="18" r="1" fill="#000" />
        <circle cx="32" cy="18" r="1" fill="#000" />
        {/* Sonrisa */}
        <path d="M26 22 Q30 25 34 22" stroke="#000" strokeWidth="1" fill="none" />
      </svg>
    )
  },
  { 
    text: '¡Sigue así!',
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="gym-illustration">
        {/* Cuerpo */}
        <ellipse cx="30" cy="35" rx="8" ry="12" fill="#FFB74D" />
        {/* Cabeza */}
        <circle cx="30" cy="20" r="6" fill="#FFB74D" />
        {/* Brazos en posición de victoria */}
        <g className="arms">
          <ellipse cx="22" cy="30" rx="3" ry="8" fill="#FFB74D" transform="rotate(-30 22 30)" />
          <ellipse cx="38" cy="30" rx="3" ry="8" fill="#FFB74D" transform="rotate(30 38 30)" />
          {/* Manos cerradas */}
          <circle cx="18" cy="24" r="2" fill="#FFB74D" />
          <circle cx="42" cy="24" r="2" fill="#FFB74D" />
        </g>
        {/* Piernas */}
        <ellipse cx="26" cy="48" rx="3" ry="6" fill="#1976D2" />
        <ellipse cx="34" cy="48" rx="3" ry="6" fill="#1976D2" />
        {/* Ojos cerrados de felicidad */}
        <path d="M27 18 Q30 16 33 18" stroke="#000" strokeWidth="1" fill="none" />
        <path d="M27 19 Q30 17 33 19" stroke="#000" strokeWidth="1" fill="none" />
        {/* Sonrisa grande */}
        <path d="M24 23 Q30 27 36 23" stroke="#000" strokeWidth="1.5" fill="none" />
      </svg>
    )
  },
  { 
    text: '¡Corriendo!',
    svg: (
      <svg width="60" height="60" viewBox="0 0 60 60" className="gym-illustration">
        {/* Cuerpo inclinado hacia adelante */}
        <ellipse cx="30" cy="35" rx="8" ry="12" fill="#FFB74D" transform="rotate(-5 30 35)" />
        {/* Cabeza */}
        <circle cx="30" cy="20" r="6" fill="#FFB74D" />
        {/* Brazos corriendo con movimiento alternado */}
        <g className="arms">
          <ellipse cx="22" cy="32" rx="3" ry="8" fill="#FFB74D" transform="rotate(-60 22 32)" />
          <ellipse cx="38" cy="28" rx="3" ry="8" fill="#FFB74D" transform="rotate(60 38 28)" />
          {/* Manos cerradas */}
          <circle cx="18" cy="36" r="2" fill="#FFB74D" />
          <circle cx="42" cy="32" r="2" fill="#FFB74D" />
        </g>
        {/* Piernas corriendo con movimiento dinámico */}
        <g className="legs">
          <ellipse cx="28" cy="48" rx="3" ry="6" fill="#1976D2" transform="rotate(-30 28 48)" />
          <ellipse cx="32" cy="52" rx="3" ry="6" fill="#1976D2" transform="rotate(30 32 52)" />
          {/* Pies */}
          <ellipse cx="25" cy="52" rx="2" ry="1" fill="#000" />
          <ellipse cx="35" cy="56" rx="2" ry="1" fill="#000" />
        </g>
        {/* Líneas de movimiento */}
        <g className="movement-lines">
          <line x1="45" y1="15" x2="52" y2="12" stroke="#4CAF50" strokeWidth="2" opacity="0.6" />
          <line x1="45" y1="20" x2="52" y2="17" stroke="#4CAF50" strokeWidth="2" opacity="0.4" />
          <line x1="45" y1="25" x2="52" y2="22" stroke="#4CAF50" strokeWidth="2" opacity="0.3" />
        </g>
        {/* Ojos concentrados */}
        <circle cx="28" cy="18" r="1" fill="#000" />
        <circle cx="32" cy="18" r="1" fill="#000" />
        {/* Expresión de determinación */}
        <path d="M26 22 Q30 24 34 22" stroke="#000" strokeWidth="1" fill="none" />
      </svg>
    )
  }
];

function AnimatedGymBuddy() {
  const [currentExercise, setCurrentExercise] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExercise(prev => (prev + 1) % exercises.length);
    }, 4000); // Cambia cada 4 segundos

    return () => clearInterval(interval);
  }, []);

  const currentExerciseData = exercises[currentExercise] || exercises[0];

  return (
    <div style={{ 
      padding: '1rem 1.5rem', 
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
      borderRadius: '0.5rem',
      margin: '0 0.5rem 0.5rem',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        marginBottom: '0.5rem',
        animation: 'lifting 2s ease-in-out infinite',
        transformOrigin: 'bottom center',
        transition: 'all 0.3s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {currentExerciseData?.svg || <div style={{ fontSize: '2.5rem' }}>🏋️‍♂️</div>}
      </div>
      
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: 500,
        marginBottom: '1rem',
        transition: 'all 0.3s ease',
        minHeight: '1.2rem'
      }}>
        {currentExerciseData?.text || '¡Entrenando!'}
      </div>

      {/* Barra de progreso animada */}
      <div style={{
        width: '100%',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginBottom: '0.5rem'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, #4CAF50, #2196F3, #FF9800)',
          borderRadius: '2px',
          animation: 'progress 3s ease-in-out infinite'
        }} />
      </div>

      {/* Estadísticas motivacionales */}
      <div style={{
        fontSize: '0.65rem',
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem'
      }}>
        <span>💪 Fuerza</span>
        <span>🔥 Quemando</span>
        <span>⚡ Energía</span>
      </div>
    </div>
  );
}

export default AnimatedGymBuddy;