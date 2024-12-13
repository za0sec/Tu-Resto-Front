import axios from 'axios';
import Cookies from 'js-cookie';
import config from "/utils/config";

const apiClient = axios.create({
    baseURL: `${config.apiUrl}`,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(async (config) => {
    const accessToken = Cookies.get('accessToken');
    
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

async function refreshAccessToken() {
    const refreshToken = Cookies.get('refreshToken');
    
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post(`${config.apiUrl}/auth/refresh`, { 
            refresh: refreshToken 
        });
        
        const { access: accessToken, refresh: newRefreshToken } = response.data;

        Cookies.set('accessToken', accessToken);
        if (newRefreshToken) {
            Cookies.set('refreshToken', newRefreshToken);
        }

        return accessToken;
    } catch (error) {
        throw error;
    }
}


export default apiClient;
