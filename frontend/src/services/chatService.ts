import axios from 'axios';
import { ChatMessage } from '../types/chat';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const sendMessage = async (message: string): Promise<ChatMessage> => {
    const response = await axios.post(`${API_URL}/chat`, { message });
    return response.data;
};

export const getChatHistory = async (): Promise<ChatMessage[]> => {
    const response = await axios.get(`${API_URL}/chat/history`);
    return response.data;
};