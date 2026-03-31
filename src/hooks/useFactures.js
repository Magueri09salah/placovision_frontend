// src/hooks/useFactures.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { factureAPI } from '../services/factureApi';

/**
 * Hook pour la liste des factures avec pagination et filtres
 */
export const useFactures = (params = {}) => {
  return useQuery({
    queryKey: ['factures', params],
    queryFn: async () => {
      const response = await factureAPI.getAll(params);
      return response.data;
    },
  });
};

/**
 * Hook pour le détail d'une facture
 */
export const useFacture = (id) => {
  return useQuery({
    queryKey: ['facture', id],
    queryFn: async () => {
      const response = await factureAPI.getOne(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook pour les statistiques des factures
 */
export const useFacturesStats = () => {
  return useQuery({
    queryKey: ['factures', 'stats'],
    queryFn: async () => {
      const response = await factureAPI.getStats();
      return response.data.data;
    },
  });
};

/**
 * Hook pour mettre à jour le status d'une facture
 */
export const useUpdateFactureStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => factureAPI.updateStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['factures'] });
      queryClient.invalidateQueries({ queryKey: ['facture', variables.id] });
    },
  });
};

/**
 * Hook pour télécharger le PDF d'une facture
 */
export const useDownloadFacturePdf = () => {
  return useMutation({
    mutationFn: async ({ id, numero }) => {
      const response = await factureAPI.downloadPdf(id);
      
      // Créer blob URL et télécharger
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${numero}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return true;
    },
  });
};

export default {
  useFactures,
  useFacture,
  useFacturesStats,
  useUpdateFactureStatus,
  useDownloadFacturePdf,
};