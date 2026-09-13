import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? (import.meta.env.VITE_API_URL.replace(/\/+$/, '').endsWith('/api')
      ? import.meta.env.VITE_API_URL.replace(/\/+$/, '')
      : `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`)
  : '/api';

const api = axios.create({
  baseURL: API_BASE
});

// Attach JWT token and custom Gemini API key if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tc_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const customKey = localStorage.getItem('tc_gemini_api_key');
  if (customKey) {
    config.headers['x-gemini-api-key'] = customKey;
  }

  return config;
});

export const apiService = {
  // Health
  checkHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },

  // Auth
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    if (res.data.token) {
      localStorage.setItem('tc_auth_token', res.data.token);
      localStorage.setItem('tc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.token) {
      localStorage.setItem('tc_auth_token', res.data.token);
      localStorage.setItem('tc_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('tc_auth_token');
    localStorage.removeItem('tc_user');
  },
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('tc_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },

  // Documents
  uploadDocument: async (data, isFormData = false) => {
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' };
    const res = await api.post('/documents/upload', data, { headers });
    return res.data;
  },
  getDocuments: async () => {
    const res = await api.get('/documents');
    return res.data.documents;
  },
  getDocumentDetails: async (id) => {
    const res = await api.get(`/documents/${id}`);
    return res.data;
  },
  deleteDocument: async (id) => {
    const res = await api.delete(`/documents/${id}`);
    return res.data;
  },

  // Chat
  askQuestion: async (documentId, question) => {
    const res = await api.post(`/chat/${documentId}`, { question });
    return res.data;
  },
  getChatHistory: async (documentId) => {
    const res = await api.get(`/chat/${documentId}/history`);
    return res.data.history;
  },

  // Report Download
  downloadReportUrl: (documentId) => `${API_BASE}/reports/${documentId}`
};
