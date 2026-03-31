// src/services/commandeApi.js
import api from './api';

export const commandeAPI = {
  
  getAll: (params = {}) => {
    return api.get('/commandes', { params });
  },

  
  getOne: (id) => {
    return api.get(`/commandes/${id}`);
  },

  
  updateStatus: (id, status) => {
    return api.patch(`/commandes/${id}/status`, { status });
  },

  
  getStats: () => {
    return api.get('/commandes/stats');
  },
};

export default commandeAPI;