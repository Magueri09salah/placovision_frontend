// src/services/factureApi.js
import api from './api';

export const factureAPI = {
  /**
   * Liste des factures avec pagination et filtres
   * @param {Object} params - { page, per_page, status, search }
   */
  getAll: (params = {}) => {
    return api.get('/factures', { params });
  },

  /**
   * Détail d'une facture
   * @param {number} id
   */
  getOne: (id) => {
    return api.get(`/factures/${id}`);
  },

  /**
   * Mettre à jour le status d'une facture
   * @param {number} id
   * @param {string} status - en_attente, payee, annulee
   */
  updateStatus: (id, status) => {
    return api.patch(`/factures/${id}/status`, { status });
  },

  /**
   * Télécharger le PDF d'une facture
   * @param {number} id
   */
  downloadPdf: (id) => {
    return api.get(`/factures/${id}/pdf`, {
      responseType: 'blob',
    });
  },

  /**
   * Statistiques des factures
   */
  getStats: () => {
    return api.get('/factures/stats');
  },
};

export default factureAPI;