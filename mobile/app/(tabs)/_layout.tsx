import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import { useColorScheme } from "@/components/useColorScheme";
import { BarChart3, ScanLine, User } from "lucide-react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>["name"];
    color: string;
}) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#059669",
                tabBarInactiveTintColor: "#6B7280",
                tabBarStyle: {
                    backgroundColor:
                        colorScheme === "dark" ? "#000" : "#FFFFFF",
                    borderTopColor: colorScheme === "dark" ? "#000" : "#E5E7EB",
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 64,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                // headerShown: useClientOnlyValue(false, true),
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Tableau de bord",
                    tabBarIcon: ({ size, color }) => (
                        <BarChart3 size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="two"
                options={{
                    title: "Tab Two",
                    tabBarIcon: ({ color }) => (
                        <TabBarIcon name="code" color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="scanner"
                options={{
                    title: "Scanner",
                    tabBarIcon: ({ size, color }) => (
                        <ScanLine size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ size, color }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
