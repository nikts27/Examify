import { axiosInstance } from '@/State/Auth/Interceptor';

export const API_BASE_URL = "https://examify-backend-app.azurewebsites.net/api"

const api = axiosInstance.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;