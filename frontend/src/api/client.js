import axios from 'axios';

// Automatically switch between Local and Production URLs
// When running 'npm run dev', it will use localhost.
// When built for production (GitHub Pages), it will use the Railway URL.
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:8000' 
  : 'https://mepetcarepy-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple Auth Interceptor
apiClient.interceptors.request.use((config) => {
  // Try to find the Supabase token in localStorage
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