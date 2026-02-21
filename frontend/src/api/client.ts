import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default client;

export function getErrorMessage(err: unknown, fallback = 'An unexpected error occurred'): string {
  if (axios.isAxiosError(err) && err.response?.data?.error) {
    return err.response.data.error;
  }
  return fallback;
}
