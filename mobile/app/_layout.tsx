import Providers from "@/src/providers/provider";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import "react-native-reanimated";
import "./global.css";

export const unstable_settings = {
    initialRouteName: "modal",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Providers>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right",
                    }}
                >
                    <Stack.Screen
                        name="(main)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="modal"
                        options={{ presentation: "modal", title: "Modal" }}
                    />
                </Stack>
                <StatusBar style="auto" />
            </Providers>
        </ThemeProvider>
    );
}
