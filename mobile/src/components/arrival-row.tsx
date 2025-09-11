import { Text, View } from "react-native";

export function ArrivalRow({
    icon: Icon,
    label,
    value,
    subtle,
}: {
    icon: any;
    label: string;
    value?: string;
    subtle?: boolean;
}) {
    return (
        <View
            className={`flex-row items-center px-3 py-3 rounded-xl border ${subtle ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"} shadow-sm`}
        >
            <Icon size={18} color={subtle ? "#6B7280" : "#059669"} />
            <View className="ml-3 flex-1">
                <Text className="text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">
                    {label}
                </Text>
                <Text
                    className="text-xs font-semibold text-slate-900"
                    numberOfLines={1}
                >
                    {value || "—"}
                </Text>
            </View>
        </View>
    );
}
