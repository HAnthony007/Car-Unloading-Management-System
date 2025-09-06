import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Alert, Dimensions, ScrollView, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

// Mock data - replace with real API call
const mockVehicle = {
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
    engineNumber: "ENG123456789",
    chassisNumber: "CHS987654321",
    fuelType: "Essence",
    transmission: "Automatique",
    mileage: "15,000 km",
    weight: "1,550 kg",
    dimensions: "4.88m x 1.84m x 1.45m",
    insurance: "Valide jusqu'au 15/12/2024",
    registration: "AB-123-CD",
    owner: "SMMC Transport",
    loadingDate: "2024-01-15",
    expectedDischarge: "2024-01-20",
    actualDischarge: null,
    photos: [
        { id: "1", url: "https://example.com/photo1.jpg", type: "Front" },
        { id: "2", url: "https://example.com/photo2.jpg", type: "Rear" },
        { id: "3", url: "https://example.com/photo3.jpg", type: "Side" },
    ],
    documents: [
        { id: "1", name: "Carte Grise", status: "Validé" },
        { id: "2", name: "Assurance", status: "Validé" },
        { id: "3", name: "Contrôle Technique", status: "En attente" },
    ],
};

export default function VehicleDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const vehicle = mockVehicle; // In real app, fetch by id

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Chargé":
                return "#16a34a"; // SMMC green
            case "En attente":
                return "#f59e0b"; // amber-500
            case "Déchargé":
                return "#3b82f6"; // blue-500
            default:
                return "#6b7280";
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case "Chargé":
                return "#dcfce7"; // green-100
            case "En attente":
                return "#fef3c7"; // amber-100
            case "Déchargé":
                return "#dbeafe"; // blue-100
            default:
                return "#f3f4f6";
        }
    };

    const handleStatusUpdate = () => {
        Alert.alert(
            "Mettre à jour le statut",
            "Choisissez le nouveau statut du véhicule",
            [
                {
                    text: "Chargé",
                    onPress: () => console.log("Status: Chargé"),
                },
                {
                    text: "En attente",
                    onPress: () => console.log("Status: En attente"),
                },
                {
                    text: "Déchargé",
                    onPress: () => console.log("Status: Déchargé"),
                },
                { text: "Annuler", style: "cancel" },
            ]
        );
    };

    const InfoCard = ({
        title,
        children,
        icon,
    }: {
        title: string;
        children: React.ReactNode;
        icon?: string;
    }) => (
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100">
            <View className="flex-row items-center mb-4">
                {icon && (
                    <View className="w-10 h-10 bg-primary/10 rounded-2xl items-center justify-center mr-3">
                        <Ionicons
                            name={icon as any}
                            size={20}
                            color="#16a34a"
                        />
                    </View>
                )}
                <Text className="text-xl font-bold text-gray-900 flex-1">
                    {title}
                </Text>
            </View>
            {children}
        </View>
    );

    const InfoRow = ({
        label,
        value,
        icon,
    }: {
        label: string;
        value: string;
        icon?: string;
    }) => (
        <View className="flex-row items-center justify-between py-3 border-b border-gray-50 last:border-b-0">
            <View className="flex-row items-center flex-1">
                {icon && (
                    <View className="w-8 h-8 bg-gray-50 rounded-lg items-center justify-center mr-3">
                        <Ionicons
                            name={icon as any}
                            size={16}
                            color="#6b7280"
                        />
                    </View>
                )}
                <Text className="text-gray-700 font-medium flex-1 text-base">
                    {label}
                </Text>
            </View>
            <Text className="text-gray-900 font-semibold text-right text-base max-w-[60%]">
                {value}
            </Text>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-6 py-5 border-b border-gray-100 flex-row items-center justify-between shadow-sm">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-gray-100 rounded-2xl items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={20} color="#374151" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900">
                    Détails du Véhicule
                </Text>
                <TouchableOpacity
                    onPress={handleStatusUpdate}
                    className="w-10 h-10 bg-primary/10 rounded-2xl items-center justify-center"
                >
                    <Ionicons name="create-outline" size={20} color="#16a34a" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="p-6">
                    {/* Vehicle Header */}
                    <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg border border-gray-100">
                        <View className="flex-row justify-between items-start mb-6">
                            <View className="flex-1">
                                <Text className="text-3xl font-bold text-gray-900 mb-2">
                                    {vehicle.make} {vehicle.model}
                                </Text>
                                <Text className="text-lg text-gray-600 mb-3">
                                    {vehicle.year} • {vehicle.color} •{" "}
                                    {vehicle.type}
                                </Text>
                                <View className="bg-gray-50 rounded-2xl px-4 py-3">
                                    <Text className="text-sm text-gray-600 font-mono">
                                        VIN: {vehicle.vin}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <View
                                    className="px-4 py-3 rounded-2xl mb-3"
                                    style={{
                                        backgroundColor: getStatusBg(
                                            vehicle.status
                                        ),
                                    }}
                                >
                                    <Text
                                        className="text-base font-bold"
                                        style={{
                                            color: getStatusColor(
                                                vehicle.status
                                            ),
                                        }}
                                    >
                                        {vehicle.status}
                                    </Text>
                                </View>
                                {vehicle.primed && (
                                    <View className="px-3 py-2 rounded-2xl bg-primary/10">
                                        <Text className="text-sm font-bold text-primary">
                                            PRIMED
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between bg-gray-50 rounded-2xl p-4">
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-primary/10 rounded-2xl items-center justify-center mr-3">
                                    <Ionicons
                                        name="location-outline"
                                        size={20}
                                        color="#16a34a"
                                    />
                                </View>
                                <Text className="text-gray-700 font-medium text-base">
                                    {vehicle.location}
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-primary/10 rounded-2xl items-center justify-center mr-3">
                                    <Ionicons
                                        name="boat-outline"
                                        size={20}
                                        color="#16a34a"
                                    />
                                </View>
                                <Text className="text-gray-700 font-medium text-base">
                                    Escale #{vehicle.portCallId}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Technical Details */}
                    <InfoCard
                        title="Détails Techniques"
                        icon="settings-outline"
                    >
                        <InfoRow
                            label="Numéro de moteur"
                            value={vehicle.engineNumber}
                            icon="settings-outline"
                        />
                        <InfoRow
                            label="Numéro de châssis"
                            value={vehicle.chassisNumber}
                            icon="car-outline"
                        />
                        <InfoRow
                            label="Type de carburant"
                            value={vehicle.fuelType}
                            icon="flash-outline"
                        />
                        <InfoRow
                            label="Transmission"
                            value={vehicle.transmission}
                            icon="git-merge-outline"
                        />
                        <InfoRow
                            label="Kilométrage"
                            value={vehicle.mileage}
                            icon="speedometer-outline"
                        />
                        <InfoRow
                            label="Poids"
                            value={vehicle.weight}
                            icon="scale-outline"
                        />
                        <InfoRow
                            label="Dimensions"
                            value={vehicle.dimensions}
                            icon="resize-outline"
                        />
                    </InfoCard>

                    {/* Legal Information */}
                    <InfoCard
                        title="Informations Légales"
                        icon="document-text-outline"
                    >
                        <InfoRow
                            label="Immatriculation"
                            value={vehicle.registration}
                            icon="document-text-outline"
                        />
                        <InfoRow
                            label="Propriétaire"
                            value={vehicle.owner}
                            icon="business-outline"
                        />
                        <InfoRow
                            label="Assurance"
                            value={vehicle.insurance}
                            icon="shield-checkmark-outline"
                        />
                    </InfoCard>

                    {/* Journey Information */}
                    <InfoCard
                        title="Informations de Trajet"
                        icon="calendar-outline"
                    >
                        <InfoRow
                            label="Date de chargement"
                            value={vehicle.loadingDate}
                            icon="calendar-outline"
                        />
                        <InfoRow
                            label="Déchargement prévu"
                            value={vehicle.expectedDischarge}
                            icon="time-outline"
                        />
                        <InfoRow
                            label="Déchargement effectif"
                            value={vehicle.actualDischarge || "Non effectué"}
                            icon="checkmark-circle-outline"
                        />
                    </InfoCard>

                    {/* Documents */}
                    <InfoCard title="Documents" icon="folder-outline">
                        {vehicle.documents.map((doc) => (
                            <View
                                key={doc.id}
                                className="flex-row items-center justify-between py-4 border-b border-gray-50 last:border-b-0"
                            >
                                <View className="flex-row items-center flex-1">
                                    <View className="w-10 h-10 bg-gray-50 rounded-2xl items-center justify-center mr-4">
                                        <Ionicons
                                            name="document-outline"
                                            size={20}
                                            color="#6b7280"
                                        />
                                    </View>
                                    <Text className="text-gray-700 font-medium text-base flex-1">
                                        {doc.name}
                                    </Text>
                                </View>
                                <View
                                    className={`px-3 py-2 rounded-2xl ${
                                        doc.status === "Validé"
                                            ? "bg-green-100"
                                            : "bg-amber-100"
                                    }`}
                                >
                                    <Text
                                        className={`text-sm font-bold ${
                                            doc.status === "Validé"
                                                ? "text-green-700"
                                                : "text-amber-700"
                                        }`}
                                    >
                                        {doc.status}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </InfoCard>

                    {/* Photos */}
                    <InfoCard title="Photos" icon="camera-outline">
                        <View className="flex-row flex-wrap">
                            {vehicle.photos.map((photo) => (
                                <TouchableOpacity
                                    key={photo.id}
                                    className="w-[30%] mr-3 mb-3"
                                >
                                    <View className="bg-gray-100 rounded-2xl h-24 items-center justify-center border border-gray-200">
                                        <Ionicons
                                            name="camera-outline"
                                            size={28}
                                            color="#9ca3af"
                                        />
                                        <Text className="text-sm text-gray-500 mt-2 font-medium">
                                            {photo.type}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </InfoCard>

                    {/* Observations */}
                    {vehicle.observation && vehicle.observation !== "Néant" && (
                        <InfoCard title="Observations" icon="eye-outline">
                            <View className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                                <Text className="text-amber-800 font-medium text-base leading-6">
                                    {vehicle.observation}
                                </Text>
                            </View>
                        </InfoCard>
                    )}

                    {/* Action Buttons */}
                    <View className="flex-row space-x-4 mb-8">
                        <TouchableOpacity
                            className="flex-1 bg-primary py-5 rounded-3xl items-center shadow-lg"
                            onPress={handleStatusUpdate}
                        >
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="create-outline"
                                    size={20}
                                    color="white"
                                    className="mr-2"
                                />
                                <Text className="text-white font-bold text-base">
                                    Mettre à jour le statut
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-gray-100 py-5 rounded-3xl items-center border border-gray-200">
                            <View className="flex-row items-center">
                                <Ionicons
                                    name="camera-outline"
                                    size={20}
                                    color="#6b7280"
                                    className="mr-2"
                                />
                                <Text className="text-gray-700 font-bold text-base">
                                    Ajouter une photo
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
