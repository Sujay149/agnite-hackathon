import axios from 'axios';
import { Document } from '../types/document';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchDocuments = async (): Promise<Document[]> => {
    const response = await axios.get(`${API_URL}/documents`);
    return response.data;
};

export const uploadDocument = async (formData: FormData): Promise<Document> => {
    const response = await axios.post(`${API_URL}/documents`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteDocument = async (documentId: string): Promise<void> => {
    await axios.delete(`${API_URL}/documents/${documentId}`);
};