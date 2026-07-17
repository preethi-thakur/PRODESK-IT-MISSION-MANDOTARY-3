import apiClient from './apiClient';

export const waitlistService = {
  getAll: async () => {
    const response = await apiClient.get('/waitlist');
    return response.data.data || [];
  },

  getById: async (id) => {
    const response = await apiClient.get(`/waitlist/${id}`);
    if (!response.data.data) {
      throw new Error('Waitlist entry not found');
    }
    return response.data.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/waitlist', data);
    if (!response.data.data) {
      throw new Error('Failed to add to waitlist');
    }
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await apiClient.put(`/waitlist/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update waitlist entry');
    }
    return response.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/waitlist/${id}`);
  },
};
