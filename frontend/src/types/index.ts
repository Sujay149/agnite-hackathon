export type AuthUser = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};

export type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
};

export type ChatState = {
  messages: ChatMessage[];
  loading: boolean;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

export type DocumentState = {
  documents: Document[];
  loading: boolean;
};

export type SafetyIncident = {
  id: string;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
};

export type SafetyState = {
  incidents: SafetyIncident[];
  loading: boolean;
};