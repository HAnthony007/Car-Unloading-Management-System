import { AuthGuard } from "@/src/providers/auth-guard";
import { Tabs } from "expo-router";
import { BarChart3, ClipboardCheck, Move } from "lucide-react-native";
import React from "react";
import { useColorScheme } from "react-native";

export default function VehiclesLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthGuard>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: "#059669",
                    tabBarInactiveTintColor: "#6B7280",
                    tabBarStyle: {
                        backgroundColor:
                            colorScheme === "dark" ? "#000" : "#FFFFFF",
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
                    // headerShown: useClientOnlyValue(false, true),
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Resume",
                        tabBarIcon: ({ size, color }) => (
                            <BarChart3 size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="survey"
                    options={{
                        title: "Inspection",
                        tabBarIcon: ({ size, color }) => (
                            <ClipboardCheck size={size} color={color} />
                        ),
                    }}
                />

                <Tabs.Screen
                    name="movements"
                    options={{
                        title: "Mouvements",
                        tabBarIcon: ({ size, color }) => (
                            <Move size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </AuthGuard>
    );
}
