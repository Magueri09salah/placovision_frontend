// src/hooks/useCommandes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commandeAPI } from '../services/commandeApi';

/**
 * Hook pour la liste des commandes avec pagination et filtres
 */
export const useCommandes = (params = {}) => {
  return useQuery({
    queryKey: ['commandes', params],
    queryFn: async () => {
      const response = await commandeAPI.getAll(params);
      return response.data;
    },
  });
};

/**
 * Hook pour le détail d'une commande
 */
export const useCommande = (id) => {
  return useQuery({
    queryKey: ['commande', id],
    queryFn: async () => {
      const response = await commandeAPI.getOne(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

/**
 * Hook pour les statistiques des commandes
 */
export const useCommandesStats = () => {
  return useQuery({
    queryKey: ['commandes', 'stats'],
    queryFn: async () => {
      const response = await commandeAPI.getStats();
      return response.data.data;
    },
  });
};

/**
 * Hook pour mettre à jour le status d'une commande
 */
export const useUpdateCommandeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => commandeAPI.updateStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalider les queries pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['commande', variables.id] });
    },
  });
};

export default {
  useCommandes,
  useCommande,
  useCommandesStats,
  useUpdateCommandeStatus,
};