import apiClient from './apiClient';

const apiService = {
  get: async (endpoint: string) => {
    try {
      const response = await apiClient.get(endpoint);
      return response.data;
    } catch (error : any) {
      throw error;
    }
  },
  post: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  put: async (endpoint: string, data: any) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (endpoint: string) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default apiService;
