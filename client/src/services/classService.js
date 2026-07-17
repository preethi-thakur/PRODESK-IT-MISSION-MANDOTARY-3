import apiClient from "./apiClient";

export const classService = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/classes");
      return response.data?.data || [];
    } catch (error) {
      console.error("Get Classes Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/classes/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Get Class Error:", error.response?.data || error.message);
      throw error;
    }
  },

  create: async (data) => {
    try {
      const payload = {
        className: data.className.trim(),
        instructor: data.instructor.trim(),
        capacity: Number(data.capacity),
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      };

      const response = await apiClient.post("/classes", payload);
      return response.data?.data;
    } catch (error) {
      console.error("Create Class Error:", error.response?.data || error.message);
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const payload = {
        className: data.className.trim(),
        instructor: data.instructor.trim(),
        capacity: Number(data.capacity),
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      };

      const response = await apiClient.put(`/classes/${id}`, payload);
      return response.data?.data;
    } catch (error) {
      console.error("Update Class Error:", error.response?.data || error.message);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      await apiClient.delete(`/classes/${id}`);
      return true;
    } catch (error) {
      console.error("Delete Class Error:", error.response?.data || error.message);
      throw error;
    }
  },
};