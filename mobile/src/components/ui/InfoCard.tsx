import React from "react";
import { Text, View } from "react-native";

interface InfoCardProps {
    title: string;
    children: React.ReactNode;
    icon?: string;
    iconColor?: string;
    className?: string;
}

export function InfoCard({
    title,
    children,
    icon,
    iconColor = "#2563eb",
    className = "",
}: InfoCardProps) {
    return (
        <View
            className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${className}`}
        >
            <View className="flex-row items-center mb-3">
                {icon && (
                    <View
                        className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                        style={{ backgroundColor: `${iconColor}20` }}
                    >
                        <Text className="text-lg">{icon}</Text>
                    </View>
                )}
                <Text className="text-lg font-bold text-gray-800 flex-1">
                    {title}
                </Text>
            </View>
            {children}
        </View>
    );
}
