import axios from 'axios';

const api = axios.create({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rmastAdminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('rmastAdminToken');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export default api;