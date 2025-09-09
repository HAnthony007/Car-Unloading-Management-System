import * as SecureStore from "expo-secure-store";

const AUTH_KEYS = {
    TOKEN: "auth_token",
    USER: "user_data",
} as const;

export const Storage = {
    setToken: (token: string) =>
        SecureStore.setItemAsync(AUTH_KEYS.TOKEN, token),
    getToken: () => SecureStore.getItemAsync(AUTH_KEYS.TOKEN),
    removeToken: () => SecureStore.deleteItemAsync(AUTH_KEYS.TOKEN),

    setUser: (user: object) =>
        SecureStore.setItemAsync(AUTH_KEYS.USER, JSON.stringify(user)),
    getUser: async () => {
        const userData = await SecureStore.getItemAsync(AUTH_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },
    removeUser: () => SecureStore.deleteItemAsync(AUTH_KEYS.USER),

    clearAll: async () => {
        await Promise.all([
            SecureStore.deleteItemAsync(AUTH_KEYS.TOKEN),
            SecureStore.deleteItemAsync(AUTH_KEYS.USER),
        ]);
    },
};
