import { cn } from "@/src/lib/utils";
import { Text, type TextProps } from "react-native";
import { useThemeColor } from "../hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
    className?: string;
};

export function ThemedText({
    style,
    lightColor,
    darkColor,
    type = "default",
    className,
    ...rest
}: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <Text
            className={cn(
                type === "default" && "text-base leading-6",
                type === "title" && "text-4xl font-bold leading-8",
                type === "defaultSemiBold" &&
                    "text-base leading-6 font-semibold",
                type === "subtitle" && "text-xl font-bold",
                type === "link" && "leading-7 text-base",
                className
            )}
            style={[
                { color },
                type === "link" ? { color: "#0a7ea4" } : undefined,
                style,
            ]}
            {...rest}
        />
    );
}
