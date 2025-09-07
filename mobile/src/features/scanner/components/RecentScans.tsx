import { CircleCheck as CheckCircle } from "lucide-react-native";
import { Text, View } from "react-native";
import { isValidVin } from "../lib/validation";
import { RecentScanItem } from "../types";

interface RecentScansProps {
    items: RecentScanItem[];
}

export function RecentScans({ items }: RecentScansProps) {
    return (
        <View className="p-4">
            <Text className="text-base font-semibold text-gray-900 mb-3">
                Derniers scans
            </Text>
            <View className="bg-white rounded-lg p-4">
                {items.map((scan) => (
                    <View
                        key={scan.id}
                        className="flex-row items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                        <View className="w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mr-3">
                            <CheckCircle color="#059669" size={20} />
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-900">
                                {scan.vehicle}
                            </Text>
                            <View className="flex-row items-center gap-2 mt-0.5">
                                <Text
                                    className={`text-[11px] tracking-widest ${isValidVin(scan.data) ? "text-emerald-600" : "text-gray-500"}`}
                                >
                                    {scan.data}
                                </Text>
                                <Text className="text-[11px] text-gray-400">
                                    • {scan.time} - {scan.type}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
