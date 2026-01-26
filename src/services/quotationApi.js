import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Axios instance with auth
const api = axios.create({
  baseURL: API_URL,
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },

});
axios.defaults.withCredentials = true;

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const quotationAPI = {
  // ============ OPTIONS ============
  getOptions: () => api.get('/quotations/options'),
  
  // ============ SIMULATION ============
  simulate: (data) => api.post('/quotations/simulate', data),
  
  // ============ CRUD ============
  getAll: (params) => api.get('/quotations', { params }),
  getOne: (id) => api.get(`/quotations/${id}`),
  create: (data) => api.post('/quotations', data),
  update: (id, data) => api.put(`/quotations/${id}`, data),
  delete: (id) => api.delete(`/quotations/${id}`),
  
  // ============ ACTIONS ============
  duplicate: (id) => api.post(`/quotations/${id}/duplicate`),
  updateStatus: (id, status) => api.patch(`/quotations/${id}/status`, { status }),
  
  // ============ ITEMS ============
  updateItem: (quotationId, itemId, quantity) => 
    api.patch(`/quotations/${quotationId}/items/${itemId}`, { quantity_adjusted: quantity }),
  resetItem: (quotationId, itemId) => 
    api.post(`/quotations/${quotationId}/items/${itemId}/reset`),
  
  // ============ STATS ============
  getStats: () => api.get('/quotations/stats'),

  // Télécharger le PDF
  downloadPdf: (id) => api.get(`/quotations/${id}/pdf?download=true`, { 
    responseType: 'blob' 
  }),
  
  // Obtenir l'URL du PDF pour affichage
  getPdfUrl: (id) => `${API_URL}/quotations/${id}/pdf`,
  
  // Prévisualiser le PDF (HTML)
  previewPdf: (id) => api.get(`/quotations/${id}/pdf/preview`),
};

export default api;