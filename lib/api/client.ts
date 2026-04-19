import axios from "axios";
import { useAuth } from "@/store/auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// 🚀 Request interceptor - adds token
api.interceptors.request.use(
  (config) => {
    // We use getState() here since interceptors are outside React context
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = 
      err.response?.data?.message || 
      err.response?.data?.error || 
      err.response?.data?.detail || 
      "Something went wrong";
    return Promise.reject(message);
  },
);

export default api;
