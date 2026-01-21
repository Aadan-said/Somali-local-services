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

export interface RecentRequest {
    id: string;
    category: string | null;
    status: string;
    price: number | null;
    createdAt: string;
    provider?: {
        user: {
            name: string;
            image: string | null;
        }
    } | null;
    proofOfWork?: string | null;
    proofOfWorkNote?: string | null;
}

export interface CreateRequestData {
    description: string;
    category?: string;
    location?: string;
    price?: number | string;
}

export interface UpdateProfileData {
    name?: string;
}

export interface ClientDashboardData {
    activeTasksCount: number;
    completedTasksCount: number;
    totalSpent: number;
    walletBalance: number;
    recentRequests: RecentRequest[];
}

export const clientApi = {
    getDashboard: async () => {
        const response = await api.get<ClientDashboardData>('client/dashboard');
        return response.data;
    },
    getRequests: async () => {
        const response = await api.get<RecentRequest[]>('requests');
        return response.data;
    },
    createRequest: async (data: CreateRequestData) => {
        const response = await api.post('requests', data);
        return response.data;
    },
    updateProfile: async (data: UpdateProfileData) => {
        const response = await api.post('user/update', data);
        return response.data;
    },
    updateImage: async (image: string) => {
        const response = await api.post('user/image', { image });
        return response.data;
    },
    getTransactions: async () => {
        const response = await api.get<{ transactions: any[], balance: number, totalSpent: number }>('client/wallet/transaction');
        return response.data;
    },
    deposit: async (amount: number) => {
        const response = await api.post('client/wallet/transaction', { amount, type: 'DEPOSIT', description: 'Deposit via App' });
        return response.data;
    },
    pay: async (amount: number, service: string, phone: string) => {
        const response = await api.post('client/wallet/transaction', {
            amount,
            type: 'PAYMENT',
            description: `Payment via ${service} (${phone})`
        });
        return response.data;
    },
    submitReview: async (data: { requestId: string; providerId: string; rating: number; comment: string }) => {
        const response = await api.post('reviews', data);
        return response.data;
    },
    approveRequest: async (requestId: string) => {
        const response = await api.post(`requests/${requestId}/approve`);
        return response.data;
    },
    rejectRequest: async (requestId: string, reason: string) => {
        const response = await api.post(`requests/${requestId}/reject`, { reason });
        return response.data;
    },
    transfer: async (amount: number, recipientId: string, description: string) => {
        const response = await api.post('client/wallet/transaction', {
            amount,
            type: 'TRANSFER',
            recipientId,
            description
        });
        return response.data;
    },
    changePassword: async (data: { current: string; new: string }) => {
        const response = await api.post('user/change-password', data);
        return response.data;
    }
};
