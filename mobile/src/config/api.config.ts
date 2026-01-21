import { Platform } from 'react-native';

const LOCAL_IP = '10.97.227.105'; // Explicitly set to your machine's IP
const PORT = 3000;

export const API_CONFIG = {
    BASE_URL: `http://${LOCAL_IP}:${PORT}/api/`,
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    TIMEOUT: 30000,
};
