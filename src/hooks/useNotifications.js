// src/hooks/useNotifications.js
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationAPI } from '../services/notificationApi';
import { useAuth } from '../context/AuthContext';

/**
 * Hook pour le compteur de notifications non lues
 */
export const useUnreadCount = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await notificationAPI.getUnreadCount();
      return response.data.data.count;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Fallback polling toutes les 30s
  });

  // ============ WEBSOCKET LISTENER ============
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !window.Echo) {
      return;
    }

    const channel = window.Echo.private(`user.${user.id}`);

    // Écouter les nouvelles notifications
    channel.listen('.notification.created', (data) => {
      console.log('🔔 Nouvelle notification reçue:', data);
      
      // Incrémenter le compteur
      queryClient.setQueryData(['notifications', 'unread-count'], (old) => {
        return (old || 0) + 1;
      });

      // Ajouter la nouvelle notification directement dans le cache de la liste
      queryClient.setQueryData(['notifications', 'list', { per_page: 10 }], (oldData) => {
        if (!oldData) return oldData;
        
        const newNotification = {
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.message,
          icon: data.icon,
          link: data.link,
          data: data.data,
          read_at: data.read_at,
          created_at: data.created_at,
        };

        return {
          ...oldData,
          data: [newNotification, ...oldData.data],
          meta: {
            ...oldData.meta,
            total: (oldData.meta?.total || 0) + 1,
          },
        };
      });

      // Aussi invalider pour forcer un refresh au prochain focus
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    });

    // Cleanup
    return () => {
      channel.stopListening('.notification.created');
      window.Echo.leave(`user.${user.id}`);
    };
  }, [isAuthenticated, user?.id, queryClient]);

  return {
    count: query.data || 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

/**
 * Hook pour la liste des notifications
 */
export const useNotifications = (params = {}) => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ['notifications', 'list', params],
    queryFn: async () => {
      const response = await notificationAPI.getAll(params);
      return response.data;
    },
    enabled: isAuthenticated,
  });

  // ============ WEBSOCKET LISTENER POUR LA LISTE ============
  useEffect(() => {
    if (!isAuthenticated || !user?.id || !window.Echo) {
      return;
    }

    const channel = window.Echo.private(`user.${user.id}`);

    // Écouter les nouvelles notifications
    const handleNewNotification = (data) => {
      console.log('📋 Mise à jour liste notifications:', data);
      
      // Ajouter la nouvelle notification dans le cache
      queryClient.setQueryData(['notifications', 'list', params], (oldData) => {
        if (!oldData) return oldData;
        
        const newNotification = {
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.message,
          icon: data.icon,
          link: data.link,
          data: data.data,
          read_at: data.read_at,
          created_at: data.created_at,
        };

        // Vérifier si la notification existe déjà
        const exists = oldData.data?.some(n => n.id === data.id);
        if (exists) return oldData;

        return {
          ...oldData,
          data: [newNotification, ...(oldData.data || [])],
          meta: {
            ...oldData.meta,
            total: (oldData.meta?.total || 0) + 1,
          },
        };
      });
    };

    channel.listen('.notification.created', handleNewNotification);

    // Cleanup
    return () => {
      channel.stopListening('.notification.created');
    };
  }, [isAuthenticated, user?.id, queryClient, params]);

  return query;
};

/**
 * Hook pour marquer une notification comme lue
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationAPI.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook pour marquer toutes les notifications comme lues
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationAPI.markAllAsRead(),
    onSuccess: () => {
      // Mettre le compteur à 0
      queryClient.setQueryData(['notifications', 'unread-count'], 0);
      // Invalider la liste
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
};

/**
 * Hook pour supprimer une notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

/**
 * Hook pour supprimer toutes les notifications lues
 */
export const useClearReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationAPI.clearRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', 'list'] });
    },
  });
};

export default {
  useUnreadCount,
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
  useClearReadNotifications,
};