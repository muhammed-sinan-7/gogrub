import axios from 'axios';
import { ENDPOINTS } from './endpoints';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
  timeout: 10000,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access');
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// Force logout helper
// axios.js
export const clearAuthAndReload = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");

  // Hard redirect (safe everywhere)
  window.location.href = "/";
};


// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('refresh')
    ) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem('refresh');

      if (!refresh) {
        clearAuthAndReload();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await api.post(
          ENDPOINTS.REFRESH,
          { refresh }
        );

        localStorage.setItem('access', refreshResponse.data.access);
        originalRequest.headers.Authorization =
          `Bearer ${refreshResponse.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        clearAuthAndReload();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
