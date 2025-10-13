const API_BASE_URL = 'http://localhost:4000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Autenticación
  async login(username, password) {
    return this.request('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Clientes
  async getClientes() {
    return this.request('/clientes');
  }

  async createCliente(cliente) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(cliente),
    });
  }

  async updateCliente(id, cliente) {
    return this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cliente),
    });
  }

  async deleteCliente(id) {
    return this.request(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Tipos de membresía
  async getTiposMembresia() {
    return this.request('/tipos-membresia');
  }

  async createTipoMembresia(tipo) {
    return this.request('/tipos-membresia', {
      method: 'POST',
      body: JSON.stringify(tipo),
    });
  }

  // Membresías
  async getMembresias() {
    return this.request('/membresias');
  }

  async createMembresia(membresia) {
    return this.request('/membresias', {
      method: 'POST',
      body: JSON.stringify(membresia),
    });
  }

  // Asistencias
  async getAsistencias(fechaInicio, fechaFin) {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    
    const query = params.toString();
    return this.request(`/asistencias${query ? `?${query}` : ''}`);
  }

  // Pagos
  async getPagos() {
    return this.request('/pagos');
  }

  async createPago(pago) {
    return this.request('/pagos', {
      method: 'POST',
      body: JSON.stringify(pago),
    });
  }

  // Tickets
  async getTickets() {
    return this.request('/tickets');
  }

  async createTicket(ticket) {
    return this.request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  }

  // Reportes
  async getReporteIngresos(fechaInicio, fechaFin) {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    
    const query = params.toString();
    return this.request(`/reportes/ingresos${query ? `?${query}` : ''}`);
  }

  // Configuración
  async getConfig() {
    return this.request('/config');
  }
}

// Crear instancia global
const apiClient = new ApiClient();

export default apiClient;

// Funciones de conveniencia para compatibilidad con electronAPI
export const safeApiCall = async (method, ...args) => {
  try {
    if (typeof apiClient[method] === 'function') {
      return await apiClient[method](...args);
    } else {
      throw new Error(`Método ${method} no encontrado en API`);
    }
  } catch (error) {
    console.error(`Error calling API.${method}:`, error);
    return { success: false, error: error.message };
  }
};

// Hook para usar en componentes React
export const useApi = () => {
  return apiClient;
};
