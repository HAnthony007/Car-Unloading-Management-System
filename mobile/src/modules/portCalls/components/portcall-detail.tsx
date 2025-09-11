import { Badge } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { X } from "lucide-react-native";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    formatDate,
    getPortCallStatusColor,
    getPortCallStatusText,
} from "../lib/format";
import { PortCall } from "../types";
import { FieldLine } from "./field-line";

interface Props {
    visible: boolean;
    onClose: () => void;
    portCall: PortCall | null;
}

export const PortCallDetailsModal = ({ visible, onClose, portCall }: Props) => (
    <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
    >
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900">
                    Détails Port Call
                </Text>
                <TouchableOpacity className="p-1" onPress={onClose}>
                    <X color="#6B7280" size={24} />
                </TouchableOpacity>
            </View>
            {portCall && (
                <ScrollView
                    className="flex-1 p-4"
                    showsVerticalScrollIndicator={false}
                >
                    <Card style={{ marginBottom: 16 }}>
                        <Text className="text-base font-semibold text-slate-900 mb-3">
                            Informations générales
                        </Text>
                        <View className="mb-3 flex-row justify-between items-center">
                            <Text
                                className="text-sm font-medium text-slate-900"
                                numberOfLines={1}
                            >
                                {portCall.vessel.vessel_name}
                            </Text>
                            <Badge
                                label={getPortCallStatusText(portCall.status)}
                                variant={getPortCallStatusColor(
                                    portCall.status
                                )}
                                size="small"
                            />
                        </View>
                        <View className="space-y-2">
                            <FieldLine
                                label="Agent"
                                value={portCall.vessel_agent}
                            />
                            <FieldLine
                                label="Port d'origine"
                                value={portCall.origin_port}
                            />
                            <FieldLine
                                label="IMO"
                                value={portCall.vessel.imo_no}
                            />
                            <FieldLine
                                label="Pavillon"
                                value={portCall.vessel.flag}
                            />
                            <FieldLine
                                label="Véhicules"
                                value={String(portCall.vehicles_number)}
                            />
                        </View>
                    </Card>
                    <Card style={{ marginBottom: 16 }}>
                        <Text className="text-base font-semibold text-slate-900 mb-3">
                            Dates
                        </Text>
                        <View className="space-y-2">
                            <FieldLine
                                label="ETA"
                                value={formatDate(portCall.estimated_arrival)}
                            />
                            <FieldLine
                                label="Arrivée"
                                value={formatDate(portCall.arrival_date)}
                            />
                            <FieldLine
                                label="ETD"
                                value={formatDate(portCall.estimated_departure)}
                            />
                            <FieldLine
                                label="Départ"
                                value={formatDate(portCall.departure_date)}
                            />
                        </View>
                    </Card>
                    {portCall.vehicles && (
                        <Card style={{ marginBottom: 32 }}>
                            <Text className="text-base font-semibold text-slate-900 mb-3">
                                Véhicules ({portCall.vehicles.length})
                            </Text>
                            {portCall.vehicles.map((v, idx) => {
                                const isLast =
                                    idx === portCall.vehicles!.length - 1;
                                return (
                                    <View
                                        key={v.vehicle_id}
                                        className={`mb-3 ${isLast ? "mb-0" : ""}`}
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
                                                    Obs: {v.vehicle_observation}
                                                </Text>
                                            )}
                                        <View className="h-px bg-gray-100 mt-3" />
                                    </View>
                                );
                            })}
                        </Card>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    </Modal>
);
