import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import {
    createPortCall,
    deletePortCall,
    fetchPortCallById,
    fetchPortCalls,
    fetchPortCallVehicles,
    updatePortCall,
    type CreatePortCallPayload,
    type PortCallsQueryParams,
    type PortCallVehiclesQueryParams,
    type UpdatePortCallPayload,
} from "../lib/portcall";
import type { PortCall } from "../types";

// Cache key helpers
const portCallsKey = (params: PortCallsQueryParams) => ["port-calls", params];
const portCallKey = (id: number) => ["port-call", id];
const portCallVehiclesKey = (id: number) => ["port-call", id, "vehicles"];

export function usePortCalls(params: PortCallsQueryParams = {}) {
    return useQuery({
        queryKey: portCallsKey(params),
        queryFn: () => fetchPortCalls(params),
    });
}

// High-level hook for screen: manages search, status filter, stats, pagination
export function usePortCallsScreen() {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [page, setPage] = React.useState(1);
    const perPage = 15;

    // Base list query (omit status when 'all')
    const listQuery = usePortCalls({
        page,
        per_page: perPage,
        search_term: searchQuery || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
    });

    // Stats queries (per_page=1 just to get meta.total)
    const totalStats = usePortCalls({
        per_page: 1,
        search_term: searchQuery || undefined,
    });
    const pendingStats = usePortCalls({
        per_page: 1,
        search_term: searchQuery || undefined,
        status: "pending",
    });
    const inProgressStats = usePortCalls({
        per_page: 1,
        search_term: searchQuery || undefined,
        status: "in_progress",
    });
    const completedStats = usePortCalls({
        per_page: 1,
        search_term: searchQuery || undefined,
        status: "completed",
    });

    const stats = React.useMemo(
        () => ({
            total: totalStats.data?.meta.total ?? 0,
            pending: pendingStats.data?.meta.total ?? 0,
            in_progress: inProgressStats.data?.meta.total ?? 0,
            completed: completedStats.data?.meta.total ?? 0,
        }),
        [
            totalStats.data,
            pendingStats.data,
            inProgressStats.data,
            completedStats.data,
        ]
    );

    const isLoadingStats =
        totalStats.isLoading ||
        pendingStats.isLoading ||
        inProgressStats.isLoading ||
        completedStats.isLoading;

    const portCalls = listQuery.data?.data ?? [];
    const pagination = listQuery.data?.meta;

    return {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        portCalls,
        stats,
        page,
        setPage,
        perPage,
        pagination,
        isLoading: listQuery.isLoading,
        isRefetching: listQuery.isRefetching,
        isLoadingStats,
        refetch: () => listQuery.refetch(),
    };
}

export function usePortCall(id: number | undefined) {
    return useQuery({
        queryKey: id ? portCallKey(id) : ["port-call", "undefined"],
        queryFn: () => fetchPortCallById(id as number),
        enabled: typeof id === "number" && id > 0,
    });
}

export function usePortCallVehicles(id: number | undefined) {
    return useQuery({
        queryKey: id
            ? portCallVehiclesKey(id)
            : ["port-call", "vehicles", "undefined"],
        queryFn: () => fetchPortCallVehicles(id as number),
        enabled: typeof id === "number" && id > 0,
    });
}

export function useCreatePortCall() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreatePortCallPayload) => createPortCall(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["port-calls"] });
        },
    });
}

export function useUpdatePortCall(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: UpdatePortCallPayload) =>
            updatePortCall(id, payload),
        onSuccess: (data: PortCall) => {
            qc.invalidateQueries({ queryKey: portCallKey(id) });
            qc.invalidateQueries({ queryKey: ["port-calls"] });
        },
    });
}

export function useDeletePortCall() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deletePortCall(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["port-calls"] });
        },
    });
}

// Convenience hook for infinite-like manual pagination (client driven)
export function combinePaginated<T>(pages: { data: T[] }[]): T[] {
    return pages.flatMap((p) => p.data);
}

// Paginated & filtered vehicles inside a PortCall
export function usePortCallVehiclesList(portCallId: number | undefined) {
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [filters, setFilters] = React.useState<
        Partial<PortCallVehiclesQueryParams>
    >({});

    const queryKey = [
        "port-call",
        portCallId,
        "vehicles",
        { page, perPage, search, filters },
    ];

    const query = useQuery({
        queryKey,
        enabled: typeof portCallId === "number" && portCallId > 0,
        queryFn: () =>
            fetchPortCallVehicles(portCallId as number, {
                page,
                per_page: perPage,
                search_term: search || undefined,
                ...filters,
            }),
    });

    return {
        vehicles: query.data?.data ?? [],
        meta: query.data?.meta,
        page,
        perPage,
        setPage,
        setPerPage,
        search,
        setSearch,
        filters,
        setFilters,
        isLoading: query.isLoading,
        isRefetching: query.isRefetching,
        refetch: query.refetch,
    };
}
