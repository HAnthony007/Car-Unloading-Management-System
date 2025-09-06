import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eye, Filter, Plus, Search, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// -------------------- Types --------------------
interface Vessel {
    vessel_id: number;
    imo_no: string;
    vessel_name: string;
    flag: string;
    created_at: string;
    updated_at: string;
}

interface VehicleInPortCall {
    vehicle_id: number;
    vin: string;
    make: string;
    model: string;
    year: number;
    owner_name: string;
    color: string;
    type: string;
    weight: string;
    vehicle_condition: string; // Neuf | Occasion
    vehicle_observation: string;
    origin_country: string;
    ship_location: string;
    is_primed: boolean;
    created_at: string;
    updated_at: string;
}

interface PortCall {
    port_call_id: number;
    vessel_agent: string;
    origin_port: string;
    estimated_arrival: string; // ETA
    arrival_date: string | null;
    estimated_departure: string | null; // ETD
    departure_date: string | null;
    vessel_id: number;
    dock_id: number | null;
    vehicles_number: number;
    status: "pending" | "in_progress" | "completed" | "canceled";
    vessel: Vessel;
    dock: any; // future detail
    created_at: string;
    updated_at: string;
    vehicles?: VehicleInPortCall[]; // attached list when viewing details
}

// -------------------- Helpers --------------------
const formatDate = (
    dateStr: string | null,
    opts: Intl.DateTimeFormatOptions = {}
) => {
    if (!dateStr) return "—";
    try {
        return new Date(dateStr).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            ...opts,
        });
    } catch (e) {
        return "—";
    }
};

const getPortCallStatusColor = (status: PortCall["status"]) => {
    switch (status) {
        case "pending":
            return "warning"; // amber
        case "in_progress":
            return "info"; // blue
        case "completed":
            return "success"; // green
        case "canceled":
            return "error"; // red
        default:
            return "neutral";
    }
};

const getPortCallStatusText = (status: PortCall["status"]) => {
    switch (status) {
        case "pending":
            return "En attente";
        case "in_progress":
            return "En cours";
        case "completed":
            return "Terminé";
        case "canceled":
            return "Annulé";
        default:
            return "Inconnu";
    }
};

