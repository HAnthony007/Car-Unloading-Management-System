import { Text, View } from "react-native";

export function StatusBadge({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: "blue" | "amber" | "violet";
}) {
    const toneStyles: Record<string, { bg: string; text: string }> = {
        blue: { bg: "bg-blue-600", text: "text-blue-50" },
        amber: { bg: "bg-amber-600", text: "text-amber-50" },
        violet: { bg: "bg-violet-600", text: "text-violet-50" },
        default: { bg: "bg-emerald-600", text: "text-emerald-50" },
    };
    const t = tone ? toneStyles[tone] : toneStyles.default;
    return (
        <View
            className={`mx-1 my-1 px-3 h-8 rounded-full flex-row items-center ${t.bg}`}
        >
            <Text
                className={`text-[10px] font-semibold uppercase tracking-wide ${t.text}`}
            >
                {label}
            </Text>
            <Text className={`ml-2 text-[10px] font-medium ${t.text}`}>
                {value}
            </Text>
        </View>
    );
}
