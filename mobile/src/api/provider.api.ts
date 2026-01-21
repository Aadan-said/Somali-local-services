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

export interface ProviderJob {
    id: string;
    clientName?: string;
    user?: { name: string; image?: string; phone?: string };
    category: string;
    status: string;
    price: number;
    location?: string;
    createdAt: string;
    description?: string;
    tasks?: string; // JSON string
    progressPercentage?: number;
    proofOfWork?: string;
    proofOfWorkNote?: string;
    review?: {
        rating: number;
        comment?: string;
        createdAt: string;
    };
    provider?: {
        verified: boolean;
    };
}

export interface ProviderDashboardData {
    newLeadsCount: number;
    activeJobsCount: number;
    completedJobsCount: number;
    averageRating: number;
    walletBalance: number;
    recentJobs: ProviderJob[];
}

export interface ProviderWalletData {
    balance: number;
    totalEarned: number;
    thisWeekEarned: number;
    thisMonthEarned: number;
    transactions: any[];
}

export const providerApi = {
    getDashboard: async () => {
        const response = await api.get<ProviderDashboardData>('provider/dashboard');
        return response.data;
    },
    getMarket: async () => {
        const response = await api.get<ProviderJob[]>('provider/market');
        return response.data;
    },
    getJobs: async (status?: string) => {
        const url = status ? `provider/jobs?status=${status}` : 'provider/jobs';
        const response = await api.get<ProviderJob[]>(url);
        return response.data;
    },
    getJobDetails: async (id: string) => {
        const response = await api.get<ProviderJob>(`provider/jobs/${id}`);
        return response.data;
    },
    getWallet: async () => {
        const response = await api.get<ProviderWalletData>('provider/wallet');
        return response.data;
    },
    acceptRequest: async (id: string) => {
        const response = await api.post(`provider/requests/${id}/accept`);
        return response.data;
    },
    updateRequestStatus: async (id: string, status: string) => {
        const response = await api.patch(`provider/requests/${id}/status`, { status });
        return response.data;
    },
    getJobTasks: async (id: string) => {
        const response = await api.get(`provider/jobs/${id}/tasks`);
        return response.data;
    },
    updateJobTasks: async (id: string, tasks: any[]) => {
        const response = await api.post(`provider/jobs/${id}/tasks`, { tasks });
        return response.data;
    },
    submitProof: async (id: string, proof: string, note?: string) => {
        const response = await api.post(`provider/jobs/${id}/proof`, { proofOfWork: proof, proofOfWorkNote: note });
        return response.data;
    },
    updateProfile: async (data: any) => {
        // Map mobile fields to backend schema
        const payload = {
            name: data.name,
            bio: data.bio,
            city: data.location, // location -> city
            category: data.skills, // skills -> category
        };
        const response = await api.patch('provider/me', payload);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('provider/me');
        return response.data;
    },
    withdraw: async (amount: number, service: string, phone: string) => {
        const response = await api.post('provider/wallet', {
            amount,
            type: 'WITHDRAWAL',
            description: `Withdrawal via ${service} (${phone})`
        });
        return response.data;
    },
    changePassword: async (data: { current: string; new: string }) => {
        const response = await api.post('user/change-password', data);
        return response.data;
    }
};
