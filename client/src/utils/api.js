const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  classes: {
    getAll: () => `${API_BASE_URL}/classes`,
    getById: (id) => `${API_BASE_URL}/classes/${id}`,
    create: () => `${API_BASE_URL}/classes`,
    update: (id) => `${API_BASE_URL}/classes/${id}`,
    delete: (id) => `${API_BASE_URL}/classes/${id}`,
  },
  waitlist: {
    getAll: () => `${API_BASE_URL}/waitlist`,
    getById: (id) => `${API_BASE_URL}/waitlist/${id}`,
    create: () => `${API_BASE_URL}/waitlist`,
    update: (id) => `${API_BASE_URL}/waitlist/${id}`,
    delete: (id) => `${API_BASE_URL}/waitlist/${id}`,
  },
  notifications: {
    getAll: () => `${API_BASE_URL}/notifications`,
    send: () => `${API_BASE_URL}/notifications/send`,
  },
};
