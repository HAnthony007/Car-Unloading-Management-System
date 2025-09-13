import { Tabs } from "expo-router";
import React from "react";

import { FloatingChatbot } from "@/src/modules/assistant-ai/components/chatbot";
import { AuthGuard } from "@/src/providers/auth-guard";
import { Anchor, BarChart3, MapPin, ScanLine, User } from "lucide-react-native";
import { useColorScheme } from "react-native";

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthGuard>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#059669",
                    tabBarInactiveTintColor: "#6B7280",
                    tabBarStyle: {
                        backgroundColor:
                            colorScheme === "dark" ? "#000" : "#FFF",
                        borderTopColor:
                            colorScheme === "dark" ? "#000" : "#E5E7EB",
                        borderTopWidth: 1,
                        paddingBottom: 8,
                        paddingTop: 8,
                        height: 64,
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                    },
                    headerShown: false,
                    // tabBarButton: HapticTab,
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
                    name="portcall"
                    options={{
                        title: "Escales",
                        tabBarIcon: ({ size, color }) => (
                            <Anchor size={size} color={color} />
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
                    name="map"
                    options={{
                        title: "Google Map",
                        tabBarIcon: ({ size, color }) => (
                            <MapPin size={size} color={color} />
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
            <FloatingChatbot />
        </AuthGuard>
    );
}
