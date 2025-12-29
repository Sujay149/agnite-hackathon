export const API_BASE_URL = 'http://localhost:8000/api';

export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CHAT: '/chat',
    DOCUMENTS: '/documents',
    SAFETY: '/safety',
};

export const DEFAULT_CHAT_MESSAGES = [
    { id: 1, text: 'Welcome to the Manufacturing Plant SOP & Safety Bot! How can I assist you today?' },
];

export const DOCUMENT_TYPES = {
    SOP: 'Standard Operating Procedure',
    SAFETY: 'Safety Document',
};

export const SAFETY_ALERTS = {
    HIGH: 'High Risk',
    MEDIUM: 'Medium Risk',
    LOW: 'Low Risk',
};