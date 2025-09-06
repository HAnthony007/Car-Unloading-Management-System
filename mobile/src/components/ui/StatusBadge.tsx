import React from "react";
import { Text, View } from "react-native";

interface StatusBadgeProps {
    status: string;
    size?: "small" | "medium" | "large";
}

export function StatusBadge({ status, size = "medium" }: StatusBadgeProps) {
    const getStatusConfig = (status: string) => {
        const s = status.toLowerCase();

        switch (s) {
            case "pending":
            case "en attente":
                return {
                    bg: "#fef3c7",
                    color: "#d97706",
                    label: "EN ATTENTE",
                    icon: "⏳",
                };
            case "in_progress":
            case "en cours":
                return {
                    bg: "#dbeafe",
                    color: "#2563eb",
                    label: "EN COURS",
                    icon: "🔄",
                };
            case "completed":
            case "terminé":
                return {
                    bg: "#d1fae5",
                    color: "#059669",
                    label: "TERMINÉ",
                    icon: "✅",
                };
            case "cancelled":
            case "annulé":
                return {
                    bg: "#fee2e2",
                    color: "#dc2626",
                    label: "ANNULÉ",
                    icon: "❌",
                };
            default:
                return {
                    bg: "#f3f4f6",
                    color: "#6b7280",
                    label: status.toUpperCase(),
                    icon: "❓",
                };
        }
    };

    const config = getStatusConfig(status);

    const sizeClasses = {
        small: "px-2 py-1",
        medium: "px-3 py-1.5",
        large: "px-4 py-2",
    };

    const textSizeClasses = {
        small: "text-xs",
        medium: "text-xs",
        large: "text-sm",
    };

    return (
        <View
            className={`${sizeClasses[size]} rounded-full items-center`}
            style={{ backgroundColor: config.bg }}
        >
            <Text
                className={`${textSizeClasses[size]} font-bold`}
                style={{ color: config.color }}
            >
                {config.icon} {config.label}
            </Text>
        </View>
    );
}
