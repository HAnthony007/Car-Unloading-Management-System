import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    RefreshControl,
    TextInput,
    TouchableOpacity,
} from "react-native";

// Mock data - replace with real API calls
const mockVehicles = [
    {
        id: "1",
        vin: "ABC123456789DEF01",
        make: "Toyota",
        model: "Camry",
        year: 2023,
        color: "Blanc",
        type: "Sedan",
        condition: "Excellent",
        status: "Chargé",
        portCallId: "1234",
        location: "Deck A-12",
        primed: true,
        observation: "Véhicule en parfait état",
    },
    {
        id: "2",
        vin: "XYZ987654321GHI02",
        make: "Honda",
        model: "Civic",
        year: 2022,
        color: "Noir",
        type: "Sedan",
        condition: "Bon",
        status: "En attente",
        portCallId: "1235",
        location: "Deck B-05",
        primed: false,
        observation: "Petite rayure sur le pare-choc avant",
    },
    {
        id: "3",
        vin: "DEF456789123JKL03",
        make: "BMW",
        model: "X5",
        year: 2024,
        color: "Gris",
        type: "SUV",
        condition: "Excellent",
        status: "Déchargé",
        portCallId: "1233",
        location: "Terminal",
        primed: true,
        observation: "Néant",
    },
];

export default function VehiclesScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [refreshing, setRefreshing] = useState(false);

    const filters = [
        { key: "all", label: "Tous", color: "#6b7280" },
        { key: "Chargé", label: "Chargés", color: "#059669" },
        { key: "En attente", label: "En attente", color: "#d97706" },
        { key: "Déchargé", label: "Déchargés", color: "#2563eb" },
    ];

    const filteredVehicles = mockVehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter =
            selectedFilter === "all" || vehicle.status === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => setRefreshing(false), 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Chargé":
                return "#059669";
            case "En attente":
                return "#d97706";
            case "Déchargé":
                return "#2563eb";
            default:
                return "#6b7280";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "Chargé":
                return "#d1fae5";
            case "En attente":
                return "#fef3c7";
            case "Déchargé":
                return "#dbeafe";
            default:
                return "#f3f4f6";
        }
    };

    const renderVehicle = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => router.push(`/vehicles/${item.id}`)}
            className="mb-3"
            activeOpacity={0.7}
        >
            <View className="bg-white rounded-2xl p-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-gray-800 mb-1">
                            {item.make} {item.model}
                        </Text>
                        <Text className="text-sm text-gray-600 mb-2">
                            {item.year} • {item.color}
                        </Text>
                        <Text className="text-xs text-gray-500 font-mono">
                            VIN: {item.vin}
                        </Text>
                    </View>
                    <View className="items-end">
                        <View
                            className="px-3 py-1 rounded-full mb-2"
                            style={{
                                backgroundColor: getStatusBg(item.status),
                            }}
                        >
                            <Text
                                className="text-xs font-bold"
                                style={{ color: getStatusColor(item.status) }}
                            >
                                {item.status}
                            </Text>
                        </View>
                        {item.primed && (
                            <View className="px-2 py-1 rounded-full bg-indigo-100">
                                <Text className="text-xs font-bold text-indigo-700">
                                    PRIMED
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color="#6b7280"
                        />
                        <Text className="ml-1 text-gray-600 text-sm">
                            {item.location}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Ionicons
                            name="boat-outline"
                            size={16}
                            color="#6b7280"
                        />
                        <Text className="ml-1 text-gray-600 text-sm">
                            Escale #{item.portCallId}
                        </Text>
                    </View>
                </View>

                {item.observation && item.observation !== "Néant" && (
                    <View className="mt-3 p-2 bg-amber-50 rounded-lg">
                        <Text className="text-xs text-amber-800">
                            <Text className="font-semibold">Observation: </Text>
                            {item.observation}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-gray-800 mb-4">
                    Gestion des Véhicules
                </Text>

                {/* Search Bar */}
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-3 mb-4">
                    <Ionicons name="search" size={20} color="#6b7280" />
                    <TextInput
                        placeholder="Rechercher par VIN, marque, modèle..."
                        className="flex-1 ml-3 text-base"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filter Pills */}
                <View className="flex-row flex-wrap">
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            onPress={() => setSelectedFilter(filter.key)}
                            className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                                selectedFilter === filter.key
                                    ? "bg-blue-600"
                                    : "bg-gray-200"
                            }`}
                        >
                            <Text
                                className={`text-sm font-semibold ${
                                    selectedFilter === filter.key
                                        ? "text-white"
                                        : "text-gray-700"
                                }`}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Vehicle List */}
            <View className="flex-1 px-4 pt-4">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-gray-600">
                        {filteredVehicles.length} véhicule
                        {filteredVehicles.length !== 1 ? "s" : ""}
                    </Text>
                    <TouchableOpacity className="flex-row items-center">
                        <Ionicons name="filter" size={16} color="#6b7280" />
                        <Text className="ml-1 text-gray-600 text-sm">
                            Filtrer
                        </Text>
                    </TouchableOpacity>
                </View>

                <FlatList
                    data={filteredVehicles}
                    keyExtractor={(item) => item.id}
                    renderItem={renderVehicle}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    ListEmptyComponent={() => (
                        <View className="items-center py-12">
                            <Ionicons
                                name="car-outline"
                                size={48}
                                color="#9ca3af"
                            />
                            <Text className="text-gray-500 mt-4 text-center">
                                Aucun véhicule trouvé
                            </Text>
                            <Text className="text-gray-400 text-sm mt-1 text-center">
                                Essayez d'ajuster votre recherche
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}
