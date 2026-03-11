import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const setToken = (token) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const clearToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
