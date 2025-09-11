import { cn } from "@/src/lib/utils";
import { Text, TextStyle, View, ViewStyle } from "react-native";

type CoreVariant = "success" | "warning" | "error" | "info" | "neutral";
type ToneVariant = "blue" | "amber" | "violet" | "emerald";
export type BadgeVariant = CoreVariant | ToneVariant;
export type BadgeSize = "small" | "medium" | "large";
export type BadgeAppearance = "soft" | "solid" | "outline";

export interface BadgeProps {
    label: string;
    value?: string; // when provided, renders status style (label + value)
    variant?: BadgeVariant; // semantic color key
    tone?: ToneVariant; // backward compat from StatusBadge
    size?: BadgeSize;
    appearance?: BadgeAppearance; // style variant
    style?: ViewStyle;
    textStyle?: TextStyle;
    className?: string;
    textClassName?: string;
    pill?: boolean;
    uppercase?: boolean;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    // Status flags
    loading?: boolean;
    muted?: boolean; // dims the badge
    maxLabelChars?: number; // truncation helper
    maxValueChars?: number;
    truncateMode?: "tail" | "middle";
    // Accessibility
    accessibilityLabel?: string;
}

// Color design tokens (base, soft bg, soft text, solid bg, solid text, outline border)
const colorMap: Record<
    BadgeVariant,
    {
        softBg: string;
        softText: string;
        solidBg: string;
        solidText: string;
        outline: string;
    }
> = {
    success: {
        softBg: "bg-emerald-100",
        softText: "text-emerald-600",
        solidBg: "bg-emerald-600",
        solidText: "text-emerald-50",
        outline: "border-emerald-500",
    },
    warning: {
        softBg: "bg-amber-100",
        softText: "text-amber-700",
        solidBg: "bg-amber-600",
        solidText: "text-amber-50",
        outline: "border-amber-500",
    },
    error: {
        softBg: "bg-rose-100",
        softText: "text-rose-600",
        solidBg: "bg-rose-600",
        solidText: "text-rose-50",
        outline: "border-rose-500",
    },
    info: {
        softBg: "bg-blue-100",
        softText: "text-blue-600",
        solidBg: "bg-blue-600",
        solidText: "text-blue-50",
        outline: "border-blue-500",
    },
    neutral: {
        softBg: "bg-gray-100",
        softText: "text-gray-600",
        solidBg: "bg-gray-700",
        solidText: "text-gray-50",
        outline: "border-gray-400",
    },
    blue: {
        softBg: "bg-blue-100",
        softText: "text-blue-600",
        solidBg: "bg-blue-600",
        solidText: "text-blue-50",
        outline: "border-blue-500",
    },
    amber: {
        softBg: "bg-amber-100",
        softText: "text-amber-700",
        solidBg: "bg-amber-600",
        solidText: "text-amber-50",
        outline: "border-amber-500",
    },
    violet: {
        softBg: "bg-violet-100",
        softText: "text-violet-600",
        solidBg: "bg-violet-600",
        solidText: "text-violet-50",
        outline: "border-violet-500",
    },
    emerald: {
        softBg: "bg-emerald-100",
        softText: "text-emerald-600",
        solidBg: "bg-emerald-600",
        solidText: "text-emerald-50",
        outline: "border-emerald-500",
    },
};

const sizeMap: Record<
    BadgeSize,
    { container: string; text: string; gap: string }
> = {
    small: {
        container: "px-1.5 py-0.5 rounded-md",
        text: "text-[10px]",
        gap: "space-x-0.5",
    },
    medium: {
        container: "px-2 py-1 rounded-[12px]",
        text: "text-xs",
        gap: "space-x-1",
    },
    large: {
        container: "px-3 py-1.5 rounded-[14px]",
        text: "text-sm",
        gap: "space-x-1.5",
    },
};

function truncate(
    text: string,
    max?: number,
    mode: "tail" | "middle" = "tail"
) {
    if (!max || text.length <= max) return text;
    if (mode === "tail") return text.slice(0, max - 1) + "…";
    const half = Math.floor((max - 1) / 2);
    return text.slice(0, half) + "…" + text.slice(text.length - half);
}

export function Badge({
    label,
    value,
    variant = "neutral",
    tone, // backward compat
    size = "medium",
    appearance,
    style,
    textStyle,
    className,
    textClassName,
    pill = false,
    uppercase = false,
    iconLeft,
    iconRight,
    loading,
    muted,
    maxLabelChars,
    maxValueChars,
    truncateMode = "tail",
    accessibilityLabel,
}: BadgeProps) {
    // If tone provided prefer it over variant (status badge backward compat)
    const chosenVariant = tone || variant;
    const colors = colorMap[chosenVariant];
    const isStatus = value != null && value !== "";
    // Auto appearance: status -> solid, basic -> soft
    const finalAppearance: BadgeAppearance =
        appearance || (isStatus ? "solid" : "soft");

    const shape = pill
        ? "rounded-full"
        : sizeMap[size].container
              .split(" ")
              .find((c) => c.startsWith("rounded")) || "";
    const sizePadding = sizeMap[size].container
        .split(" ")
        .filter((c) => !c.startsWith("rounded"))
        .join(" ");

    const appearanceClasses: Record<BadgeAppearance, string> = {
        soft: `${colors.softBg} ${colors.softText}`,
        solid: `${colors.solidBg} ${colors.solidText}`,
        outline: `bg-transparent ${colors.softText} border ${colors.outline}`,
    };

    const containerClass = cn(
        "self-start flex-row items-center",
        sizePadding,
        shape,
        appearanceClasses[finalAppearance],
        muted && "opacity-60",
        loading && "opacity-70",
        className
    );

    const baseText = cn(
        "font-semibold",
        sizeMap[size].text,
        uppercase && "uppercase",
        textClassName
    );

    const labelText = truncate(label, maxLabelChars, truncateMode);
    const valueText = value
        ? truncate(value, maxValueChars, truncateMode)
        : undefined;

    return (
        <View
            className={containerClass}
            style={style}
            accessibilityRole="text"
            accessibilityLabel={
                accessibilityLabel ||
                labelText + (valueText ? ` ${valueText}` : "")
            }
        >
            {iconLeft && <View className="mr-1">{iconLeft}</View>}
            <Text className={baseText} style={textStyle}>
                {labelText}
            </Text>
            {isStatus && (
                <Text className={cn(baseText, "ml-2 font-medium opacity-90")}>
                    {valueText}
                </Text>
            )}
            {loading && (
                <Text className={cn(baseText, "ml-1 animate-pulse")}>…</Text>
            )}
            {iconRight && <View className="ml-1">{iconRight}</View>}
        </View>
    );
}

// Backward compatible named export for previous StatusBadge pattern
export function StatusBadge({
    label,
    value,
    tone,
}: {
    label: string;
    value: string;
    tone?: ToneVariant;
}) {
    return (
        <Badge
            label={label}
            value={value}
            tone={tone}
            pill
            appearance="solid"
        />
    );
}

export default Badge;
