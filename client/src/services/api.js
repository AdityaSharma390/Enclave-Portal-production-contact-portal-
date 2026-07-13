import axios from 'axios';

let rawBaseUrl = import.meta.env.VITE_API_URL || '/api';
// Fallback check: if user forgot to append /api in their Vercel environment variables, do it for them!
if (rawBaseUrl !== '/api' && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  rawBaseUrl = rawBaseUrl.endsWith('/') ? `${rawBaseUrl}api` : `${rawBaseUrl}/api`;
}

// Base API instance configuration
const API = axios.create({
  baseURL: rawBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject JWT Token interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('enclave_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for session expiry auto-logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('enclave_token');
      localStorage.removeItem('enclave_user');
      // If we are on client, reload or redirect to login page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
