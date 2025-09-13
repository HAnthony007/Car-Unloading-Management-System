import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";

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
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: active ? 1.05 : 1,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: active ? 1 : 0.7,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [active, scaleAnim, opacityAnim]);

    const getColors = () => {
        if (tone === "emerald") {
            return {
                bg: active ? "bg-emerald-500" : "bg-emerald-50",
                text: active ? "text-white" : "text-emerald-700",
                border: active ? "border-emerald-500" : "border-emerald-200",
                iconColor: active ? "#ffffff" : "#059669",
                shadowColor: active ? "#10b981" : "transparent",
            };
        } else if (tone === "amber") {
            return {
                bg: active ? "bg-amber-500" : "bg-amber-50",
                text: active ? "text-white" : "text-amber-700",
                border: active ? "border-amber-500" : "border-amber-200",
                iconColor: active ? "#ffffff" : "#d97706",
                shadowColor: active ? "#f59e0b" : "transparent",
            };
        } else {
            return {
                bg: active ? "bg-slate-500" : "bg-slate-50",
                text: active ? "text-white" : "text-slate-700",
                border: active ? "border-slate-500" : "border-slate-200",
                iconColor: active ? "#ffffff" : "#475569",
                shadowColor: active ? "#64748b" : "transparent",
            };
        }
    };

    const colors = getColors();

    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                className={`px-3 py-2 rounded-xl border flex-row items-center ${colors.bg} ${colors.text} ${colors.border}`}
                activeOpacity={0.8}
                style={{
                    shadowColor: colors.shadowColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: active ? 0.3 : 0,
                    shadowRadius: 4,
                    elevation: active ? 3 : 0,
                }}
            >
                <Icon size={14} color={colors.iconColor} />
                <Text className={`ml-2 text-xs font-semibold ${colors.text}`}>
                    {label}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    );
}
