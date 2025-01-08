import axios from 'axios';
import { store } from "@/State/Store.js";
import { refreshToken, logout } from "@/State/Auth/Action.js";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5456"
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(new Error(error?.message || 'Request failed'))
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response ? error.response.status : null;

        if (status !== 401 || originalRequest._retry) {
            return Promise.reject(new Error(error?.response?.data?.message || error?.message || 'Request failed'));
        }

        if (isRefreshing) {
            try {
                const token = await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                return Promise.reject(new Error(err?.message || 'Failed to refresh token'));
            }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await store.dispatch(refreshToken());
            const newAccessToken = localStorage.getItem("jwt");
            
            if (!newAccessToken) {
                throw new Error('No new token received');
            }

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken);
            isRefreshing = false;

            return axiosInstance(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            isRefreshing = false;
            store.dispatch(logout());
            return Promise.reject(new Error(refreshError?.message || 'Token refresh failed'));
        }
    }
);

export { axiosInstance as default };
