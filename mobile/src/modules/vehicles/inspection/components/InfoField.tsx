import { Text, View } from "react-native";

export function InfoField({
    label,
    value,
    mono,
}: {
    label: string;
    value?: string;
    mono?: boolean;
}) {
    return (
        <View>
            <Text className="text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">
                {label}
            </Text>
            <Text
                className={`text-xs font-semibold text-slate-900 ${mono ? "tracking-widest" : ""}`}
                style={mono ? { fontFamily: "monospace" } : undefined}
                numberOfLines={1}
            >
                {value || "—"}
            </Text>
        </View>
    );
}

export function HalfField({ label, value }: { label: string; value?: string }) {
    return (
        <View className="w-1/2 px-1 mb-2">
            <InfoField label={label} value={value} />
        </View>
    );
}
