import { PropsWithChildren, useState } from "react";
import { TouchableOpacity } from "react-native";

import { Colors } from "@/src/constants/theme";
import { useColorScheme } from "@/src/hooks/use-color-scheme.web";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { IconSymbol } from "./icon-symbol";

export function Collapsible({
    children,
    title,
}: PropsWithChildren & { title: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const theme = useColorScheme() ?? "light";

    return (
        <ThemedView>
            <TouchableOpacity
                className="flex-row items-center gap-1.5"
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}
            >
                <IconSymbol
                    name="chevron.right"
                    size={18}
                    weight="medium"
                    color={
                        theme === "light" ? Colors.light.icon : Colors.dark.icon
                    }
                    style={{
                        transform: [{ rotate: isOpen ? "90deg" : "0deg" }],
                    }}
                />

                <ThemedText className="font-semibold" type="defaultSemiBold">
                    {title}
                </ThemedText>
            </TouchableOpacity>
            {isOpen && (
                <ThemedView className="mt-1.5 ml-6">{children}</ThemedView>
            )}
        </ThemedView>
    );
}
