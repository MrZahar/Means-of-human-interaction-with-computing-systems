import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 12000 });
export const messageFromError = error => error.response?.data?.message || (error.code === 'ECONNABORTED' ? 'Сервер не ответил вовремя' : 'Сервер недоступен');
