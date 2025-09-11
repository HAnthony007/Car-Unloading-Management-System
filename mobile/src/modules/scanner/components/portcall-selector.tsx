import { ChevronDown, Search, Ship, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { usePortCalls } from "../../portCalls/hooks/usePortCalls";
import type { PortCall } from "../../portCalls/types";
import { useScannerStore } from "../stores/scanner-store";

export interface PortCallItem {
    id: string; // stored as string for store compatibility
    vessel: string;
    eta?: string | null; // ISO date
    dock?: string | null;
    reference?: string | null;
    status?: string;
}

const formatDate = (iso?: string | null) => {
    if (!iso) return "--";
    try {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
        });
    } catch {
        return iso;
    }
};

interface Props {
    // Deprecated: dynamic fetch now. Keep optional for fallback.
    items?: PortCallItem[];
}

export function PortCallSelector({ items = [] }: Props) {
    const selected = useScannerStore((s) => s.selectedPortCall);
    const setSelected = useScannerStore((s) => s.setSelectedPortCall);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const perPage = 15;

    const query = usePortCalls({
        page,
        per_page: perPage,
        search_term: search || undefined,
    });

    // Map API data to selector items
    const fetchedItems: PortCallItem[] = (query.data?.data ?? []).map(
        (pc: PortCall) => ({
            id: String(pc.port_call_id),
            vessel:
                // attempt common vessel fields; adjust if actual field differs
                (pc as any).vessel_name ||
                (pc as any).vessel?.vessel_name ||
                pc.vessel_agent ||
                `#${pc.port_call_id}`,
            eta: pc.estimated_arrival || pc.arrival_date,
            dock: (pc as any).dock?.name || pc.origin_port || null,
            reference: pc.vessel_agent || null,
            status: (pc as any).status || undefined,
        })
    );

    const list = fetchedItems.length ? fetchedItems : items;
    const active = list.find((i) => i.id === selected) || null;

    // Debounce search (simple)
    useEffect(() => {
        const t = setTimeout(() => {
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [search]);

    return (
        <View className="px-4 pt-3 pb-2 bg-white border-b border-gray-200">
            <Text className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">
                Port Call
            </Text>
            <Pressable
                onPress={() => setOpen(true)}
                className={`flex-row items-center justify-between rounded-xl px-4 py-3 border ${active ? "border-emerald-300 bg-emerald-50/40" : "border-gray-300 bg-gray-50"} active:opacity-80`}
            >
                <View className="flex-row items-center flex-1 pr-3">
                    <View className="w-9 h-9 rounded-lg bg-emerald-600 items-center justify-center mr-3">
                        <Ship size={18} color="#fff" />
                    </View>
                    {active ? (
                        <View className="flex-1">
                            <Text
                                className="text-[13px] font-semibold text-gray-900"
                                numberOfLines={1}
                            >
                                {active.vessel}
                            </Text>
                            <Text
                                className="text-[11px] text-gray-500"
                                numberOfLines={1}
                            >
                                {active.dock || "?"} • ETA{" "}
                                {formatDate(active.eta)}
                            </Text>
                        </View>
                    ) : (
                        <View className="flex-1">
                            <Text className="text-[13px] font-medium text-gray-700">
                                Sélectionner un port call
                            </Text>
                            <Text className="text-[11px] text-gray-400">
                                Filtrer les scans par escale
                            </Text>
                        </View>
                    )}
                </View>
                <ChevronDown size={18} color="#374151" />
            </Pressable>

            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-semibold text-slate-900">
                                Sélection Port Call
                            </Text>
                            <TouchableOpacity
                                onPress={() => setOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            className="-mx-1"
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {/* Search input */}
                            <View className="flex-row items-center mb-4 border border-gray-200 rounded-xl px-3 bg-gray-50">
                                <Search size={16} color="#6B7280" />
                                <TextInput
                                    value={search}
                                    onChangeText={setSearch}
                                    placeholder="Rechercher (navire, agent, port...)"
                                    placeholderTextColor="#9CA3AF"
                                    className="flex-1 ml-2 text-[13px] text-gray-800"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                />
                                {query.isRefetching && (
                                    <ActivityIndicator
                                        size={14 as any}
                                        color="#059669"
                                    />
                                )}
                            </View>
                            {query.isLoading ? (
                                <View className="py-10 items-center">
                                    <ActivityIndicator
                                        size="small"
                                        color="#059669"
                                    />
                                    <Text className="text-xs text-gray-500 mt-2">
                                        Chargement…
                                    </Text>
                                </View>
                            ) : list.length === 0 ? (
                                <View className="px-4 py-10 items-center">
                                    <Text className="text-sm text-gray-500">
                                        Aucune escale trouvée
                                    </Text>
                                </View>
                            ) : (
                                list.map((pc) => {
                                    const isActive = pc.id === selected;
                                    return (
                                        <TouchableOpacity
                                            key={pc.id}
                                            onPress={() => {
                                                setSelected(pc.id);
                                                setOpen(false);
                                            }}
                                            className={`px-4 py-3 mx-1 mb-2 rounded-xl border ${isActive ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50"} active:bg-emerald-50`}
                                            activeOpacity={0.85}
                                        >
                                            <View className="flex-row items-center">
                                                <View className="w-10 h-10 rounded-lg bg-emerald-600 items-center justify-center mr-3">
                                                    <Ship
                                                        size={20}
                                                        color="#fff"
                                                    />
                                                </View>
                                                <View className="flex-1">
                                                    <Text
                                                        className="text-[13px] font-semibold text-slate-900"
                                                        numberOfLines={1}
                                                    >
                                                        {pc.vessel}
                                                    </Text>
                                                    <Text
                                                        className="text-[11px] text-gray-500"
                                                        numberOfLines={1}
                                                    >
                                                        {pc.dock || "?"} • ETA{" "}
                                                        {formatDate(pc.eta)}
                                                    </Text>
                                                    {pc.reference && (
                                                        <Text
                                                            className="text-[10px] text-gray-400 mt-0.5"
                                                            numberOfLines={1}
                                                        >
                                                            Ref: {pc.reference}
                                                        </Text>
                                                    )}
                                                </View>
                                                {pc.status && (
                                                    <View className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100">
                                                        <Text
                                                            className="text-[10px] font-medium text-emerald-700"
                                                            numberOfLines={1}
                                                        >
                                                            {pc.status}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })
                            )}
                            {/* Pagination */}
                            {query.data?.meta &&
                                query.data.meta.last_page > 1 && (
                                    <View className="flex-row items-center justify-center mt-2 mb-1">
                                        <TouchableOpacity
                                            disabled={page <= 1}
                                            onPress={() =>
                                                setPage((p) =>
                                                    Math.max(1, p - 1)
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-lg border mr-2 ${page <= 1 ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"}`}
                                        >
                                            <Text className="text-[11px]">
                                                Prev
                                            </Text>
                                        </TouchableOpacity>
                                        <Text className="text-[11px] text-gray-600">
                                            Page {query.data.meta.current_page}/
                                            {query.data.meta.last_page}
                                        </Text>
                                        <TouchableOpacity
                                            disabled={
                                                page >=
                                                query.data.meta.last_page
                                            }
                                            onPress={() =>
                                                setPage((p) =>
                                                    Math.min(
                                                        query.data!.meta
                                                            .last_page,
                                                        p + 1
                                                    )
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-lg border ml-2 ${page >= query.data.meta.last_page ? "bg-gray-100 border-gray-200" : "bg-white border-gray-300"}`}
                                        >
                                            <Text className="text-[11px]">
                                                Next
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            {selected && (
                                <TouchableOpacity
                                    onPress={() => setSelected(null)}
                                    className="px-4 py-3 mx-1 mt-2 rounded-xl border border-red-200 bg-red-50"
                                >
                                    <Text className="text-[12px] font-medium text-red-600">
                                        Effacer la sélection
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
