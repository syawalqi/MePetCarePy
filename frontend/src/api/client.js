import axios from 'axios';

// 1. Look for VITE_API_URL in environment variables (for Production)
// 2. Fallback to localhost (for Development)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple Auth Interceptor
apiClient.interceptors.request.use((config) => {
  // 1. Block mutations if offline
  if (!navigator.onLine && config.method !== 'get') {
    const error = new Error('Offline: Data cannot be modified without internet connection.');
    error.isOffline = true;
    return Promise.reject(error);
  }

  // 2. Try to find the Supabase token in localStorage
  // Supabase stores it as "sb-<project-ref>-auth-token"
  const sbKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
  if (sbKey) {
    const session = JSON.parse(localStorage.getItem(sbKey));
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

export default apiClient;
