import { Text, View } from "react-native";

export function Field({
    label,
    value,
    monospace,
    multiline,
}: {
    label: string;
    value?: string;
    monospace?: boolean;
    multiline?: boolean;
}) {
    return (
        <View>
            <Text className="text-[11px] font-medium text-gray-500 mb-0.5">
                {label}
            </Text>
            <Text
                className={`text-xs text-slate-900 ${monospace ? "tracking-widest" : ""}`}
                style={monospace ? { fontFamily: "monospace" } : undefined}
                numberOfLines={multiline ? undefined : 1}
            >
                {value || "—"}
            </Text>
        </View>
    );
}
