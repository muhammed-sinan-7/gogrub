import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // REQUIRED for refresh cookie
  timeout: 10000,
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// FORCE LOGOUT
// ========================
export const forceLogout = () => {
  localStorage.removeItem("access");
  window.location.href = "/login";
};

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("refresh")
    ) {
      originalRequest._retry = true;

      try {
        // 🔥 NO REFRESH BODY — COOKIE ONLY
        const refreshRes = await axios.post(
          `${BASE_URL}${ENDPOINTS.REFRESH}`,
          {},
          { withCredentials: true }
        );

        const newAccess = refreshRes.data.access;
        localStorage.setItem("access", newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch {
        forceLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
