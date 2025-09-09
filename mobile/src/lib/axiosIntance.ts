import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const api = axios.create({
    baseURL:
        process.env.EXPO_PUBLIC_BACKEND_API_BASE_URL ||
        "http://localhost:8000/api", // fallback local
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await SecureStore.deleteItemAsync("auth_token");
            await SecureStore.deleteItemAsync("user_data");
        }
        return Promise.reject(error);
    }
);
