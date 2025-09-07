import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { X } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    getCustomsStatusColor,
    getCustomsStatusText,
    getStatusColor,
    getStatusText,
} from "../lib/format";
import { Vehicle } from "../types";

interface Props {
    visible: boolean;
    vehicle: Vehicle | null;
    onClose: () => void;
}

export const VehicleDetailsModal = ({ visible, vehicle, onClose }: Props) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView className="flex-1 bg-slate-50">
                <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                    <Text className="text-lg font-semibold text-slate-900">
                        Détails du véhicule
                    </Text>
                    <TouchableOpacity className="p-1" onPress={onClose}>
                        <X color="#6B7280" size={24} />
                    </TouchableOpacity>
                </View>
                {vehicle && (
                    <ScrollView className="flex-1 p-4">
                        {vehicle.images && vehicle.images.length > 0 && (
                            <ScrollView horizontal className="mb-4">
                                {vehicle.images.map((image, index) => (
                                    <View
                                        key={index}
                                        className="w-48 h-36 bg-gray-100 rounded-lg mr-3 items-center justify-center"
                                    >
                                        <Text>Image placeholder</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        )}
                        <Card style={{ marginBottom: 16 }}>
                            <Text className="text-base font-semibold text-slate-900 mb-3">
                                Informations générales
                            </Text>
                            <View className="space-y-3">
                                <InfoLine
                                    label="Marque"
                                    value={vehicle.brand}
                                />
                                <InfoLine
                                    label="Modèle"
                                    value={vehicle.model}
                                />
                                <InfoLine
                                    label="Numéro de châssis"
                                    value={vehicle.chassisNumber}
                                />
                                <InfoLine
                                    label="Couleur"
                                    value={vehicle.color}
                                />
                            </View>
                        </Card>
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
                                        label={getStatusText(vehicle.status)}
                                        variant={getStatusColor(vehicle.status)}
                                    />
                                </View>
                                <InfoLine label="Zone" value={vehicle.zone} />
                                <View className="mb-2">
                                    <Text className="text-xs font-normal text-gray-500 mb-1">
                                        Douane
                                    </Text>
                                    <Badge
                                        label={getCustomsStatusText(
                                            vehicle.customsStatus || "pending"
                                        )}
                                        variant={getCustomsStatusColor(
                                            vehicle.customsStatus || "pending"
                                        )}
                                    />
                                </View>
                            </View>
                        </Card>
                        {vehicle.notes && (
                            <Card style={{ marginBottom: 16 }}>
                                <Text className="text-base font-semibold text-slate-900 mb-3">
                                    Notes
                                </Text>
                                <Text className="text-sm font-normal text-gray-700 leading-5">
                                    {vehicle.notes}
                                </Text>
                            </Card>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </Modal>
    );
};

const InfoLine = ({ label, value }: { label: string; value?: string }) => (
    <View className="mb-2">
        <Text className="text-xs font-normal text-gray-500 mb-1">{label}</Text>
        <Text className="text-sm font-medium text-slate-900">{value}</Text>
    </View>
);
