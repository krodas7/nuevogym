import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, XMarkIcon, ArrowPathIcon, CheckIcon } from '@heroicons/react/24/outline';

function CameraCapture({ onCapture, onClose, existingPhoto }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(existingPhoto || null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    startCamera();
    
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    setCameraError(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
      setCameraError('No se pudo acceder a la cámara. Verifica los permisos.');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convertir a base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(imageData);
      
      // Detener la cámara después de capturar
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleCancel = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            <CameraIcon className="w-6 h-6" />
            Capturar Foto del Cliente
          </h2>
          <button className="modal-close" onClick={handleCancel}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="modal-body">
          {cameraError && (
            <div className="alert alert-error mb-4">
              <span>❌</span>
              <div>
                <strong>Error de cámara:</strong>
                <p>{cameraError}</p>
                <small>Asegúrate de permitir el acceso a la cámara en tu navegador.</small>
              </div>
            </div>
          )}

          <div style={{ 
            position: 'relative', 
            width: '100%', 
            minHeight: '400px',
            background: '#000',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isLoading && !capturedImage && (
              <div style={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                color: '#fff',
                textAlign: 'center'
              }}>
                <div className="spinner" style={{ marginBottom: '1rem' }}></div>
                <p>Iniciando cámara...</p>
              </div>
            )}

            {!capturedImage && !cameraError && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: isLoading ? 'none' : 'block',
                    transform: 'scaleX(-1)' // Efecto espejo
                  }}
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </>
            )}

            {capturedImage && (
              <img
                src={capturedImage}
                alt="Foto capturada"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '500px',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          {!capturedImage && !cameraError && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '1rem', 
              background: 'var(--background-secondary)',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                💡 <strong>Consejo:</strong> Asegúrate de tener buena iluminación y que el rostro esté centrado.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {!capturedImage && !cameraError && (
            <>
              <button className="btn btn-outline" onClick={handleCancel}>
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                onClick={capturePhoto}
                disabled={isLoading}
              >
                <CameraIcon className="w-5 h-5" />
                Tomar Foto
              </button>
            </>
          )}

          {capturedImage && (
            <>
              <button className="btn btn-outline" onClick={retakePhoto}>
                <ArrowPathIcon className="w-5 h-5" />
                Tomar de Nuevo
              </button>
              <button className="btn btn-primary" onClick={confirmPhoto}>
                <CheckIcon className="w-5 h-5" />
                Usar Esta Foto
              </button>
            </>
          )}

          {cameraError && (
            <>
              <button className="btn btn-outline" onClick={handleCancel}>
                Cancelar
              </button>
              <button className="btn btn-secondary" onClick={startCamera}>
                <ArrowPathIcon className="w-5 h-5" />
                Intentar de Nuevo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CameraCapture;
