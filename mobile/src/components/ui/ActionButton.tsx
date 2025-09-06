import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ActionButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "danger" | "success";
    size?: "small" | "medium" | "large";
    icon?: keyof typeof Ionicons.glyphMap;
    disabled?: boolean;
    fullWidth?: boolean;
}

export function ActionButton({
    title,
    onPress,
    variant = "primary",
    size = "medium",
    icon,
    disabled = false,
    fullWidth = false,
}: ActionButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case "primary":
                return {
                    bg: disabled ? "#e5e7eb" : "#2563eb",
                    text: disabled ? "#9ca3af" : "#ffffff",
                    border: "transparent",
                };
            case "secondary":
                return {
                    bg: disabled ? "#f3f4f6" : "#f8fafc",
                    text: disabled ? "#9ca3af" : "#374151",
                    border: disabled ? "#e5e7eb" : "#d1d5db",
                };
            case "danger":
                return {
                    bg: disabled ? "#fecaca" : "#dc2626",
                    text: disabled ? "#9ca3af" : "#ffffff",
                    border: "transparent",
                };
            case "success":
                return {
                    bg: disabled ? "#d1fae5" : "#059669",
                    text: disabled ? "#9ca3af" : "#ffffff",
                    border: "transparent",
                };
            default:
                return {
                    bg: "#2563eb",
                    text: "#ffffff",
                    border: "transparent",
                };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case "small":
                return {
                    padding: "py-2 px-3",
                    textSize: "text-sm",
                    iconSize: 16,
                };
            case "medium":
                return {
                    padding: "py-3 px-4",
                    textSize: "text-base",
                    iconSize: 18,
                };
            case "large":
                return {
                    padding: "py-4 px-6",
                    textSize: "text-lg",
                    iconSize: 20,
                };
            default:
                return {
                    padding: "py-3 px-4",
                    textSize: "text-base",
                    iconSize: 18,
                };
        }
    };

    const variantStyles = getVariantStyles();
    const sizeStyles = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            className={`
        ${sizeStyles.padding} 
        rounded-2xl 
        items-center 
        justify-center 
        flex-row
        ${fullWidth ? "w-full" : ""}
        ${variant === "secondary" ? "border" : ""}
      `}
            style={{
                backgroundColor: variantStyles.bg,
                borderColor: variantStyles.border,
                opacity: disabled ? 0.6 : 1,
            }}
            activeOpacity={disabled ? 1 : 0.8}
        >
            {icon && (
                <Ionicons
                    name={icon}
                    size={sizeStyles.iconSize}
                    color={variantStyles.text}
                    style={{ marginRight: 8 }}
                />
            )}
            <Text
                className={`${sizeStyles.textSize} font-bold`}
                style={{ color: variantStyles.text }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
