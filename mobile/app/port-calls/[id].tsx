import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { usePortCallDetail } from "@/src/modules/port-calls/hooks/usePortCallDetail";
import { formatLocal } from "@/src/modules/port-calls/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    View as RNView,
    ScrollView,
    TouchableOpacity,
} from "react-native";

export default function PortCallDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { portCall, discharges, vehicles } = usePortCallDetail(id);

    if (portCall.isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={Colors.light.tint} />
            </View>
        );
    }

    if (portCall.error) {
        return (
            <View className="flex-1 items-center justify-center p-6">
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text className="mt-3 text-red-600">
                    {(portCall.error as Error).message}
                </Text>
                <TouchableOpacity
                    className="mt-4 bg-indigo-600 px-4 py-2 rounded"
                    onPress={() => router.back()}
                >
                    <Text className="text-white font-bold">Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const pc: any = portCall.data;
    const status = (pc?.status ?? "unknown").toUpperCase();

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-blue-600 px-4 py-4 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="pr-2 py-1"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">
                    Escale #{pc?.port_call_id}
                </Text>
                <RNView style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="p-4">
                    {/* Port Call Info Card */}
                    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-12 h-12 bg-blue-100 rounded-xl items-center justify-center mr-3">
                                        <Ionicons
                                            name="boat"
                                            size={24}
                                            color="#2563eb"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xl font-bold text-gray-800">
                                            {pc?.vessel?.vessel_name ??
                                                "Navire inconnu"}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            Escale #{pc?.port_call_id}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View className="px-3 py-1.5 rounded-full bg-gray-100">
                                <Text className="text-xs font-bold text-gray-700">
                                    {status}
                                </Text>
                            </View>
                        </View>

                        <View className="space-y-3">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="business-outline"
                                    size={18}
                                    color="#6b7280"
                                />
                                <Text className="ml-3 text-gray-600">
                                    <Text className="font-semibold">
                                        Agent:{" "}
                                    </Text>
                                    {pc?.vessel_agent}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="location-outline"
                                    size={18}
                                    color="#6b7280"
                                />
                                <Text className="ml-3 text-gray-600">
                                    <Text className="font-semibold">
                                        Origine:{" "}
                                    </Text>
                                    {pc?.origin_port}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color="#6b7280"
                                />
                                <Text className="ml-3 text-gray-600">
                                    <Text className="font-semibold">ETA: </Text>
                                    {formatLocal(pc?.estimated_arrival)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Vehicles Section */}
                    <View className="bg-white rounded-2xl p-5 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="car"
                                    size={20}
                                    color="#2563eb"
                                />
                                <Text className="ml-2 text-lg font-bold text-gray-800">
                                    Véhicules
                                </Text>
                            </View>
                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                                <Text className="text-sm font-bold text-blue-700">
                                    {vehicles.data?.total ??
                                        vehicles.data?.vehicles?.length ??
                                        0}{" "}
                                    véhicule
                                    {(vehicles.data?.total ??
                                        vehicles.data?.vehicles?.length ??
                                        0) !== 1
                                        ? "s"
                                        : ""}
                                </Text>
                            </View>
                        </View>

                        {vehicles.isLoading ? (
                            <View className="items-center py-8">
                                <ActivityIndicator
                                    size="large"
                                    color="#2563eb"
                                />
                                <Text className="text-gray-600 mt-3">
                                    Chargement des véhicules...
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={vehicles.data?.vehicles ?? []}
                                keyExtractor={(item) => String(item.vehicle_id)}
                                ItemSeparatorComponent={() => (
                                    <View className="h-3" />
                                )}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push(
                                                `/vehicles/${item.vehicle_id}`
                                            )
                                        }
                                        className="active:opacity-80"
                                    >
                                        <View className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                            <View className="flex-row justify-between items-start mb-3">
                                                <View className="flex-1">
                                                    <Text
                                                        className="font-bold text-gray-800 text-base"
                                                        numberOfLines={1}
                                                    >
                                                        {item.make} {item.model}
                                                    </Text>
                                                    <Text className="text-gray-600 text-sm mt-1">
                                                        {item.year} •{" "}
                                                        {item.color}
                                                    </Text>
                                                    <Text className="text-gray-500 text-xs font-mono mt-1">
                                                        VIN: {item.vin}
                                                    </Text>
                                                </View>
                                                <View className="items-end">
                                                    {item.is_primed && (
                                                        <View className="px-2 py-1 rounded-full bg-indigo-100 mb-2">
                                                            <Text className="text-xs font-bold text-indigo-700">
                                                                PRIMED
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <View className="px-2 py-1 rounded-full bg-green-100">
                                                        <Text className="text-xs font-bold text-green-700">
                                                            {
                                                                item.vehicle_condition
                                                            }
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center">
                                                    <Ionicons
                                                        name="car-outline"
                                                        size={14}
                                                        color="#6b7280"
                                                    />
                                                    <Text className="ml-1 text-gray-600 text-sm">
                                                        {item.type}
                                                    </Text>
                                                </View>
                                                {item.ship_location && (
                                                    <View className="flex-row items-center">
                                                        <Ionicons
                                                            name="location-outline"
                                                            size={14}
                                                            color="#6b7280"
                                                        />
                                                        <Text className="ml-1 text-gray-500 text-sm">
                                                            {item.ship_location}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>

                                            {item.vehicle_observation &&
                                                item.vehicle_observation !==
                                                    "Néant" && (
                                                    <View className="mt-3 p-2 bg-amber-50 rounded-lg">
                                                        <Text
                                                            className="text-xs text-amber-800"
                                                            numberOfLines={2}
                                                        >
                                                            <Text className="font-semibold">
                                                                Observation:{" "}
                                                            </Text>
                                                            {
                                                                item.vehicle_observation
                                                            }
                                                        </Text>
                                                    </View>
                                                )}
                                        </View>
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={() => (
                                    <View className="items-center py-8">
                                        <Ionicons
                                            name="car-outline"
                                            size={48}
                                            color="#9ca3af"
                                        />
                                        <Text className="text-gray-500 mt-4 text-center text-lg">
                                            Aucun véhicule trouvé
                                        </Text>
                                        <Text className="text-gray-400 text-sm mt-2 text-center">
                                            Cette escale ne contient aucun
                                            véhicule
                                        </Text>
                                    </View>
                                )}
                                scrollEnabled={false}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
