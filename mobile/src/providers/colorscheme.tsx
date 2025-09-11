import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";

export function ColorSchemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const colorScheme = useColorScheme();
    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            {children}
        </ThemeProvider>
    );
}
