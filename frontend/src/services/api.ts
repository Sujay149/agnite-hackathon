import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSOPs = async () => {
  const response = await apiClient.get('/sops');
  return response.data;
};

export const getSafetyAlerts = async () => {
  const response = await apiClient.get('/safety/alerts');
  return response.data;
};

export const reportIncident = async (incidentData) => {
  const response = await apiClient.post('/safety/report', incidentData);
  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getChatResponse = async (message) => {
  const response = await apiClient.post('/chat', { message });
  return response.data;
};