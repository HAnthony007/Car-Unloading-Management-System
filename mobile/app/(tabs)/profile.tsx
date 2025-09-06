import { Text, View } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, ScrollView, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => console.log("Logout"),
                },
            ]
        );
    };

    const profileOptions = [
        {
            title: "Mon Profil",
            subtitle: "Informations personnelles",
            icon: "person-outline" as const,
            color: "#2563eb",
            onPress: () => console.log("Profile"),
        },
        {
            title: "Paramètres",
            subtitle: "Préférences et configuration",
            icon: "settings-outline" as const,
            color: "#6b7280",
            onPress: () => console.log("Settings"),
        },
        {
            title: "Notifications",
            subtitle: "Alertes et messages",
            icon: "notifications-outline" as const,
            color: "#d97706",
            onPress: () => console.log("Notifications"),
        },
        {
            title: "Aide & Support",
            subtitle: "FAQ et assistance",
            icon: "help-circle-outline" as const,
            color: "#059669",
            onPress: () => console.log("Help"),
        },
        {
            title: "À propos",
            subtitle: "Version et informations",
            icon: "information-circle-outline" as const,
            color: "#7c3aed",
            onPress: () => console.log("About"),
        },
    ];

    const stats = [
        { label: "Escales Gérées", value: "24", icon: "boat" as const },
        { label: "Véhicules Traités", value: "156", icon: "car" as const },
        { label: "Heures de Travail", value: "180h", icon: "time" as const },
        { label: "Efficacité", value: "98%", icon: "trending-up" as const },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Section */}
                <View className="bg-blue-600 px-4 pt-4 pb-8">
                    <View className="items-center">
                        <View className="w-20 h-20 bg-white rounded-full items-center justify-center mb-4">
                            <Ionicons name="person" size={40} color="#2563eb" />
                        </View>
                        <Text className="text-white text-xl font-bold mb-1">
                            Agent Terrain
                        </Text>
                        <Text className="text-blue-100 text-base">
                            SMMC Transport
                        </Text>
                        <Text className="text-blue-200 text-sm mt-1">
                            agent.terrain@smmc.com
                        </Text>
                    </View>
                </View>

                {/* Stats Cards */}
                <View className="px-4 -mt-4 mb-6">
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Mes Statistiques
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

                {/* Profile Options */}
                <View className="px-4 mb-6">
                    <Text className="text-lg font-bold text-gray-800 mb-4">
                        Compte
                    </Text>
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {profileOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={option.onPress}
                                className={`flex-row items-center p-4 ${
                                    index !== profileOptions.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }`}
                                activeOpacity={0.7}
                            >
                                <View
                                    className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                                    style={{
                                        backgroundColor: `${option.color}20`,
                                    }}
                                >
                                    <Ionicons
                                        name={option.icon}
                                        size={20}
                                        color={option.color}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold text-base">
                                        {option.title}
                                    </Text>
                                    <Text className="text-gray-500 text-sm mt-1">
                                        {option.subtitle}
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="px-4 mb-6">
                    <View className="bg-white rounded-2xl p-4 shadow-sm">
                        <Text className="text-lg font-bold text-gray-800 mb-4">
                            Activité Récente
                        </Text>

                        <View className="space-y-3">
                            <View className="flex-row items-center p-3 bg-green-50 rounded-xl">
                                <View className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                <View className="flex-1">
                                    <Text className="text-gray-800 font-semibold">
                                        Escale #1234 terminée
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        15 véhicules déchargés avec succès
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
                                        Nouvelle escale assignée
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Escale #1235 - 23 véhicules
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
                                        VIN: ABC123456789 - Inspection requise
                                    </Text>
                                </View>
                                <Text className="text-gray-500 text-xs">
                                    Il y a 6h
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <View className="px-4 mb-6">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="bg-red-50 py-4 rounded-2xl items-center border border-red-200"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <Ionicons
                                name="log-out-outline"
                                size={20}
                                color="#dc2626"
                            />
                            <Text className="ml-2 text-red-600 font-bold text-base">
                                Se déconnecter
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* App Version */}
                <View className="px-4 pb-6">
                    <Text className="text-center text-gray-400 text-sm">
                        Version 1.0.0 • SMMC Transport
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
