import { Text, View } from "@/components/Themed";
import { usePortCalls } from "@/src/modules/port-calls/hooks/usePortCalls";
import { formatLocal } from "@/src/modules/port-calls/lib/utils";
import { usePortCallsStore } from "@/src/modules/port-calls/store/usePortCallsStore";
import { PortCall } from "@/src/modules/port-calls/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    TextInput,
    TouchableOpacity,
} from "react-native";

export default function PortCallScreen() {
    const router = useRouter();
    const store = usePortCallsStore();
    const {
        data,
        isLoading,
        refetch,
        isFetching,
        error: queryError,
    } = usePortCalls({ q: store.q, status: store.status });

    const loading = isLoading || isFetching;
    const portCalls = (data?.data ?? []) as PortCall[];
    const error = queryError ? (queryError as Error).message : null;

    function onRefresh() {
        refetch();
    }

    const filtered = useMemo(() => {
        let list = portCalls.slice();

        if (store.status !== "all") {
            list = list.filter(
                (p) => (p.status ?? "").toLowerCase() === store.status
            );
        }

        if (store.q && String(store.q).trim()) {
            const q = String(store.q).toLowerCase();
            list = list.filter(
                (p) =>
                    (p.vessel_agent ?? "").toLowerCase().includes(q) ||
                    (p.origin_port ?? "").toLowerCase().includes(q) ||
                    (p.vessel?.vessel_name ?? "").toLowerCase().includes(q) ||
                    String(p.port_call_id).includes(q)
            );
        }

        if (store.sortBy === "eta") {
            list.sort((a, b) => {
                const ta = a.estimated_arrival
                    ? new Date(a.estimated_arrival).getTime()
                    : Infinity;
                const tb = b.estimated_arrival
                    ? new Date(b.estimated_arrival).getTime()
                    : Infinity;
                return ta - tb;
            });
        } else if (store.sortBy === "vehicles") {
            list.sort(
                (a, b) => (b.vehicles_number ?? 0) - (a.vehicles_number ?? 0)
            );
        } else if (store.sortBy === "created") {
            list.sort((a, b) => {
                const ta = a["created_at"]
                    ? new Date((a as any).created_at).getTime()
                    : 0;
                const tb = b["created_at"]
                    ? new Date((b as any).created_at).getTime()
                    : 0;
                return tb - ta;
            });
        }

        return list;
    }, [portCalls, store.q, store.status, store.sortBy]);

    function renderItem({ item }: { item: PortCall }) {
        const eta = formatLocal(item.estimated_arrival);
        const badge = getStatusBadge(item.status);
        return (
            <TouchableOpacity
                onPress={() => router.push(`/port-calls/${item.port_call_id}`)}
                className="active:opacity-80"
            >
                <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    {/* Header with vessel name and status */}
                    <View className="flex-row justify-between items-start mb-4">
                        <View className="flex-1">
                            <View className="flex-row items-center mb-2">
                                <View className="w-10 h-10 bg-blue-100 rounded-xl items-center justify-center mr-3">
                                    <Ionicons
                                        name="boat"
                                        size={20}
                                        color="#2563eb"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text
                                        className="text-lg font-bold text-gray-800"
                                        numberOfLines={1}
                                    >
                                        {item.vessel?.vessel_name ??
                                            "Navire inconnu"}
                                    </Text>
                                    <Text className="text-sm text-gray-500">
                                        Escale #{item.port_call_id}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View
                            className="px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: badge.bg }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{ color: badge.fg }}
                            >
                                {badge.label}
                            </Text>
                        </View>
                    </View>

                    {/* Agent and Port Info */}
                    <View className="mb-4 space-y-2">
                        <View className="flex-row items-center">
                            <Ionicons
                                name="business-outline"
                                size={16}
                                color="#6b7280"
                            />
                            <Text className="ml-2 text-gray-600 text-sm">
                                {item.vessel_agent}
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons
                                name="location-outline"
                                size={16}
                                color="#6b7280"
                            />
                            <Text className="ml-2 text-gray-600 text-sm">
                                {item.origin_port}
                            </Text>
                        </View>
                    </View>

                    {/* Footer with ETA and vehicles count */}
                    <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                        <View className="flex-row items-center">
                            <Ionicons
                                name="calendar-outline"
                                size={16}
                                color="#374151"
                            />
                            <Text className="ml-2 text-gray-800 font-semibold">
                                {eta}
                            </Text>
                        </View>
                        <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                            <Ionicons
                                name="car-outline"
                                size={16}
                                color="#374151"
                            />
                            <Text className="ml-1 text-gray-800 font-bold">
                                {item.vehicles_number ?? 0} véhicule
                                {(item.vehicles_number ?? 0) !== 1 ? "s" : ""}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header Section */}
            <View className="bg-blue-600 px-4 pt-4 pb-6">
                <Text className="text-white text-2xl font-bold mb-2">
                    Escales
                </Text>
                <Text className="text-blue-100 text-base">
                    Gestion des port calls et véhicules
                </Text>

                {error && (
                    <View className="mt-4 p-3 bg-red-100 rounded-xl flex-row items-center justify-between">
                        <Text className="text-red-800 flex-1 mr-2">
                            {error}
                        </Text>
                        <TouchableOpacity
                            className="bg-red-600 px-3 py-2 rounded-lg"
                            onPress={() => refetch()}
                        >
                            <Text className="text-white font-bold">
                                Réessayer
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Search and Filters */}
            <View className="bg-white px-4 py-4 border-b border-gray-200">
                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 mb-4">
                    <Ionicons name="search" size={20} color="#6b7280" />
                    <TextInput
                        placeholder="Rechercher par navire, agent, port..."
                        className="flex-1 ml-3 text-base"
                        value={store.q}
                        onChangeText={(v) => store.setQ(v)}
                        clearButtonMode="while-editing"
                    />
                </View>

                {/* Status Filters */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Statut
                    </Text>
                    <View className="flex-row flex-wrap">
                        <Pill
                            label="Tous"
                            active={store.status === "all"}
                            onPress={() => store.setStatus("all")}
                            activeBgClass="bg-blue-600"
                            activeTextClass="text-white font-bold"
                        />
                        <Pill
                            label="En attente"
                            active={store.status === "pending"}
                            onPress={() => store.setStatus("pending")}
                            activeBgClass="bg-amber-500"
                            activeTextClass="text-white font-bold"
                        />
                        <Pill
                            label="En cours"
                            active={store.status === "in_progress"}
                            onPress={() => store.setStatus("in_progress")}
                            activeBgClass="bg-blue-600"
                            activeTextClass="text-white font-bold"
                        />
                        <Pill
                            label="Terminé"
                            active={store.status === "completed"}
                            onPress={() => store.setStatus("completed")}
                            activeBgClass="bg-green-600"
                            activeTextClass="text-white font-bold"
                        />
                    </View>
                </View>

                {/* Sort Options */}
                <View>
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Trier par
                    </Text>
                    <View className="flex-row flex-wrap">
                        <Pill
                            label="ETA"
                            active={store.sortBy === "eta"}
                            onPress={() => store.setSortBy("eta")}
                            small
                            activeBgClass="bg-purple-600"
                            activeTextClass="text-white font-bold"
                        />
                        <Pill
                            label="Véhicules"
                            active={store.sortBy === "vehicles"}
                            onPress={() => store.setSortBy("vehicles")}
                            small
                            activeBgClass="bg-rose-600"
                            activeTextClass="text-white font-bold"
                        />
                        <Pill
                            label="Récent"
                            active={store.sortBy === "created"}
                            onPress={() => store.setSortBy("created")}
                            small
                            activeBgClass="bg-slate-800"
                            activeTextClass="text-white font-bold"
                        />
                    </View>
                </View>
            </View>

            {/* Port Calls List */}
            <View className="flex-1 px-4 pt-4">
                {isLoading && !isFetching ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#2563eb" />
                        <Text className="text-gray-600 mt-4">
                            Chargement des escales...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filtered}
                        keyExtractor={(i) => String(i.port_call_id)}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() => <View className="h-4" />}
                        refreshControl={
                            <RefreshControl
                                refreshing={isFetching}
                                onRefresh={onRefresh}
                            />
                        }
                        ListEmptyComponent={() => (
                            <View className="items-center py-12">
                                <Ionicons
                                    name="boat-outline"
                                    size={48}
                                    color="#9ca3af"
                                />
                                <Text className="text-gray-500 mt-4 text-center text-lg">
                                    Aucune escale trouvée
                                </Text>
                                <Text className="text-gray-400 text-sm mt-2 text-center">
                                    Essayez d'ajuster votre recherche ou vos
                                    filtres
                                </Text>
                            </View>
                        )}
                        ListHeaderComponent={() => (
                            <View className="mb-2">
                                <Text className="text-sm text-gray-600">
                                    {filtered.length} escale
                                    {filtered.length !== 1 ? "s" : ""} trouvée
                                    {filtered.length !== 1 ? "s" : ""}
                                </Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </View>
    );
}

function statusStyle(status?: string | null) {
    const s = (status ?? "").toLowerCase();
    if (s === "pending") return { color: "#ff9f1c" };
    if (s === "completed") return { color: "#2ecc71" };
    if (s === "in_progress") return { color: "#3498db" };
    return { color: "#8e8e93" };
}

function Pill({
    label,
    active,
    onPress,
    small,
    activeBgClass = "bg-indigo-600",
    activeTextClass = "text-white font-bold",
}: {
    label: string;
    active?: boolean;
    onPress?: () => void;
    small?: boolean;
    activeBgClass?: string;
    activeTextClass?: string;
}) {
    const base = `${small ? "px-2 py-1" : "px-3 py-2"} rounded-full mr-2`;
    const containerClass = active
        ? `${activeBgClass} ${base}`
        : `bg-white border border-gray-300 ${base}`;
    const textClass = active ? activeTextClass : "text-gray-700";
    return (
        <TouchableOpacity onPress={onPress} className={containerClass}>
            <Text className={textClass}>{label}</Text>
        </TouchableOpacity>
    );
}

// styles migrated to nativewind className usage

function getStatusBadge(status?: string | null) {
    const s = (status ?? "").toLowerCase();
    if (s === "pending")
        return { bg: "#FFF4E5", fg: "#B25E09", label: "PENDING" };
    if (s === "completed")
        return { bg: "#E9F9EF", fg: "#1B7F4D", label: "COMPLETED" };
    if (s === "in_progress")
        return { bg: "#E8F1FE", fg: "#1F5BD8", label: "IN PROGRESS" };
    return {
        bg: "#F3F4F6",
        fg: "#6B7280",
        label: (status ?? "UNKNOWN").toUpperCase(),
    };
}
