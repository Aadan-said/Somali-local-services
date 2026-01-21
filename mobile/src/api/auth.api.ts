import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    headers: API_CONFIG.HEADERS,
    timeout: API_CONFIG.TIMEOUT,
});

export const authApi = {
    login: async (identifier: string, password: string) => {
        console.log('Login request to:', `${API_CONFIG.BASE_URL}auth/login`);
        try {
            const response = await api.post('auth/login', { identifier, password });
            return response.data;
        } catch (error: any) {
            console.error('Login Error Message:', error.message);
            console.error('Login Error Status:', error.response?.status);
            console.error('Login Error Data:', error.response?.data);
            if (error.code) console.error('Error Code:', error.code);
            throw error;
        }
    },
    register: async (data: any) => {
        console.log('Register request to:', `${API_CONFIG.BASE_URL}auth/register`);
        try {
            const response = await api.post('auth/register', data);
            return response.data;
        } catch (error: any) {
            console.error('Register Error:', error.response?.status, error.response?.data);
            throw error;
        }
    },
};
