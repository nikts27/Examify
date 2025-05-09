import { axiosInstance } from '@/State/Auth/Interceptor';

export const API_BASE_URL = "http://localhost:5456/api"

const api = axiosInstance.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;