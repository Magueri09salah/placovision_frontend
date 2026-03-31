// src/hooks/useQuotationPolling.js
import { useQuery } from '@tanstack/react-query';
import { quotationAPI } from '../services/quotationApi';

/**
 * Hook pour récupérer un devis avec polling automatique (10 secondes)
 * Le statut Odoo se met à jour sans refresh de la page
 */
export const useQuotationPolling = (quotationId, options = {}) => {
  const {
    pollingInterval = 10000,
    enablePolling = true,
  } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: async () => {
      const response = await quotationAPI.getOne(quotationId);
      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'Erreur lors du chargement');
      }
      return response.data.data;
    },
    refetchInterval: enablePolling ? pollingInterval : false,
    refetchIntervalInBackground: false,
    enabled: !!quotationId,
  });

  return {
    quotation: data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  };
};

export default useQuotationPolling;