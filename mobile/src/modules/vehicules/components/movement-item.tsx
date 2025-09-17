import {
    Calendar,
    Clock3,
    Compass,
    FileText,
    MapPin,
    MoveRight,
    Navigation,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { MovementRecord } from "../../scanner/stores/scanner-store";
import { formatRelative } from "../lib/format-relative";

interface Props {
    item: MovementRecord;
    index: number;
    total: number;
}

export const MovementItem = ({ item, index, total }: Props) => (
    <View className="flex-row">
        <View className="items-center mr-4">
            <View className="w-4 h-4 rounded-full bg-emerald-500 mt-2 shadow-sm" />
            {index < total - 1 && (
                <View className="w-px flex-1 bg-slate-300 mt-2" />
            )}
        </View>
        <TouchableOpacity
            activeOpacity={0.7}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-sm"
        >
            {/* Header with title and time */}
            <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1 mr-3">
                    <Text
                        className="text-base font-bold text-slate-900 mb-1"
                        numberOfLines={1}
                    >
                        {item.title || `${item.from} → ${item.to}`}
                    </Text>
                    <View className="flex-row items-center">
                        <Clock3 size={14} color="#64748b" />
                        <Text className="ml-2 text-xs text-slate-500">
                            {formatRelative(item.at)}
                        </Text>
                    </View>
                </View>
                <View className="bg-emerald-100 px-2 py-1 rounded-lg">
                    <Text className="text-emerald-700 text-xs font-semibold">
                        #{index + 1}
                    </Text>
                </View>
            </View>

            {/* Route information */}
            <View className="bg-white rounded-xl p-3 mb-3 border border-slate-200">
                <View className="flex-row items-center mb-2">
                    <View className="w-6 h-6 bg-blue-100 rounded-lg items-center justify-center mr-3">
                        <MapPin size={14} color="#3b82f6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-600 text-xs font-medium mb-1">
                            Départ
                        </Text>
                        <Text
                            className="text-sm font-semibold text-slate-900"
                            numberOfLines={1}
                        >
                            {item.from}
                        </Text>
                        {item.parkingNumberFrom && (
                            <Text className="text-[11px] text-slate-500 mt-1">
                                Place: {item.parkingNumberFrom}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="flex-row items-center justify-center my-2">
                    <MoveRight size={20} color="#10b981" />
                </View>

                <View className="flex-row items-center">
                    <View className="w-6 h-6 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                        <Navigation size={14} color="#10b981" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-600 text-xs font-medium mb-1">
                            Arrivée
                        </Text>
                        <Text
                            className="text-sm font-semibold text-slate-900"
                            numberOfLines={1}
                        >
                            {item.to}
                        </Text>
                        {item.parkingNumberTo && (
                            <Text className="text-[11px] text-slate-500 mt-1">
                                Place: {item.parkingNumberTo}
                            </Text>
                        )}
                    </View>
                </View>
            </View>

            {/* Additional information */}
            <View className="space-y-2">
                {/* Coordinates */}
                {item.coordsFrom && item.coordsTo && (
                    <View className="flex-row items-center">
                        <Compass size={14} color="#64748b" />
                        <Text
                            className="ml-2 text-xs text-slate-500 flex-1"
                            numberOfLines={1}
                        >
                            {item.coordsFrom.lat.toFixed(4)},{" "}
                            {item.coordsFrom.lng.toFixed(4)} →{" "}
                            {item.coordsTo.lat.toFixed(4)},{" "}
                            {item.coordsTo.lng.toFixed(4)}
                        </Text>
                    </View>
                )}

                {/* Parking numbers (Mahasarika) */}
                {(item.parkingNumberFrom || item.parkingNumberTo) && (
                    <View className="flex-row items-center">
                        <MapPin size={14} color="#f59e0b" />
                        <Text className="ml-2 text-xs text-slate-600">
                            N° parking:{" "}
                            {item.parkingNumberFrom || item.parkingNumberTo}
                        </Text>
                    </View>
                )}

                {/* Description/Reason */}
                {(item.description || item.reason) && (
                    <View className="flex-row items-start">
                        <FileText
                            size={14}
                            color="#64748b"
                            style={{ marginTop: 2 }}
                        />
                        <Text
                            className="ml-2 text-xs text-slate-600 flex-1"
                            numberOfLines={2}
                        >
                            {item.description || item.reason}
                        </Text>
                    </View>
                )}

                {/* Full date */}
                <View className="flex-row items-center">
                    <Calendar size={14} color="#64748b" />
                    <Text className="ml-2 text-xs text-slate-500">
                        {new Date(item.at).toLocaleString("fr-FR")}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    </View>
);
