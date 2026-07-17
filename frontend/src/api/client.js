import axios from 'axios';
import { BASE_API_URL } from './apiEndpoints';

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401) window.dispatchEvent(new Event('auth-expired'));
  return Promise.reject(error);
});
export default api;
