import axios from 'axios';

// Reuses the SAME backend URL env var the public website already uses.
const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7050/api';

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('cgs_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem('cgs_token');
      localStorage.removeItem('cgs_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export const API_BASE = API_URL.replace(/\/api\/?$/, '');

export function fileUrl(relativePath) {
  if (!relativePath) return null;
  return `${API_BASE}${relativePath}`;
}

export default client;
