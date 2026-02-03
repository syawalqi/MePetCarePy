import axios from 'axios';

// Automatically switch between Local and Production URLs
// When running 'npm run dev', it will use localhost.
// When built for production (GitHub Pages), it will use the Railway URL.
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8000'
  : 'https://mepetcarepy-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
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