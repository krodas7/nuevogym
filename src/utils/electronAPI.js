/**
 * Utilidades para trabajar con electronAPI de forma segura
 */

/**
 * Verifica si electronAPI está disponible
 * @returns {boolean}
 */
export const isElectronAPIAvailable = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

/**
 * Verifica si un método específico de electronAPI está disponible
 * @param {string} methodName - Nombre del método a verificar
 * @returns {boolean}
 */
export const hasElectronMethod = (methodName) => {
  return isElectronAPIAvailable() && typeof window.electronAPI[methodName] === 'function';
};

/**
 * Ejecuta una llamada a electronAPI de forma segura
 * @param {string} methodName - Nombre del método a llamar
 * @param  {...any} args - Argumentos para el método
 * @returns {Promise<any>}
 */
export const safeElectronCall = async (methodName, ...args) => {
  if (!hasElectronMethod(methodName)) {
    console.error(`❌ electronAPI.${methodName} no está disponible`);
    return {
      success: false,
      error: `Esta funcionalidad requiere Electron. Por favor ejecuta: npm start o usa el instalador.`,
      data: null
    };
  }

  try {
    const result = await window.electronAPI[methodName](...args);
    return result;
  } catch (error) {
    console.error(`❌ Error en electronAPI.${methodName}:`, error);
    return {
      success: false,
      error: error.message || 'Error al comunicarse con Electron',
      data: null
    };
  }
};

/**
 * Muestra un mensaje de advertencia si no está en Electron
 * @returns {JSX.Element|null}
 */
export const ElectronWarning = () => {
  if (isElectronAPIAvailable()) return null;

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div className="alert alert-warning" style={{ background: '#fff3cd', borderColor: '#ffc107', color: '#856404' }}>
        <span>⚠️</span>
        <div>
          <strong>Aplicación Desktop Requerida</strong><br />
          Esta aplicación debe ejecutarse en Electron para funcionar completamente.<br />
          <small><strong>Solución:</strong> Ejecuta <code>npm start</code> o usa el instalador .exe</small>
        </div>
      </div>
    </div>
  );
};

export default {
  isElectronAPIAvailable,
  hasElectronMethod,
  safeElectronCall,
  ElectronWarning
};

