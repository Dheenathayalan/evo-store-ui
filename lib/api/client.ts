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
    return Promise.reject(
      err.response?.data?.message || "Something went wrong",
    );
  },
);

export default api;
