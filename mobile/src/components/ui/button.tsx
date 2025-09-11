import { cn } from "@/src/lib/utils";
import React, { forwardRef } from "react";
import {
    ActivityIndicator,
    Pressable,
    PressableProps,
    Text,
    View,
} from "react-native";

// New extended variants & sizes while keeping existing ones backward compatible.
export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<PressableProps, "onPress"> {
    title: string; // text displayed when no children provided
    onPress?: () => void;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    loading?: boolean; // alias kept
    isLoading?: boolean; // preferred new naming
    loadingText?: string; // optional text during loading
    spinnerColor?: string; // custom activity indicator color
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    textClassName?: string;
    fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, { container: string; text: string }> = {
    sm: { container: "px-3 py-2 rounded-lg", text: "text-sm" },
    md: { container: "px-4 py-3 rounded-xl", text: "text-base" },
    lg: { container: "px-5 py-4 rounded-2xl", text: "text-lg" },
};

const variantStyles: Record<
    ButtonVariant,
    { base: string; text: string; spinner?: string }
> = {
    primary: {
        base: "bg-primary active:opacity-90 disabled:opacity-60",
        text: "text-white font-semibold",
        spinner: "#ffffff",
    },
    secondary: {
        base: "bg-gray-100 dark:bg-neutral-800 active:opacity-90 disabled:opacity-60",
        text: "text-gray-900 dark:text-gray-100 font-semibold",
        spinner: "#111827",
    },
    outline: {
        base: "border border-gray-300 dark:border-neutral-700 bg-transparent active:bg-gray-50 dark:active:bg-neutral-800 disabled:opacity-60",
        text: "text-gray-900 dark:text-gray-100 font-semibold",
        spinner: "#111827",
    },
    ghost: {
        base: "bg-transparent active:bg-gray-100/60 dark:active:bg-neutral-800 disabled:opacity-50",
        text: "text-gray-900 dark:text-gray-100 font-semibold",
        spinner: "#111827",
    },
    destructive: {
        base: "bg-red-600 active:bg-red-700 disabled:opacity-60",
        text: "text-white font-semibold",
        spinner: "#ffffff",
    },
};

// Forward ref for easier integration with animations / focus handling
export const Button = forwardRef<
    React.ElementRef<typeof Pressable>,
    ButtonProps
>(
    (
        {
            title,
            onPress,
            disabled,
            leftIcon,
            rightIcon,
            loading,
            isLoading,
            loadingText,
            spinnerColor,
            variant = "primary",
            size = "md",
            className,
            textClassName,
            fullWidth = true,
            accessibilityLabel,
            ...rest
        },
        ref
    ) => {
        const v = variantStyles[variant];
        const s = sizeStyles[size];
        const showLoading = isLoading ?? loading; // keep backward compatibility
        const indicatorColor = spinnerColor || v.spinner || "#000";

        const baseLayout = "flex-row items-center justify-center";
        const widthCls = fullWidth ? "w-full" : "";

        return (
            <Pressable
                ref={ref}
                onPress={onPress}
                disabled={disabled || showLoading}
                className={cn(
                    baseLayout,
                    s.container,
                    v.base,
                    widthCls,
                    className
                )}
                accessibilityRole="button"
                accessibilityLabel={accessibilityLabel || title}
                {...rest}
            >
                <View className="flex-row items-center">
                    {showLoading ? (
                        <ActivityIndicator
                            color={indicatorColor}
                            className="mr-2"
                        />
                    ) : leftIcon ? (
                        <View className="mr-2">{leftIcon}</View>
                    ) : null}
                    <Text
                        className={cn(v.text, s.text, textClassName)}
                        // Provide minimal accessibility for dynamic text changes
                        accessibilityLiveRegion={
                            showLoading ? "polite" : undefined
                        }
                    >
                        {showLoading && loadingText ? loadingText : title}
                    </Text>
                    {rightIcon && !showLoading ? (
                        <View className="ml-2">{rightIcon}</View>
                    ) : null}
                </View>
            </Pressable>
        );
    }
);

Button.displayName = "Button";

export default Button;
