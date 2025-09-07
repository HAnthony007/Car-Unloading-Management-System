import { Card } from "@/components/ui/Card";
import { VehicleCard } from "@/features/vehicles/components/VehicleCard";
import { VehicleDetailsModal } from "@/features/vehicles/components/VehicleDetailsModal";
import { useVehicles } from "@/features/vehicles/hooks/useVehicles";
import { Vehicle } from "@/features/vehicles/types";
import { Filter, Plus, Search } from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    FlatList,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehiclesScreen() {
    const {
        vehicles,
        filteredVehicles,
        searchQuery,
        setSearchQuery,
        filter,
        setFilter,
        deleteVehicle,
    } = useVehicles();
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [showDetails, setShowDetails] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const handleDeleteVehicle = (vehicleId: string) => {
        Alert.alert(
            "Supprimer le véhicule",
            "Êtes-vous sûr de vouloir supprimer ce véhicule ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: () => {
                        deleteVehicle(vehicleId);
                    },
                },
            ]
        );
    };
    const renderVehicleCard = ({ item }: { item: Vehicle }) => (
        <VehicleCard
            item={item}
            onPressView={(v) => {
                setSelectedVehicle(v);
                setShowDetails(true);
            }}
            onPressEdit={(v) => console.log("Edit vehicle:", v.id)}
            onPressDelete={handleDeleteVehicle}
        />
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900">
                    Gestion des Véhicules
                </Text>
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-emerald-600 items-center justify-center"
                    onPress={() => setShowAddForm(true)}
                >
                    <Plus color="#FFFFFF" size={20} />
                </TouchableOpacity>
            </View>

            {/* Search and Filter */}
            <View className="flex-row p-4 space-x-3">
                <View className="flex-1 flex-row items-center bg-white rounded-lg px-3 py-2 space-x-2">
                    <Search color="#6B7280" size={20} />
                    <TextInput
                        className="flex-1 text-base font-normal text-slate-900"
                        placeholder="Rechercher un véhicule..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <TouchableOpacity className="w-10 h-10 rounded-lg bg-white items-center justify-center">
                    <Filter color="#059669" size={20} />
                </TouchableOpacity>
            </View>

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4 pb-6 mb-1"
            >
                {[
                    { key: "all", label: "Tous" },
                    { key: "arrived", label: "Arrivés" },
                    { key: "stored", label: "Stockés" },
                    { key: "in_transit", label: "En transit" },
                    { key: "delivered", label: "Livrés" },
                ].map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        className={`px-4 h-8 rounded-full mr-2 items-center justify-center ${
                            filter === f.key ? "bg-emerald-600" : "bg-white"
                        }`}
                        onPress={() => setFilter(f.key as any)}
                    >
                        <Text
                            className={`${
                                filter === f.key
                                    ? "text-white"
                                    : "text-gray-500"
                            } text-sm font-medium`}
                        >
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Statistics */}
            <View className="flex-row px-4 mb-4 space-x-3">
                <Card style={{ flex: 1, alignItems: "center", padding: 12 }}>
                    <Text className="text-xl font-bold text-emerald-600 mb-1">
                        {vehicles.length}
                    </Text>
                    <Text className="text-xs font-normal text-gray-500 text-center">
                        Total véhicules
                    </Text>
                </Card>
                <Card style={{ flex: 1, alignItems: "center", padding: 12 }}>
                    <Text className="text-xl font-bold text-emerald-600 mb-1">
                        {vehicles.filter((v) => v.status === "stored").length}
                    </Text>
                    <Text className="text-xs font-normal text-gray-500 text-center">
                        En stock
                    </Text>
                </Card>
                <Card style={{ flex: 1, alignItems: "center", padding: 12 }}>
                    <Text className="text-xl font-bold text-emerald-600 mb-1">
                        {
                            vehicles.filter(
                                (v) => v.customsStatus === "pending"
                            ).length
                        }
                    </Text>
                    <Text className="text-xs font-normal text-gray-500 text-center">
                        En attente
                    </Text>
                </Card>
            </View>

            {/* Vehicle List */}
            <FlatList
                data={filteredVehicles}
                renderItem={renderVehicleCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />

            {/* Vehicle Details Modal */}
            <VehicleDetailsModal
                visible={showDetails}
                vehicle={selectedVehicle}
                onClose={() => setShowDetails(false)}
            />
        </SafeAreaView>
    );
}