// -------------------- Component --------------------
export default function PortCallsScreen() {
    // UI State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPortCall, setSelectedPortCall] = useState<PortCall | null>(
        null
    );

    // Sample static data (would be fetched from API)
    const portCalls: PortCall[] = [
        {
            port_call_id: 1,
            vessel_agent: "TRANSOCEAN MADAGASCAR",
            origin_port: "Kobe, Japon",
            estimated_arrival: "2025-08-02T10:00:00.000000Z",
            arrival_date: null,
            estimated_departure: null,
            departure_date: null,
            vessel_id: 1,
            dock_id: null,
            vehicles_number: 5,
            status: "pending",
            vessel: {
                vessel_id: 1,
                imo_no: "9334567",
                vessel_name: "MV ASIA EXPRESS",
                flag: "Panama",
                created_at: "2025-09-06T10:35:40.000000Z",
                updated_at: "2025-09-06T10:35:40.000000Z",
            },
            dock: null,
            created_at: "2025-09-06T10:35:40.000000Z",
            updated_at: "2025-09-06T10:35:40.000000Z",
            vehicles: [
                {
                    vehicle_id: 1,
                    vin: "JTDBR32E820123456",
                    make: "Toyota",
                    model: "Corolla",
                    year: 2022,
                    owner_name: "Car Mada Import",
                    color: "Blanc",
                    type: "Berline",
                    weight: "1250",
                    vehicle_condition: "Occasion",
                    vehicle_observation: "Rayure pare-choc",
                    origin_country: "Japon",
                    ship_location: "Deck 2 - Bay 5",
                    is_primed: true,
                    created_at: "2025-09-06T10:35:40.000000Z",
                    updated_at: "2025-09-06T10:35:40.000000Z",
                },
                {
                    vehicle_id: 2,
                    vin: "JN1CV6EK9EM123789",
                    make: "Nissan",
                    model: "March",
                    year: 2023,
                    owner_name: "MADA AUTO SARL",
                    color: "Gris",
                    type: "Compact",
                    weight: "1000",
                    vehicle_condition: "Neuf",
                    vehicle_observation: "Néant",
                    origin_country: "Japon",
                    ship_location: "Deck 2 - Bay 6",
                    is_primed: false,
                    created_at: "2025-09-06T10:35:40.000000Z",
                    updated_at: "2025-09-06T10:35:40.000000Z",
                },
            ],
        },
        {
            port_call_id: 2,
            vessel_agent: "OCEAN GATE AGENCY",
            origin_port: "Shanghai, Chine",
            estimated_arrival: "2025-09-15T06:30:00.000000Z",
            arrival_date: null,
            estimated_departure: "2025-09-18T12:00:00.000000Z",
            departure_date: null,
            vessel_id: 2,
            dock_id: null,
            vehicles_number: 120,
            status: "in_progress",
            vessel: {
                vessel_id: 2,
                imo_no: "9781234",
                vessel_name: "MV PACIFIC STAR",
                flag: "Liberia",
                created_at: "2025-09-01T08:20:00.000000Z",
                updated_at: "2025-09-01T08:20:00.000000Z",
            },
            dock: null,
            created_at: "2025-09-07T09:00:00.000000Z",
            updated_at: "2025-09-07T09:00:00.000000Z",
        },
        {
            port_call_id: 3,
            vessel_agent: "TRANSOCEAN MADAGASCAR",
            origin_port: "Busan, Corée du Sud",
            estimated_arrival: "2025-07-12T15:00:00.000000Z",
            arrival_date: "2025-07-12T16:10:00.000000Z",
            estimated_departure: "2025-07-14T09:00:00.000000Z",
            departure_date: "2025-07-14T09:30:00.000000Z",
            vessel_id: 3,
            dock_id: null,
            vehicles_number: 72,
            status: "completed",
            vessel: {
                vessel_id: 3,
                imo_no: "9512345",
                vessel_name: "MV AFRICA GLORY",
                flag: "Malte",
                created_at: "2025-07-10T11:11:00.000000Z",
                updated_at: "2025-07-10T11:11:00.000000Z",
            },
            dock: null,
            created_at: "2025-07-10T11:11:00.000000Z",
            updated_at: "2025-07-14T10:00:00.000000Z",
        },
    ];

    // Derived filtered list
    const filteredPortCalls = useMemo(() => {
        return portCalls.filter((pc) => {
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                pc.vessel_agent.toLowerCase().includes(q) ||
                pc.origin_port.toLowerCase().includes(q) ||
                pc.vessel.vessel_name.toLowerCase().includes(q) ||
                pc.vessel.imo_no.toLowerCase().includes(q);
            if (statusFilter === "all") return matchesSearch;
            return matchesSearch && pc.status === statusFilter;
        });
    }, [searchQuery, statusFilter, portCalls]);

    // Statistics
    const totalPortCalls = portCalls.length;
    const pendingCount = portCalls.filter((p) => p.status === "pending").length;
    const inProgressCount = portCalls.filter(
        (p) => p.status === "in_progress"
    ).length;
    const completedCount = portCalls.filter(
        (p) => p.status === "completed"
    ).length;

    // Render each Port Call row
    const renderPortCall = ({ item }: { item: PortCall }) => (
        <Card className="mb-3">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setSelectedPortCall(item);
                    setShowDetails(true);
                }}
            >
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 pr-2">
                        <Text
                            className="text-base font-semibold text-slate-900"
                            numberOfLines={1}
                        >
                            {item.vessel.vessel_name}
                        </Text>
                        <Text
                            className="text-xs text-gray-500"
                            numberOfLines={1}
                        >
                            Agent: {item.vessel_agent}
                        </Text>
                    </View>
                    <Badge
                        label={getPortCallStatusText(item.status)}
                        variant={getPortCallStatusColor(item.status)}
                        size="small"
                    />
                </View>

                <View className="flex-row mb-2">
                    <View className="flex-1 mb-2">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            Port d'origine
                        </Text>
                        <Text
                            className="text-sm font-medium text-slate-900"
                            numberOfLines={1}
                        >
                            {item.origin_port}
                        </Text>
                    </View>
                    <View className="flex-1 mb-2">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            Véhicules
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.vehicles_number}
                        </Text>
                    </View>
                </View>

                <View className="flex-row">
                    <View className="flex-1">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            ETA
                        </Text>
                        <Text className="text-xs font-medium text-slate-900">
                            {formatDate(item.estimated_arrival)}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            Arrivée
                        </Text>
                        <Text className="text-xs font-medium text-slate-900">
                            {formatDate(item.arrival_date)}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            ETD
                        </Text>
                        <Text className="text-xs font-medium text-slate-900">
                            {formatDate(item.estimated_departure)}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
                            Départ
                        </Text>
                        <Text className="text-xs font-medium text-slate-900">
                            {formatDate(item.departure_date)}
                        </Text>
                    </View>
                </View>

                <View className="mt-3">
                    <Button
                        title="Détails"
                        size="small"
                        variant="outline"
                        className="w-full"
                        icon={<Eye color="#059669" size={16} />}
                        onPress={() => {
                            setSelectedPortCall(item);
                            setShowDetails(true);
                        }}
                    />
                </View>
            </TouchableOpacity>
        </Card>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900">
                    Port Calls
                </Text>
                <TouchableOpacity className="w-10 h-10 rounded-full bg-emerald-600 items-center justify-center">
                    <Plus color="#FFFFFF" size={20} />
                </TouchableOpacity>
            </View>

            {/* Search & Status Filter */}
            <View className="flex-row p-4 space-x-3">
                <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2 space-x-2 border border-gray-200">
                    <Search color="#6B7280" size={20} />
                    <TextInput
                        className="flex-1 text-base font-normal text-slate-900"
                        placeholder="Rechercher (navire, agent, port, IMO)"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                <TouchableOpacity className="w-10 h-10 rounded-lg bg-white items-center justify-center border border-gray-200">
                    <Filter color="#059669" size={20} />
                </TouchableOpacity>
            </View>

            {/* Status Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 pb-4"
            >
                {[
                    { key: "all", label: "Tous" },
                    { key: "pending", label: "En attente" },
                    { key: "in_progress", label: "En cours" },
                    { key: "completed", label: "Terminés" },
                ].map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        onPress={() => setStatusFilter(f.key)}
                        className={`px-4 h-8 rounded-full mr-2 items-center justify-center border ${
                            statusFilter === f.key
                                ? "bg-emerald-600 border-emerald-600"
                                : "bg-white border-gray-200"
                        }`}
                    >
                        <Text
                            className={`${
                                statusFilter === f.key
                                    ? "text-white"
                                    : "text-gray-600"
                            } text-sm font-medium`}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Kpis */}
            <View className="flex-row px-4 mb-4 space-x-3">
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">Total</Text>
                    <Text className="text-xl font-bold text-emerald-600">
                        {totalPortCalls}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">
                        En attente
                    </Text>
                    <Text className="text-xl font-bold text-amber-500">
                        {pendingCount}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">En cours</Text>
                    <Text className="text-xl font-bold text-sky-600">
                        {inProgressCount}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">Terminés</Text>
                    <Text className="text-xl font-bold text-emerald-600">
                        {completedCount}
                    </Text>
                </Card>
            </View>

            {/* List */}
            <FlatList
                data={filteredPortCalls}
                keyExtractor={(item) => String(item.port_call_id)}
                renderItem={renderPortCall}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="px-4 py-16 items-center">
                        <Text className="text-sm text-gray-500 mb-2">
                            Aucun Port Call trouvé
                        </Text>
                        <Text className="text-xs text-gray-400 text-center">
                            Ajustez votre recherche ou filtre pour afficher des
                            résultats.
                        </Text>
                    </View>
                )}
            />

            {/* Details Modal */}
            <Modal
                visible={showDetails}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView className="flex-1 bg-slate-50">
                    <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                        <Text className="text-lg font-semibold text-slate-900">
                            Détails Port Call
                        </Text>
                        <TouchableOpacity
                            className="p-1"
                            onPress={() => {
                                setShowDetails(false);
                                setSelectedPortCall(null);
                            }}
                        >
                            <X color="#6B7280" size={24} />
                        </TouchableOpacity>
                    </View>

                    {selectedPortCall && (
                        <ScrollView
                            className="flex-1 p-4"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Main Info */}
                            <Card style={{ marginBottom: 16 }}>
                                <Text className="text-base font-semibold text-slate-900 mb-3">
                                    Informations générales
                                </Text>
                                <View className="mb-3 flex-row justify-between items-center">
                                    <Text
                                        className="text-sm font-medium text-slate-900"
                                        numberOfLines={1}
                                    >
                                        {selectedPortCall.vessel.vessel_name}
                                    </Text>
                                    <Badge
                                        label={getPortCallStatusText(
                                            selectedPortCall.status
                                        )}
                                        variant={getPortCallStatusColor(
                                            selectedPortCall.status
                                        )}
                                        size="small"
                                    />
                                </View>
                                <View className="space-y-2">
                                    <Field
                                        label="Agent"
                                        value={selectedPortCall.vessel_agent}
                                    />
                                    <Field
                                        label="Port d'origine"
                                        value={selectedPortCall.origin_port}
                                    />
                                    <Field
                                        label="IMO"
                                        value={selectedPortCall.vessel.imo_no}
                                    />
                                    <Field
                                        label="Pavillon"
                                        value={selectedPortCall.vessel.flag}
                                    />
                                    <Field
                                        label="Véhicules"
                                        value={String(
                                            selectedPortCall.vehicles_number
                                        )}
                                    />
                                </View>
                            </Card>

                            {/* Dates */}
                            <Card style={{ marginBottom: 16 }}>
                                <Text className="text-base font-semibold text-slate-900 mb-3">
                                    Dates
                                </Text>
                                <View className="space-y-2">
                                    <Field
                                        label="ETA"
                                        value={formatDate(
                                            selectedPortCall.estimated_arrival
                                        )}
                                    />
                                    <Field
                                        label="Arrivée"
                                        value={formatDate(
                                            selectedPortCall.arrival_date
                                        )}
                                    />
                                    <Field
                                        label="ETD"
                                        value={formatDate(
                                            selectedPortCall.estimated_departure
                                        )}
                                    />
                                    <Field
                                        label="Départ"
                                        value={formatDate(
                                            selectedPortCall.departure_date
                                        )}
                                    />
                                </View>
                            </Card>

                            {/* Véhicules list */}
                            {selectedPortCall.vehicles && (
                                <Card style={{ marginBottom: 32 }}>
                                    <Text className="text-base font-semibold text-slate-900 mb-3">
                                        Véhicules (
                                        {selectedPortCall.vehicles.length})
                                    </Text>
                                    {selectedPortCall.vehicles.map((v, idx) => (
                                        <View
                                            key={v.vehicle_id}
                                            className={`mb-3 ${idx === selectedPortCall.vehicles!.length - 1 ? "mb-0" : ""}`}
                                        >
                                            <View className="flex-row justify-between items-center mb-1">
                                                <Text
                                                    className="text-sm font-medium text-slate-900"
                                                    numberOfLines={1}
                                                >
                                                    {v.make} {v.model} {v.year}
                                                </Text>
                                                <Badge
                                                    size="small"
                                                    variant={
                                                        v.is_primed
                                                            ? "success"
                                                            : "neutral"
                                                    }
                                                    label={
                                                        v.is_primed
                                                            ? "Apprêté"
                                                            : "Standard"
                                                    }
                                                />
                                            </View>
                                            <Text
                                                className="text-xs text-gray-500 mb-1"
                                                numberOfLines={1}
                                            >
                                                VIN: {v.vin}
                                            </Text>
                                            <View className="flex-row">
                                                <Text className="text-xs text-gray-500 mr-4">
                                                    Couleur: {v.color}
                                                </Text>
                                                <Text className="text-xs text-gray-500 mr-4">
                                                    Type: {v.type}
                                                </Text>
                                                <Text className="text-xs text-gray-500">
                                                    État: {v.vehicle_condition}
                                                </Text>
                                            </View>
                                            {v.vehicle_observation &&
                                                v.vehicle_observation !==
                                                    "Néant" && (
                                                    <Text
                                                        className="text-[11px] text-amber-600 mt-1"
                                                        numberOfLines={2}
                                                    >
                                                        Obs:{" "}
                                                        {v.vehicle_observation}
                                                    </Text>
                                                )}
                                            <View className="h-px bg-gray-100 mt-3" />
                                        </View>
                                    ))}
                                </Card>
                            )}
                        </ScrollView>
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

// Small reusable field line
function Field({ label, value }: { label: string; value: string }) {
    return (
        <View className="flex-row justify-between">
            <Text className="text-xs text-gray-500 w-32" numberOfLines={1}>
                {label}
            </Text>
            <Text
                className="flex-1 text-sm font-medium text-slate-900 text-right"
                numberOfLines={1}
            >
                {value || "—"}
            </Text>
        </View>
    );
}
