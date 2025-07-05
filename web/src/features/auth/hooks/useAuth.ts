"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, login, logout } from "../lib/auth";

export function useUser() {
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
        retry: false,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            email,
            password,
        }: {
            email: string;
            password: string;
        }) => login(email, password),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
        },
    });
}
