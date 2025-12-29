import axios from 'axios';
import { AuthResponse } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
};

export const logout = async (): Promise<void> => {
    await axios.post(`${API_URL}/auth/logout`);
};

export const register = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data;
};