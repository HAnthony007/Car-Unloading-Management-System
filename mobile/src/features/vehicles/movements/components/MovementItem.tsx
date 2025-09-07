import { MovementRecord } from "@/lib/store";
import {
    Clock3,
    Compass,
    FileText,
    MapPin,
    MoveRight,
} from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { formatRelative } from "../lib/format";

interface Props {
    item: MovementRecord;
    index: number;
    total: number;
}

export const MovementItem = ({ item, index, total }: Props) => (
    <View className="flex-row">
        <View className="items-center mr-3">
            <View className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
            {index < total - 1 && (
                <View className="w-px flex-1 bg-gray-300 mt-1" />
            )}
        </View>
        <TouchableOpacity
            activeOpacity={0.85}
            className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
        >
            <Text
                className="text-sm font-semibold text-slate-900 mb-1"
                numberOfLines={1}
            >
                {item.title || `${item.from} → ${item.to}`}
            </Text>
            <View className="flex-row items-center mb-2">
                <MapPin size={14} color="#059669" />
                <Text
                    className="ml-1 text-[11px] font-medium text-slate-700"
                    numberOfLines={1}
                >
                    {item.from}
                </Text>
                <MoveRight
                    size={16}
                    color="#059669"
                    style={{ marginHorizontal: 6 }}
                />
                <MapPin size={14} color="#059669" />
                <Text
                    className="ml-1 text-[11px] font-medium text-slate-700"
                    numberOfLines={1}
                >
                    {item.to}
                </Text>
            </View>
            <View className="flex-row items-center mb-2">
                <Clock3 size={14} color="#6B7280" />
                <Text className="ml-1 text-[10px] text-gray-500">
                    {new Date(item.at).toLocaleString("fr-FR")} •{" "}
                    {formatRelative(item.at)}
                </Text>
            </View>
            <View className="flex-row items-center mb-2">
                <Compass size={14} color="#6B7280" />
                <Text
                    className="ml-1 text-[10px] text-gray-500"
                    numberOfLines={1}
                >
                    {item.coordsFrom && item.coordsTo
                        ? `${item.coordsFrom.lat.toFixed(5)}, ${item.coordsFrom.lng.toFixed(5)} → ${item.coordsTo.lat.toFixed(5)}, ${item.coordsTo.lng.toFixed(5)}`
                        : "Coordonnées: —"}
                </Text>
            </View>
            {(item.description || item.reason) && (
                <View className="flex-row items-start">
                    <FileText
                        size={14}
                        color="#6B7280"
                        style={{ marginTop: 2 }}
                    />
                    <Text
                        className="ml-1 text-[11px] text-gray-600 flex-1"
                        numberOfLines={3}
                    >
                        {item.description || item.reason}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    </View>
);
