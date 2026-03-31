// src/services/odooApi.js
import api from './api';

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const sendToOdoo = async (quotation, retryCount = 0) => {
  if (!quotation.client_email) {
    throw new Error("L'email du client est requis pour l'envoi vers Odoo.");
  }

  if (!quotation.rooms || quotation.rooms.length === 0) {
    throw new Error('Le devis doit contenir au moins une pièce avec des travaux.');
  }

  try {
    const response = await api.post(`/quotations/${quotation.id}/odoo-sync`);

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Devis envoyé avec succès vers Odoo',
        orderId: response.data.data?.order_id,
        orderName: response.data.data?.order_name,
      };
    } else {
      throw new Error(response.data.message || 'Erreur retournée par le serveur');
    }

  } catch (error) {
    const isNetworkError = !error.response || error.code === 'ECONNABORTED';
    const isServerError = error.response?.status >= 500;

    if ((isNetworkError || isServerError) && retryCount < MAX_RETRIES) {
      console.warn(`Tentative ${retryCount + 1}/${MAX_RETRIES} échouée...`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return sendToOdoo(quotation, retryCount + 1);
    }

    let errorMessage = "Erreur lors de l'envoi vers Odoo";

    if (error.response) {
      const data = error.response.data;
      errorMessage = data?.message || `Erreur ${error.response.status}`;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};

export const acceptQuotation = async (quotationId) => {
  try {
    const response = await api.post(`/quotations/${quotationId}/odoo-accept`);
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Acceptation envoyée à Odoo',
      };
    } else {
      throw new Error(response.data.message || 'Erreur lors de l\'acceptation');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors de l\'envoi de l\'acceptation à Odoo';
    
    throw new Error(errorMessage);
  }
};

export const rejectQuotation = async (quotationId, reason = '') => {
  try {
    const response = await api.post(`/quotations/${quotationId}/odoo-reject`, {
      reason: reason,
    });
    
    if (response.data.success) {
      return {
        success: true,
        message: response.data.message || 'Refus envoyé à Odoo',
      };
    } else {
      throw new Error(response.data.message || 'Erreur lors du refus');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message 
      || error.message 
      || 'Erreur lors de l\'envoi du refus à Odoo';
    
    throw new Error(errorMessage);
  }
};

export default { sendToOdoo, acceptQuotation, rejectQuotation };