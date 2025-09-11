import { AlertCircle, Check, Info } from "lucide-react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";
import Animated, {
    Easing,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export type InputVariant =
    | "default"
    | "outline"
    | "filled"
    | "unstyled"
    | "floating";
export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends TextInputProps {
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: string; // preferred
    errorText?: string; // backward compat alias
    helperText?: string;
    containerClassName?: string;
    inputClassName?: string;
    variant?: InputVariant;
    size?: InputSize;
    multiline?: boolean; // keep explicit for clarity
    showPasswordToggle?: boolean; // display toggle when secureTextEntry true
    passwordToggleLabels?: { show: string; hide: string };
    showCounter?: boolean; // show char counter when maxLength provided
    counterClassName?: string;
    // Advanced floating label / state props
    floatMode?: "auto" | "always" | "never";
    required?: boolean;
    status?: "default" | "error" | "success" | "warning";
    statusIconMode?: "auto" | "none" | "always";
    animateError?: boolean;
    beforeLabel?: React.ReactNode;
    afterLabel?: React.ReactNode;
    readOnly?: boolean; // visually distinct from disabled
    autoFilled?: boolean; // trigger pulse animation
    successIcon?: React.ReactNode;
    errorIcon?: React.ReactNode;
    warningIcon?: React.ReactNode;
}

const sizeClasses: Record<InputSize, { wrapper: string; input: string }> = {
    sm: { wrapper: "px-2.5 py-2 rounded-lg", input: "text-sm" },
    md: { wrapper: "px-3 py-2.5 rounded-xl", input: "text-base" },
    lg: { wrapper: "px-4 py-3 rounded-2xl", input: "text-lg" },
};

const variantClasses: Record<
    InputVariant,
    {
        base: string;
        focus: string;
        error: string;
        floatingExtra?: string;
        labelBg?: string;
    }
> = {
    default: {
        base: "border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900",
        focus: "focus:border-primary focus:ring-2 focus:ring-primary/40",
        error: "border-red-500 dark:border-red-600 bg-red-50/20",
    },
    outline: {
        base: "border border-gray-300 dark:border-gray-600 bg-transparent",
        focus: "focus:border-primary focus:ring-2 focus:ring-primary/40",
        error: "border-red-500 dark:border-red-600",
    },
    filled: {
        base: "border border-transparent bg-gray-100 dark:bg-neutral-800",
        focus: "focus:border-primary/60 focus:ring-2 focus:ring-primary/30",
        error: "border-red-500 dark:border-red-600 bg-red-50/30",
    },
    unstyled: {
        base: "border-0 bg-transparent",
        focus: "focus:ring-0",
        error: "border-0",
    },
    floating: {
        base: "border border-gray-300 dark:border-gray-600 bg-transparent",
        focus: "focus:border-primary focus:ring-2 focus:ring-primary/40",
        error: "border-red-500 dark:border-red-600",
        floatingExtra: "pt-4 pb-1",
        labelBg: "bg-white dark:bg-neutral-900",
    },
};

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            label,
            leftIcon,
            rightIcon,
            error,
            errorText,
            helperText,
            containerClassName,
            inputClassName,
            variant = "default",
            size = "md",
            multiline,
            editable = true,
            showPasswordToggle,
            passwordToggleLabels = { show: "Afficher", hide: "Masquer" },
            showCounter = true,
            counterClassName,
            secureTextEntry,
            maxLength,
            value,
            onChangeText,
            floatMode = "auto",
            required = false,
            status = "default",
            statusIconMode = "auto",
            animateError = true,
            beforeLabel,
            afterLabel,
            readOnly = false,
            autoFilled = false,
            successIcon,
            errorIcon,
            warningIcon,
            ...props
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [internalValue, setInternalValue] = useState<string>(
            value?.toString() ?? ""
        );
        const [showPassword, setShowPassword] = useState(false);
        const finalError = error || errorText;
        const v = variantClasses[variant];
        const s = sizeClasses[size];
        const currentValue = (value?.toString() ?? internalValue) as string;
        const hasValue = currentValue.length > 0;

        // Shared values for animations
        const focusSV = useSharedValue(0);
        const shakeSV = useSharedValue(0);
        const pulseSV = useSharedValue(0);
        const labelColorSV = useSharedValue(0); // 0 default, 1 focus, 2 error, 3 success, 4 warning

        // Determine target label color state key
        const labelStateKey = finalError
            ? 2
            : status === "success"
              ? 3
              : status === "warning"
                ? 4
                : isFocused
                  ? 1
                  : 0;

        useEffect(() => {
            labelColorSV.value = withTiming(labelStateKey, { duration: 180 });
        }, [labelStateKey, labelColorSV]);

        useEffect(() => {
            const active = isFocused || hasValue || floatMode === "always";
            focusSV.value = withTiming(active ? 1 : 0, {
                duration: 180,
                easing: Easing.out(Easing.quad),
            });
        }, [isFocused, hasValue, floatMode, focusSV]);

        // Shake on error introduction
        const prevErrorRef = useRef<string | undefined>(undefined);
        useEffect(() => {
            if (
                animateError &&
                finalError &&
                finalError !== prevErrorRef.current
            ) {
                shakeSV.value = 0;
                shakeSV.value = withSequence(
                    withTiming(1, { duration: 40 }),
                    withTiming(-1, { duration: 40 }),
                    withTiming(0.8, { duration: 40 }),
                    withTiming(-0.8, { duration: 40 }),
                    withTiming(0, { duration: 60 })
                );
            }
            prevErrorRef.current = finalError;
        }, [finalError, animateError, shakeSV]);

        // Pulse if autoFilled flag toggles true
        useEffect(() => {
            if (autoFilled) {
                pulseSV.value = 0;
                pulseSV.value = withSequence(
                    withTiming(1, { duration: 220 }),
                    withTiming(0, { duration: 220 })
                );
            }
        }, [autoFilled, pulseSV]);

        const wrapperBase = "flex-row items-center";
        const stateClasses = [v.base];
        if (finalError) stateClasses.push(v.error);
        if (isFocused && !finalError)
            stateClasses.push("ring-2 ring-primary/40 border-primary");
        if (readOnly) stateClasses.push("border-dashed");
        const disabledCls = !editable ? "opacity-60" : "";

        // Animated container style (shake + pulse)
        const containerAnimatedStyle = useAnimatedStyle(() => {
            const translateX = shakeSV.value * 4; // multiply value range [-1,1]
            const scale =
                pulseSV.value > 0
                    ? 1 + interpolate(pulseSV.value, [0, 1], [0, 0.04])
                    : 1;
            return { transform: [{ translateX }, { scale }] };
        });

        // Animated floating label
        const floatingLabelStyle = useAnimatedStyle(() => {
            const active = focusSV.value;
            const translateY = interpolate(active, [0, 1], [0, -22]);
            const scale = interpolate(active, [0, 1], [1, 0.82]);
            const color = interpolateColor(
                labelColorSV.value,
                [0, 1, 2, 3, 4],
                [
                    "#9CA3AF", // default neutral
                    "#2563EB", // focus (primary blue)
                    "#DC2626", // error red
                    "#059669", // success green
                    "#D97706", // warning amber
                ]
            );
            return {
                transform: [{ translateY }, { scale }],
                color,
            };
        });

        // Decide if status icon visible
        const showStatusIcon = (() => {
            if (statusIconMode === "none") return false;
            if (statusIconMode === "always") return true;
            return (
                finalError != null ||
                status === "success" ||
                status === "warning"
            );
        })();

        const renderStatusIcon = () => {
            if (!showStatusIcon) return null;
            if (finalError)
                return errorIcon || <AlertCircle size={16} color="#DC2626" />;
            if (status === "success")
                return successIcon || <Check size={16} color="#059669" />;
            if (status === "warning")
                return warningIcon || <Info size={16} color="#D97706" />;
            return null;
        };

        return (
            <Animated.View
                className={containerClassName}
                style={containerAnimatedStyle}
            >
                {label && variant !== "floating" ? (
                    <View className="mb-1 flex-row items-center gap-1">
                        {beforeLabel ? <View>{beforeLabel}</View> : null}
                        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {label}
                            {required ? (
                                <Text className="text-red-500"> *</Text>
                            ) : null}
                        </Text>
                        {afterLabel ? <View>{afterLabel}</View> : null}
                        {readOnly ? (
                            <Text className="ml-1 text-[10px] uppercase text-gray-400">
                                READONLY
                            </Text>
                        ) : null}
                    </View>
                ) : null}
                <View
                    className={[
                        "transition-colors",
                        wrapperBase,
                        s.wrapper,
                        v.floatingExtra || "",
                        variant === "floating" ? "relative" : "",
                        ...stateClasses,
                        disabledCls,
                        readOnly ? "opacity-80" : "",
                    ].join(" ")}
                >
                    {variant === "floating" && label ? (
                        <Animated.Text
                            pointerEvents="none"
                            style={floatingLabelStyle as any}
                            className={[
                                "absolute left-3",
                                v.labelBg || "",
                                "px-1",
                                required
                                    ? 'after:content-["*"] after:text-red-500'
                                    : "",
                            ].join(" ")}
                        >
                            {label}
                            {required ? " *" : ""}
                        </Animated.Text>
                    ) : null}
                    {leftIcon ? <View className="mr-2">{leftIcon}</View> : null}
                    <TextInput
                        ref={ref}
                        multiline={multiline}
                        placeholderTextColor="#9CA3AF"
                        editable={editable && !readOnly}
                        onFocus={(e) => {
                            setIsFocused(true);
                            props.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            props.onBlur?.(e);
                        }}
                        onChangeText={(text) => {
                            if (value === undefined) setInternalValue(text);
                            onChangeText?.(text);
                        }}
                        className={[
                            "flex-1 text-gray-900 dark:text-gray-100",
                            s.input,
                            multiline ? "text-left" : "",
                            inputClassName || "",
                        ].join(" ")}
                        style={
                            multiline
                                ? {
                                      textAlignVertical: "top",
                                      minHeight:
                                          s === sizeClasses.lg ? 110 : 80,
                                  }
                                : undefined
                        }
                        value={value as any}
                        secureTextEntry={secureTextEntry && !showPassword}
                        maxLength={maxLength}
                        // Hide placeholder for floating until focus or value
                        placeholder={
                            variant === "floating" && !isFocused && !hasValue
                                ? undefined
                                : props.placeholder
                        }
                        {...props}
                    />
                    {showPasswordToggle && secureTextEntry ? (
                        <Pressable
                            onPress={() => setShowPassword((p) => !p)}
                            className="ml-2 px-1"
                            accessibilityRole="button"
                            accessibilityLabel={
                                showPassword
                                    ? passwordToggleLabels.hide
                                    : passwordToggleLabels.show
                            }
                        >
                            <Text className="text-xs font-medium text-primary">
                                {showPassword
                                    ? passwordToggleLabels.hide
                                    : passwordToggleLabels.show}
                            </Text>
                        </Pressable>
                    ) : null}
                    {rightIcon ? (
                        <View className="ml-2">{rightIcon}</View>
                    ) : null}
                    {renderStatusIcon() ? (
                        <View className="ml-2">{renderStatusIcon()}</View>
                    ) : null}
                </View>
                {finalError ||
                helperText ||
                (showCounter && (maxLength || currentValue.length > 0)) ? (
                    <View className="mt-1 flex-row items-start justify-between">
                        <View className="flex-1 pr-2">
                            {finalError ? (
                                <Text className="text-xs text-red-600">
                                    {finalError}
                                </Text>
                            ) : helperText ? (
                                <Text className="text-xs text-gray-500 dark:text-gray-400">
                                    {helperText}
                                </Text>
                            ) : null}
                        </View>
                        {showCounter &&
                        (maxLength || currentValue.length > 0) ? (
                            <Text
                                className={[
                                    "text-xs text-gray-400 dark:text-gray-500",
                                    counterClassName || "",
                                ].join(" ")}
                            >
                                {currentValue.length}
                                {maxLength ? `/${maxLength}` : ""}
                            </Text>
                        ) : null}
                    </View>
                ) : null}
            </Animated.View>
        );
    }
);

Input.displayName = "Input";

export default Input;

// Notes:
// - errorText retained for backward compatibility with StyledTextInput
// - styled-input.tsx should re-export this component.
