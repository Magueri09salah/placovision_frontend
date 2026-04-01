// src/services/notificationApi.js
import api from './api';

export const notificationAPI = {
  
  getAll: (params = {}) => {
    return api.get('/notifications', { params });
  },

  
  getUnreadCount: () => {
    return api.get('/notifications/unread-count');
  },

  
  markAsRead: (id) => {
    return api.patch(`/notifications/${id}/read`);
  },

 
  markAllAsRead: () => {
    return api.post('/notifications/mark-all-read');
  },

  
  delete: (id) => {
    return api.delete(`/notifications/${id}`);
  },

  
  clearRead: () => {
    return api.delete('/notifications/clear-read');
  },
};

export default notificationAPI;