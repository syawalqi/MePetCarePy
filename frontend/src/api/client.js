import axios from 'axios';

// Use the environment variable if exists, otherwise fallback to the production URL
// For local development, you can create a .env.local file with VITE_API_URL=http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mepetcarepy-production.up.railway.app';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase.auth.token'); 
  // Note: Supabase usually stores session in localStorage under a specific key.
  // However, since we are using supabase-js, it handles auth headers automatically for Supabase calls.
  // For calls to YOUR backend, you need to pass the JWT.
  
  // Let's assume you'll get the session from Supabase client or context.
  // For now, we'll try to get it from local storage if standard supabase key exists,
  // or rely on the user passing it. 
  
  // Actually, better approach: The AuthContext should ideally attach the token.
  // But for simplicity in this migration, let's leave this interceptor basic 
  // and ensure AuthContext passes headers if needed, or we read from the key 
  // 'sb-<your-project-ref>-auth-token' if known.
  
  // A generic fallback for the backend to validate:
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