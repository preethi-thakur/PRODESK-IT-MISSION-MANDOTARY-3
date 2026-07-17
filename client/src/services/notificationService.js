import apiClient from './apiClient';

export const notificationService = {
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data.data || [];
  },

  send: async (data) => {
    const response = await apiClient.post('/notifications/send', data);
    if (!response.data.data) {
      throw new Error('Failed to send notification');
    }
    return response.data.data;
  },
};
