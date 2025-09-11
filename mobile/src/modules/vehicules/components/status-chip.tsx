import { Text, TouchableOpacity } from "react-native";

interface Props {
    active: boolean;
    label: string;
    onPress: () => void;
    tone: "emerald" | "amber" | "slate";
    icon: React.ComponentType<{ size?: number; color?: string }>;
}

export function StatusChip({
    active,
    label,
    onPress,
    tone,
    icon: Icon,
}: Props) {
    const map: Record<string, { bg: string; text: string; border: string }> = {
        emerald: {
            bg: active ? "bg-emerald-600" : "bg-emerald-50",
            text: active ? "text-white" : "text-emerald-700",
            border: active ? "border-emerald-600" : "border-emerald-200",
        },
        amber: {
            bg: active ? "bg-amber-600" : "bg-amber-50",
            text: active ? "text-white" : "text-amber-700",
            border: active ? "border-amber-600" : "border-amber-200",
        },
        slate: {
            bg: active ? "bg-slate-600" : "bg-slate-100",
            text: active ? "text-white" : "text-slate-700",
            border: active ? "border-slate-600" : "border-slate-300",
        },
    };
    const t = map[tone];
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`ml-1 px-2 h-7 rounded-full border flex-row items-center ${t.bg} ${t.border}`}
            activeOpacity={0.85}
        >
            <Icon size={12} color={active ? "#fff" : undefined} />
            <Text className={`ml-1 text-[10px] font-semibold ${t.text}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}
