import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
    CreditCard as Edit3,
    Eye,
    Filter,
    MoveVertical as MoreVertical,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Vehicle {
    id: string;
    brand: string;
    model: string;
    chassisNumber: string;
    color: string;
    origin: string;
    shipowner: string;
    arrivalDate: string;
    zone: string;
    status: "arrived" | "stored" | "delivered" | "in_transit";
    images?: string[];
    notes?: string;
    customsStatus?: "pending" | "cleared" | "hold";
    estimatedDelivery?: string;
}

export default function VehiclesScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
        null
    );
    const [showDetails, setShowDetails] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

    const vehicles: Vehicle[] = [
        {
            id: "1",
            brand: "Toyota",
            model: "RAV4",
            chassisNumber: "JT123456789",
            color: "Blanc",
            origin: "Japon",
            shipowner: "MSC",
            arrivalDate: "2024-01-15",
            zone: "A2",
            status: "stored",
            customsStatus: "cleared",
            estimatedDelivery: "2024-01-18",
            notes: "Véhicule en excellent état",
            images: [
                "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=800",
                "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
        {
            id: "2",
            brand: "BMW",
            model: "X3",
            chassisNumber: "WB987654321",
            color: "Noir",
            origin: "Allemagne",
            shipowner: "CMA CGM",
            arrivalDate: "2024-01-14",
            zone: "B1",
            status: "arrived",
            customsStatus: "pending",
            estimatedDelivery: "2024-01-20",
            notes: "En attente de dédouanement",
            images: [
                "https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
        {
            id: "3",
            brand: "Mercedes",
            model: "GLC",
            chassisNumber: "WD456789123",
            color: "Argent",
            origin: "Allemagne",
            shipowner: "Maersk",
            arrivalDate: "2024-01-13",
            zone: "C3",
            status: "delivered",
            customsStatus: "cleared",
            notes: "Livré au client",
            images: [
                "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
        {
            id: "4",
            brand: "Audi",
            model: "Q5",
            chassisNumber: "WA789123456",
            color: "Bleu",
            origin: "Allemagne",
            shipowner: "MSC",
            arrivalDate: "2024-01-16",
            zone: "A1",
            status: "in_transit",
            customsStatus: "hold",
            estimatedDelivery: "2024-01-25",
            notes: "Problème douanier en cours de résolution",
            images: [
                "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800",
            ],
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "arrived":
                return "warning";
            case "stored":
                return "success";
            case "delivered":
                return "neutral";
            case "in_transit":
                return "info";
            default:
                return "neutral";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "arrived":
                return "Arrivé";
            case "stored":
                return "Stocké";
            case "delivered":
                return "Livré";
            case "in_transit":
                return "En transit";
            default:
                return "Inconnu";
        }
    };

    const getCustomsStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "warning";
            case "cleared":
                return "success";
            case "hold":
                return "error";
            default:
                return "neutral";
        }
    };

    const getCustomsStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return "En attente";
            case "cleared":
                return "Dédouané";
            case "hold":
                return "Bloqué";
            default:
                return "Inconnu";
        }
    };

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesSearch =
            vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.chassisNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        if (selectedFilter === "all") return matchesSearch;
        return matchesSearch && vehicle.status === selectedFilter;
    });

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
                        // Implement delete logic here
                        console.log("Delete vehicle:", vehicleId);
                    },
                },
            ]
        );
    };

    const renderVehicleCard = ({ item }: { item: Vehicle }) => (
        <Card className="mb-3">
            <View className="flex-row justify-between items-center mb-3">
                <View className="flex-1">
                    <Text className="text-base font-semibold text-slate-900 mb-1">
                        {item.brand} {item.model}
                    </Text>
                    <Text className="text-sm text-gray-500">
                        {item.chassisNumber}
                    </Text>
                </View>
                <View className="flex-row items-center space-x-2">
                    <Badge
                        label={getStatusText(item.status)}
                        variant={getStatusColor(item.status)}
                        size="small"
                    />
                    <TouchableOpacity className="p-1">
                        <MoreVertical color="#6B7280" size={16} />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="mb-4">
                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Couleur
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.color}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Origine
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.origin}
                        </Text>
                    </View>
                </View>

                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Armateur
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.shipowner}
                        </Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">Zone</Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {item.zone}
                        </Text>
                    </View>
                </View>

                <View className="flex-row mb-2">
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Douane
                        </Text>
                        <Badge
                            label={getCustomsStatusText(
                                item.customsStatus || "pending"
                            )}
                            variant={getCustomsStatusColor(
                                item.customsStatus || "pending"
                            )}
                            size="small"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-xs text-gray-500 mb-1">
                            Arrivée
                        </Text>
                        <Text className="text-sm font-medium text-slate-900">
                            {new Date(item.arrivalDate).toLocaleDateString(
                                "fr-FR"
                            )}
                        </Text>
                    </View>
                </View>
            </View>

            <View className="flex-row space-x-2">
                <Button
                    title="Voir"
                    onPress={() => {
                        setSelectedVehicle(item);
                        setShowDetails(true);
                    }}
                    variant="outline"
                    size="small"
                    icon={<Eye color="#059669" size={16} />}
                    className="flex-1"
                />
                <Button
                    title="Modifier"
                    onPress={() => console.log("Edit vehicle:", item.id)}
                    variant="outline"
                    size="small"
                    icon={<Edit3 color="#059669" size={16} />}
                    className="flex-1"
                />
                <Button
                    title="Supprimer"
                    onPress={() => handleDeleteVehicle(item.id)}
                    variant="outline"
                    size="small"
                    icon={<Trash2 color="#DC2626" size={16} />}
                    className="flex-1 border border-red-100"
                />
            </View>
        </Card>
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
                ].map((filter) => (
                    <TouchableOpacity
                        key={filter.key}
                        className={`px-4 h-8 rounded-full mr-2 items-center justify-center ${
                            selectedFilter === filter.key
                                ? "bg-emerald-600"
                                : "bg-white"
                        }`}
                        onPress={() => setSelectedFilter(filter.key)}
                    >
                        <Text
                            className={`${
                                selectedFilter === filter.key
                                    ? "text-white"
                                    : "text-gray-500"
                            } text-sm font-medium`}
                        >
                            {filter.label}
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
            <Modal
                visible={showDetails}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <SafeAreaView className="flex-1 bg-slate-50">
                    <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                        <Text className="text-lg font-semibold text-slate-900">
                            Détails du véhicule
                        </Text>
                        <TouchableOpacity
                            className="p-1"
                            onPress={() => setShowDetails(false)}
                        >
                            <X color="#6B7280" size={24} />
                        </TouchableOpacity>
                    </View>

                    {selectedVehicle && (
                        <ScrollView className="flex-1 p-4">
                            {/* Vehicle Images */}
                            {selectedVehicle.images &&
                                selectedVehicle.images.length > 0 && (
                                    <ScrollView horizontal className="mb-4">
                                        {selectedVehicle.images.map(
                                            (image, index) => (
                                                <View
                                                    key={index}
                                                    className="w-48 h-36 bg-gray-100 rounded-lg mr-3 items-center justify-center"
                                                >
                                                    <Text>
                                                        Image placeholder
                                                    </Text>
                                                </View>
                                            )
                                        )}
                                    </ScrollView>
                                )}

                            {/* Vehicle Information */}
                            <Card style={{ marginBottom: 16 }}>
                                <Text className="text-base font-semibold text-slate-900 mb-3">
                                    Informations générales
                                </Text>
                                <View className="space-y-3">
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Marque
                                        </Text>
                                        <Text className="text-sm font-medium text-slate-900">
                                            {selectedVehicle.brand}
                                        </Text>
                                    </View>
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Modèle
                                        </Text>
                                        <Text className="text-sm font-medium text-slate-900">
                                            {selectedVehicle.model}
                                        </Text>
                                    </View>
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Numéro de châssis
                                        </Text>
                                        <Text className="text-sm font-medium text-slate-900">
                                            {selectedVehicle.chassisNumber}
                                        </Text>
                                    </View>
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Couleur
                                        </Text>
                                        <Text className="text-sm font-medium text-slate-900">
                                            {selectedVehicle.color}
                                        </Text>
                                    </View>
                                </View>
                            </Card>

                            {/* Status Information */}
                            <Card style={{ marginBottom: 16 }}>
                                <Text className="text-base font-semibold text-slate-900 mb-3">
                                    Statut et localisation
                                </Text>
                                <View className="space-y-3">
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Statut
                                        </Text>
                                        <Badge
                                            label={getStatusText(
                                                selectedVehicle.status
                                            )}
                                            variant={getStatusColor(
                                                selectedVehicle.status
                                            )}
                                        />
                                    </View>
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Zone
                                        </Text>
                                        <Text className="text-sm font-medium text-slate-900">
                                            {selectedVehicle.zone}
                                        </Text>
                                    </View>
                                    <View className="mb-2">
                                        <Text className="text-xs font-normal text-gray-500 mb-1">
                                            Douane
                                        </Text>
                                        <Badge
                                            label={getCustomsStatusText(
                                                selectedVehicle.customsStatus ||
                                                    "pending"
                                            )}
                                            variant={getCustomsStatusColor(
                                                selectedVehicle.customsStatus ||
                                                    "pending"
                                            )}
                                        />
                                    </View>
                                </View>
                            </Card>

                            {/* Notes */}
                            {selectedVehicle.notes && (
                                <Card style={{ marginBottom: 16 }}>
                                    <Text className="text-base font-semibold text-slate-900 mb-3">
                                        Notes
                                    </Text>
                                    <Text className="text-sm font-normal text-gray-700 leading-5">
                                        {selectedVehicle.notes}
                                    </Text>
                                </Card>
                            )}
                        </ScrollView>
                    )}
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}
