import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS,
    timeout: API_CONFIG.TIMEOUT,
});

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

export interface AdminStats {
    totalUsers: number;
    verifiedProviders: number;
    ongoingJobs: number;
    totalEarnings: number;
}

export interface AdminDashboardData {
    stats: AdminStats;
    pendingProviders: any[];
    recentRequests: any[];
}

export const adminApi = {
    getStats: async () => {
        const response = await api.get<AdminDashboardData>('admin/stats');
        return response.data;
    },
    getUsers: async () => {
        const response = await api.get<any[]>('admin/users');
        return response.data;
    },
    updateUserStatus: async (userId: string, accountStatus: string) => {
        const response = await api.patch('admin/users', { userId, accountStatus });
        return response.data;
    },
    getProviders: async (pending: boolean = false) => {
        const response = await api.get<any[]>(`admin/providers${pending ? '?pending=true' : ''}`);
        return response.data;
    },
    verifyProvider: async (providerId: string, verified: boolean) => {
        const response = await api.patch('admin/providers', { providerId, verified });
        return response.data;
    },
    getReports: async () => {
        const response = await api.get<any[]>('admin/reports');
        return response.data;
    },
    updateReportStatus: async (reportId: string, status: string) => {
        const response = await api.patch('admin/reports', { reportId, status });
        return response.data;
    }
};
