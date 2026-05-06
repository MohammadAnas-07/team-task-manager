import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Remove trailing slash if present
if (baseURL.endsWith('/')) {
  baseURL = baseURL.slice(0, -1);
}

// Remove trailing /api if present (to avoid double /api/api paths)
if (baseURL.endsWith('/api')) {
  baseURL = baseURL.slice(0, -4);
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Response interceptor - redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on auth pages
      const authPaths = ['/login', '/signup'];
      if (!authPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
