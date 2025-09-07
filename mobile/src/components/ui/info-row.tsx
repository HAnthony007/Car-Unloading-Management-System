import { Text, View } from "react-native";

// InfoRow styled like vehicles.tsx detail cards
export function InfoRow({
    label,
    value,
    monospace,
    highlight,
}: {
    label: string;
    value?: string;
    monospace?: boolean;
    highlight?: boolean;
}) {
    return (
        <View
            className={`py-2 ${highlight ? "bg-emerald-50 rounded-lg px-3 border border-emerald-100 mb-1" : "px-1"}`}
        >
            <Text className="text-[11px] font-medium text-gray-500 mb-0.5">
                {label}
            </Text>
            <Text
                className={`text-sm font-medium text-slate-900 ${monospace ? "tracking-widest" : ""}`}
                style={monospace ? { fontFamily: "monospace" } : undefined}
                numberOfLines={1}
            >
                {value || "—"}
            </Text>
        </View>
    );
}
