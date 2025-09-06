import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface InfoRowProps {
    label: string;
    value: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    valueColor?: string;
    onPress?: () => void;
}

export function InfoRow({
    label,
    value,
    icon,
    iconColor = "#6b7280",
    valueColor = "#374151",
    onPress,
}: InfoRowProps) {
    const RowContent = () => (
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <View className="flex-row items-center flex-1">
                {icon && (
                    <Ionicons
                        name={icon}
                        size={16}
                        color={iconColor}
                        style={{ marginRight: 8 }}
                    />
                )}
                <Text className="text-gray-600 flex-1">{label}</Text>
            </View>
            <Text
                className="text-right font-semibold"
                style={{ color: valueColor }}
            >
                {value}
            </Text>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <RowContent />
            </TouchableOpacity>
        );
    }

    return <RowContent />;
}
