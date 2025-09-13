import { Clock3, Compass, MapPin, Navigation } from "lucide-react-native";
import { Text, View } from "react-native";
import { MovementRecord } from "../../scanner/stores/scanner-store";

interface Props {
    currentLocation?: string;
    lastMovement?: MovementRecord;
    coords?: { lat: number; lng: number } | null;
}

export const LocationCard = ({
    currentLocation,
    lastMovement,
    coords,
}: Props) => {
    // Déterminer l'emplacement actuel basé sur le dernier mouvement ou une valeur par défaut
    const actualLocation =
        currentLocation || lastMovement?.to || "Emplacement inconnu";

    return (
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200 mb-4">
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mr-4">
                    <MapPin size={24} color="#3b82f6" />
                </View>
                <View className="flex-1">
                    <Text className="text-slate-900 text-lg font-bold">
                        Emplacement Actuel
                    </Text>
                    <Text className="text-slate-600 text-sm">
                        Position du véhicule
                    </Text>
                </View>
            </View>

            {/* Location Info */}
            <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                        <Navigation size={16} color="#10b981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-600 text-xs font-medium mb-1">
                            Zone actuelle
                        </Text>
                        <Text className="text-slate-900 text-base font-semibold">
                            {actualLocation}
                        </Text>
                    </View>
                </View>

                {/* Coordinates */}
                {coords && (
                    <View className="flex-row items-center">
                        <Compass size={14} color="#64748b" />
                        <Text className="ml-2 text-xs text-slate-500">
                            {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Last Movement Info */}
            {lastMovement && (
                <View className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                    <View className="flex-row items-center mb-2">
                        <Clock3 size={14} color="#f59e0b" />
                        <Text className="ml-2 text-amber-700 text-xs font-medium">
                            Dernier mouvement
                        </Text>
                    </View>
                    <Text className="text-amber-900 text-sm font-semibold mb-1">
                        {lastMovement.title ||
                            `${lastMovement.from} → ${lastMovement.to}`}
                    </Text>
                    <Text className="text-amber-700 text-xs">
                        {new Date(lastMovement.at).toLocaleString("fr-FR")}
                    </Text>
                </View>
            )}

            {/* Future Map Placeholder */}
            <View className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3">
                        <MapPin size={16} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-blue-900 text-sm font-semibold">
                            Carte interactive
                        </Text>
                        <Text className="text-blue-700 text-xs">
                            Visualisation de l'emplacement (à venir)
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
