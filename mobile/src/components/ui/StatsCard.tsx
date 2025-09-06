import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: keyof typeof Ionicons.glyphMap;
    iconColor?: string;
    bgColor?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    subtitle?: string;
}

export function StatsCard({
    title,
    value,
    icon,
    iconColor = "#6b7280",
    bgColor = "#f3f4f6",
    trend,
    trendValue,
    subtitle,
}: StatsCardProps) {
    const getTrendIcon = () => {
        switch (trend) {
            case "up":
                return "trending-up";
            case "down":
                return "trending-down";
            default:
                return "remove";
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case "up":
                return "#059669";
            case "down":
                return "#dc2626";
            default:
                return "#6b7280";
        }
    };

    return (
        <View
            className="rounded-xl p-4 flex-1"
            style={{ backgroundColor: bgColor }}
        >
            <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                    <Ionicons name={icon} size={20} color={iconColor} />
                    <Text className="ml-2 text-gray-600 text-sm font-medium">
                        {title}
                    </Text>
                </View>
                {trend && trendValue && (
                    <View className="flex-row items-center">
                        <Ionicons
                            name={getTrendIcon()}
                            size={14}
                            color={getTrendColor()}
                        />
                        <Text
                            className="ml-1 text-xs font-semibold"
                            style={{ color: getTrendColor() }}
                        >
                            {trendValue}
                        </Text>
                    </View>
                )}
            </View>

            <Text className="text-2xl font-bold text-gray-800 mb-1">
                {value}
            </Text>

            {subtitle && (
                <Text className="text-xs text-gray-500">{subtitle}</Text>
            )}
        </View>
    );
}
