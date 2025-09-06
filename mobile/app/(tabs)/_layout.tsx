import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useColorScheme } from "@/components/useColorScheme";

// Professional tab bar icon component
function TabBarIcon(props: {
    name: React.ComponentProps<typeof Ionicons>["name"];
    color: string;
    focused: boolean;
}) {
    return (
        <Ionicons
            size={props.focused ? 26 : 24}
            style={{ marginBottom: -3 }}
            {...props}
        />
    );
}

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#2563eb",
                tabBarInactiveTintColor: "#6b7280",
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "600",
                },
                headerShown: useClientOnlyValue(false, true),
                headerStyle: {
                    backgroundColor: "#2563eb",
                },
                headerTintColor: "#ffffff",
                headerTitleStyle: {
                    fontWeight: "bold",
                    fontSize: 18,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Accueil",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "home" : "home-outline"}
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="portcall"
                options={{
                    title: "Escales",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "boat" : "boat-outline"}
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="vehicles"
                options={{
                    title: "Véhicules",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "car" : "car-outline"}
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name={focused ? "person" : "person-outline"}
                            color={color}
                            focused={focused}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
