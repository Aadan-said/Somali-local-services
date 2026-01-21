import { create } from 'zustand';
import { storage } from './storage';
import { authApi } from '../api/auth.api';

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'CLIENT' | 'PROVIDER' | 'USER' | 'ADMIN';
    image?: string | null;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string, phone?: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    setUser: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,

    login: async (identifier, password) => {
        set({ isLoading: true });
        try {
            const data = await authApi.login(identifier, password);
            console.log('Login Success:', data.user.role);

            await storage.setItem('token', data.token);
            await storage.setItem('user', JSON.stringify(data.user));

            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    register: async (name, email, password, role, phone) => {
        set({ isLoading: true });
        try {
            const data = await authApi.register({ name, email, password, role, phone });
            console.log('Register Success:', data.user.role);

            await storage.setItem('token', data.token);
            await storage.setItem('user', JSON.stringify(data.user));

            set({
                user: data.user,
                token: data.token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error) {
            set({ isLoading: false });
            throw error;
        }
    },

    logout: async () => {
        await storage.removeItem('token');
        await storage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    checkAuth: async () => {
        try {
            const token = await storage.getItem('token');
            const userStr = await storage.getItem('user');

            if (token && userStr) {
                set({
                    token,
                    user: JSON.parse(userStr),
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Auth Check Error:', error);
            set({ isLoading: false });
        }
    },

    setUser: async (user: User) => {
        await storage.setItem('user', JSON.stringify(user));
        set({ user });
    },
}));
