import { Card } from "@/components/ui/Card";
import { PortCallDetailsModal } from "@/modules/portcalls/components/PortCallDetailsModal";
import { PortCallRow } from "@/modules/portcalls/components/PortCallRow";
import { mockPortCalls } from "@/modules/portcalls/data/mock-portcalls";
import { usePortCalls } from "@/modules/portcalls/hooks/usePortCalls";
import { PortCall } from "@/modules/portcalls/types";
import { Filter, Plus, Search } from "lucide-react-native";
import { useState } from "react";
import {
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PortCallsScreen() {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedPortCall, setSelectedPortCall] = useState<PortCall | null>(
        null
    );
    const {
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        filteredPortCalls,
        stats,
    } = usePortCalls(mockPortCalls);

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
                className="px-4 pb-4 mb-4"
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
                        activeOpacity={0.8}
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

            {/* KPIs */}
            <View className="flex-row px-4 mb-4 space-x-3">
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">Total</Text>
                    <Text className="text-xl font-bold text-emerald-600">
                        {stats.total}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">
                        En attente
                    </Text>
                    <Text className="text-xl font-bold text-amber-500">
                        {stats.pending}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">En cours</Text>
                    <Text className="text-xl font-bold text-sky-600">
                        {stats.in_progress}
                    </Text>
                </Card>
                <Card style={{ flex: 1, padding: 12 }}>
                    <Text className="text-xs text-gray-500 mb-1">Terminés</Text>
                    <Text className="text-xl font-bold text-emerald-600">
                        {stats.completed}
                    </Text>
                </Card>
            </View>

            {/* List */}
            <FlatList
                data={filteredPortCalls}
                keyExtractor={(item) => String(item.port_call_id)}
                renderItem={({ item }) => (
                    <PortCallRow
                        item={item}
                        onPressDetails={(pc) => {
                            setSelectedPortCall(pc);
                            setShowDetails(true);
                        }}
                    />
                )}
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
            <PortCallDetailsModal
                visible={showDetails}
                portCall={selectedPortCall}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedPortCall(null);
                }}
            />
        </SafeAreaView>
    );
}
