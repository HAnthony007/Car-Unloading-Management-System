import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eye } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import {
    formatDate,
    getPortCallStatusColor,
    getPortCallStatusText,
} from "../lib/format";
import { PortCall } from "../types";

interface Props {
    item: PortCall;
    onPressDetails: (pc: PortCall) => void;
}

export const PortCallRow = ({ item, onPressDetails }: Props) => {
    return (
        <Card className="mb-3">
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPressDetails(item)}
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
                        onPress={() => onPressDetails(item)}
                    />
                </View>
            </TouchableOpacity>
        </Card>
    );
};
