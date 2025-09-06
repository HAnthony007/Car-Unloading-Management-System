import { Text, View } from "@/components/Themed";
import { StatusBadge } from "@/src/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";

// Mock notifications data
const mockNotifications = [
    {
        id: "1",
        title: "Escale #1234 terminée",
        message:
            "15 véhicules ont été déchargés avec succès. Rapport disponible.",
        type: "success",
        time: "Il y a 2h",
        read: false,
        priority: "high",
    },
    {
        id: "2",
        title: "Nouvelle escale assignée",
        message: "Escale #1235 - 23 véhicules en attente de chargement.",
        type: "info",
        time: "Il y a 4h",
        read: false,
        priority: "medium",
    },
    {
        id: "3",
        title: "Véhicule en attente d'inspection",
        message:
            "VIN: ABC123456789 - Contrôle technique requis avant chargement.",
        type: "warning",
        time: "Il y a 6h",
        read: true,
        priority: "high",
    },
    {
        id: "4",
        title: "Mise à jour système",
        message:
            "Nouvelle version de l'application disponible. Mise à jour recommandée.",
        type: "info",
        time: "Il y a 1 jour",
        read: true,
        priority: "low",
    },
    {
        id: "5",
        title: "Rapport hebdomadaire",
        message: "Votre rapport de performance de la semaine est disponible.",
        type: "info",
        time: "Il y a 2 jours",
        read: true,
        priority: "low",
    },
];

export default function NotificationsScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(mockNotifications);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        // Simulate API call
        setTimeout(() => setRefreshing(false), 1000);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((notif) =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notif) => ({ ...notif, read: true }))
        );
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "success":
                return "checkmark-circle";
            case "warning":
                return "warning";
            case "error":
                return "alert-circle";
            case "info":
            default:
                return "information-circle";
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "success":
                return "#059669";
            case "warning":
                return "#d97706";
            case "error":
                return "#dc2626";
            case "info":
            default:
                return "#2563eb";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "#dc2626";
            case "medium":
                return "#d97706";
            case "low":
                return "#6b7280";
            default:
                return "#6b7280";
        }
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-blue-600 px-4 py-4 flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="pr-2 py-1"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-lg font-bold">
                    Notifications
                </Text>
                <TouchableOpacity onPress={markAllAsRead} className="pl-2 py-1">
                    <Text className="text-blue-200 text-sm font-semibold">
                        {unreadCount > 0 ? "Tout marquer" : ""}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View className="px-4 py-4 bg-white border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Ionicons
                            name="notifications"
                            size={20}
                            color="#2563eb"
                        />
                        <Text className="ml-2 text-gray-800 font-semibold">
                            {notifications.length} notification
                            {notifications.length !== 1 ? "s" : ""}
                        </Text>
                    </View>
                    {unreadCount > 0 && (
                        <View className="bg-red-500 px-2 py-1 rounded-full">
                            <Text className="text-white text-xs font-bold">
                                {unreadCount} non lue
                                {unreadCount !== 1 ? "s" : ""}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Notifications List */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View className="p-4">
                    {notifications.map((notification) => (
                        <TouchableOpacity
                            key={notification.id}
                            onPress={() => markAsRead(notification.id)}
                            className={`mb-3 ${!notification.read ? "opacity-100" : "opacity-70"}`}
                            activeOpacity={0.7}
                        >
                            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                                <View className="flex-row items-start">
                                    <View className="mr-3 mt-1">
                                        <Ionicons
                                            name={getNotificationIcon(
                                                notification.type
                                            )}
                                            size={20}
                                            color={getNotificationColor(
                                                notification.type
                                            )}
                                        />
                                    </View>

                                    <View className="flex-1">
                                        <View className="flex-row items-start justify-between mb-2">
                                            <Text className="text-gray-800 font-bold text-base flex-1">
                                                {notification.title}
                                            </Text>
                                            <View className="flex-row items-center ml-2">
                                                {notification.priority ===
                                                    "high" && (
                                                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                )}
                                                <Text className="text-gray-500 text-xs">
                                                    {notification.time}
                                                </Text>
                                            </View>
                                        </View>

                                        <Text className="text-gray-600 text-sm leading-5 mb-3">
                                            {notification.message}
                                        </Text>

                                        <View className="flex-row items-center justify-between">
                                            <StatusBadge
                                                status={notification.type}
                                                size="small"
                                            />
                                            {!notification.read && (
                                                <View className="w-2 h-2 bg-blue-500 rounded-full" />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {notifications.length === 0 && (
                        <View className="items-center py-12">
                            <Ionicons
                                name="notifications-off"
                                size={48}
                                color="#9ca3af"
                            />
                            <Text className="text-gray-500 mt-4 text-center text-lg">
                                Aucune notification
                            </Text>
                            <Text className="text-gray-400 text-sm mt-2 text-center">
                                Vous êtes à jour !
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
