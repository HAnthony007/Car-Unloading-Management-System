import { api } from "@/src/lib/axios-instance";
import { Storage } from "@/src/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { NormalizeUser } from "../lib/normalize-user";
import {
    LoginCredentials,
    NormalizedAuthData,
    RawLoginResponse,
    RawMeResponse,
    User,
} from "../type";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    const userQuery = useQuery<User | null>({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const token = await Storage.getToken();
            if (!token) return null; // Pas connecté

            try {
                // D'abord cache local
                const cached = await Storage.getUser();
                if (cached) {
                    // On renormalise au cas où le format ait changé
                    return NormalizeUser(cached);
                }

                const { data } = await api.get<RawMeResponse>("/auth/me");
                const normalized = NormalizeUser(data.data.user);
                await Storage.setUser(normalized);
                return normalized;
            } catch (error) {
                await Storage.clearAll();
                return null;
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    const loginMutation = useMutation<
        NormalizedAuthData,
        Error,
        LoginCredentials
    >({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await api.post<RawLoginResponse>(
                "/auth/login",
                credentials
            );
            const normalized: NormalizedAuthData = {
                user: NormalizeUser(data.data.user),
                token: data.data.token,
            };
            return normalized;
        },
        onSuccess: async (data) => {
            await Storage.setToken(data.token);
            await Storage.setUser(data.user);
            queryClient.setQueryData(["currentUser"], data.user);
            router.replace("/(tabs)");
        },
        onError: (error: any) => {
            // Laisser react-query exposer l'erreur, ne pas relancer un throw inutile
            // mais on homogénéise le message
            const message =
                error?.response?.data?.error ||
                error?.message ||
                "Erreur de connexion";
            console.log("Login error message:", error);
            return Promise.reject(new Error(message));
        },
    });

    const logoutMutation = useMutation<{ success: boolean }, Error>({
        mutationFn: async () => {
            try {
                await api.post("/auth/logout");
            } catch (error: any) {
                // Même si l'API échoue, on force un logout local pour éviter un état bloqué
            }
            await Storage.clearAll();
            return { success: true };
        },
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: ["currentUser"],
                exact: true,
            });
            router.replace("/login");
        },
    });

    return {
        user: userQuery.data ?? null,
        isLoading: userQuery.isLoading,
        isAuthenticated: !!userQuery.data,
        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        loginError: loginMutation.error,
        refetchUser: userQuery.refetch,
    };
};
