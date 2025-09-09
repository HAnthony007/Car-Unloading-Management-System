import { api } from "@/lib/axiosIntance";
import { Storage } from "@/lib/storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

interface LoginCredentials {
    email: string;
    password: string;
}

// Types décrivant le format normalisé dans l'app
export interface UserPermissions {
    is_administrator: boolean;
    can_manage_users: boolean;
    can_view_reports: boolean; // Normalisé même si l'API envoie can_vew_reports (typo)
}

export interface UserRole {
    role_id?: number;
    role_name: string;
    display_name?: string;
    permissions: UserPermissions;
}

export interface MatriculationInfo {
    prefix: string;
    year?: string;
    sequence?: string;
}

export interface User {
    user_id: number;
    matriculation_number: string;
    matriculation_info?: MatriculationInfo;
    full_name: string; // Backend
    email: string;
    phone?: string;
    role: UserRole;
    profile_completion?: number;
    account_age_days?: number;
}

// Réponses réelles de l'API (avant normalisation)
interface RawLoginResponse {
    message: string;
    data: {
        user: any; // On normalise ensuite
        token: string;
    };
}

interface RawMeResponse {
    message: string;
    data: {
        user: any;
    };
}

interface NormalizedAuthData {
    user: User;
    token: string;
}

// Fonction de normalisation pour gérer les incohérences de l'API
function normalizeUser(raw: any): User {
    if (!raw) throw new Error("Invalid user payload");

    const permissions = raw.role?.permissions || {};
    const normalizedPermissions: UserPermissions = {
        is_administrator: !!permissions.is_administrator,
        can_manage_users: !!permissions.can_manage_users,
        // L'API envoie can_vew_reports (typo), on fallback
        can_view_reports: !!(
            permissions.can_view_reports ?? permissions.can_vew_reports
        ),
    };

    return {
        user_id: raw.user_id,
        matriculation_number: raw.matriculation_number,
        matriculation_info: raw.matriculation_info,
        full_name: raw.full_name || raw.display_name || raw.fullName || "",
        email: raw.email,
        phone: raw.phone,
        role: {
            role_id: raw.role?.role_id,
            role_name: raw.role?.role_name,
            display_name: raw.role?.display_name,
            permissions: normalizedPermissions,
        },
        profile_completion: raw.profile_completion,
        account_age_days: raw.account_age_days,
    };
}

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
                    return normalizeUser(cached);
                }

                const { data } = await api.get<RawMeResponse>("/auth/me");
                const normalized = normalizeUser(data.data.user);
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
                user: normalizeUser(data.data.user),
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
