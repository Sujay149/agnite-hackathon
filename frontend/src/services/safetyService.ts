import axios from 'axios';
import { SafetyIncident } from '../types/safety';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/safety';

export const getSafetyIncidents = async (): Promise<SafetyIncident[]> => {
    const response = await axios.get(`${API_URL}/incidents`);
    return response.data;
};

export const reportSafetyIncident = async (incident: SafetyIncident): Promise<SafetyIncident> => {
    const response = await axios.post(`${API_URL}/incidents`, incident);
    return response.data;
};

export const getSafetyAlerts = async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/alerts`);
    return response.data;
};