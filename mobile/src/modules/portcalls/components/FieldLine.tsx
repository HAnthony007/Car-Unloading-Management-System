import { Text, View } from "react-native";

export const FieldLine = ({
    label,
    value,
}: {
    label: string;
    value: string;
}) => (
    <View className="flex-row justify-between">
        <Text className="text-xs text-gray-500 w-32" numberOfLines={1}>
            {label}
        </Text>
        <Text
            className="flex-1 text-sm font-medium text-slate-900 text-right"
            numberOfLines={1}
        >
            {value || "—"}
        </Text>
    </View>
);
