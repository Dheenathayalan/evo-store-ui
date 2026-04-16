import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

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
