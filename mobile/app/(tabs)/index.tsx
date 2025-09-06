import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, TouchableOpacity } from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
    const router = useRouter();

    const quickActions = [
        {
            title: "Escales Actives",
            subtitle: "Voir les escales en cours",
            icon: "boat" as const,
            color: "#2563eb",
            bgColor: "#dbeafe",
            onPress: () => router.push("/portcall"),
        },
        {
            title: "Véhicules",
            subtitle: "Gérer les véhicules",
            icon: "car" as const,
            color: "#059669",
            bgColor: "#d1fae5",
            onPress: () => router.push("/vehicles"),
        },
        {
            title: "Rapports",
            subtitle: "Consulter les rapports",
            icon: "document-text" as const,
            color: "#dc2626",
            bgColor: "#fee2e2",
            onPress: () => {},
        },
        {
            title: "Notifications",
            subtitle: "Alertes et messages",
            icon: "notifications" as const,
            color: "#d97706",
            bgColor: "#fef3c7",
            onPress: () => {},
        },
    ];

    const stats = [
        { label: "Escales Aujourd'hui", value: "3", icon: "calendar" as const },
        { label: "Véhicules Chargés", value: "127", icon: "car" as const },
        { label: "En Attente", value: "23", icon: "time" as const },
        { label: "Terminés", value: "89", icon: "checkmark-circle" as const },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="bg-blue-600 px-6 pt-4 pb-8">
                    <Text className="text-white text-2xl font-bold mb-2">
                        Bonjour Agent
                    </Text>
                    <Text className="text-blue-100 text-base">
                        Gestion des escales et véhicules
                    </Text>
                </View>

                {/* Stats Cards */}
                <View className="px-4 -mt-4 mb-6">
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Aperçu du jour
                        </Text>
                        <View className="flex-row flex-wrap justify-between">
                            {stats.map((stat, index) => (
                                <View key={index} className="w-[48%] mb-3">
                                    <View className="bg-gray-50 rounded-xl p-3">
                                        <View className="flex-row items-center mb-2">
                                            <Ionicons
                                                name={stat.icon}
                                                size={20}
                                                color="#6b7280"
                                            />
                                            <Text className="ml-2 text-gray-600 text-sm">
                                                {stat.label}
                                            </Text>
                                        </View>
                                        <Text className="text-2xl font-bold text-gray-800">
                                            {stat.value}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-4 mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">
                        Actions Rapides
                    </Text>
                    <View className="flex-row flex-wrap justify-between">
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={action.onPress}
                                className="w-[48%] mb-4"
                                activeOpacity={0.7}
                            >
                                <View
                                    className="rounded-2xl p-4 shadow-sm"
                                    style={{ backgroundColor: action.bgColor }}
                                >
                                    <View className="flex-row items-center mb-3">
                                        <View
                                            className="w-10 h-10 rounded-xl items-center justify-center"
                                            style={{
                                                backgroundColor: action.color,
                                            }}
                                        >
                                            <Ionicons
                                                name={action.icon}
                                                size={20}
                                                color="white"
                                            />
                                        </View>
                                    </View>
                                    <Text className="text-gray-800 font-bold text-base mb-1">
                                        {action.title}
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        {action.subtitle}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="px-4 mb-6">
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg font-bold text-gray-800">
                                Activité Récente
                            </Text>
                            <TouchableOpacity>
                                <Text className="text-blue-600 font-semibold">
                                    Voir tout
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-3">
                            <View className="flex-row items-center p-3 bg-green-50 rounded-xl">
                                <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Escale #1234 terminée
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        15 véhicules déchargés
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-xs">
                                    Il y a 2h
                                </Text>
                            </View>

                            <View className="flex-row items-center p-3 bg-blue-50 rounded-xl">
                                <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Nouvelle escale #1235
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        En cours de chargement
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-xs">
                                    Il y a 4h
                                </Text>
                            </View>

                            <View className="flex-row items-center p-3 bg-amber-50 rounded-xl">
                                <View className="w-2 h-2 bg-amber-500 rounded-full mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Véhicule en attente
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        VIN: ABC123456789
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-xs">
                                    Il y a 6h
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
