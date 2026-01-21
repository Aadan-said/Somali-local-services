import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS,
    timeout: API_CONFIG.TIMEOUT,
});

// Add interceptor to inject token
api.interceptors.request.use(
    async (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    link: string | null;
    createdAt: string;
}

export const notificationsApi = {
    getNotifications: async () => {
        const response = await api.get<Notification[]>('notifications');
        return response.data;
    },
    markAsRead: async (id: string) => {
        const response = await api.patch(`notifications/${id}/read`);
        return response.data;
    },
    markAllAsRead: async () => {
        const response = await api.patch('notifications', { readAll: true });
        return response.data;
    }
};
