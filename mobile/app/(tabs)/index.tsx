import { LinearGradient } from "expo-linear-gradient";
import {
    AlertTriangle,
    BarChart3,
    Car,
    Filter,
    MapPin,
    ScanLine,
    Ship,
    TrendingUp,
} from "lucide-react-native";
import { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardScreen() {
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    const stats = [
        {
            label: "Véhicules aujourd'hui",
            value: "127",
            icon: Car,
            color: "#059669",
        },
        { label: "Navires en cours", value: "3", icon: Ship, color: "#2563EB" },
        {
            label: "Alertes actives",
            value: "2",
            icon: AlertTriangle,
            color: "#DC2626",
        },
        {
            label: "Zones occupées",
            value: "8/12",
            icon: MapPin,
            color: "#7C3AED",
        },
    ];

    const recentActivity = [
        {
            id: 1,
            type: "arrival",
            message: "Navire MSC LUCIA - 45 véhicules",
            time: "10:30",
        },
        {
            id: 2,
            type: "alert",
            message: "Zone A7 - Capacité atteinte",
            time: "09:15",
        },
        {
            id: 3,
            type: "departure",
            message: "Véhicule Toyota RAV4 - Livré",
            time: "08:45",
        },
        {
            id: 4,
            type: "arrival",
            message: "Véhicule BMW X3 - Zone B2",
            time: "08:20",
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                {/* Header */}
                <LinearGradient
                    colors={["#059669", "#10B981"]}
                    className="px-6 pt-4 pb-6"
                >
                    <View className="flex-row justify-between items-center mb-2">
                        <View>
                            <Text className="text-sm text-white/90">
                                Bonjour,
                            </Text>
                            <Text className="text-2xl font-bold text-white">
                                Agent SMMC
                            </Text>
                        </View>
                        <TouchableOpacity className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                            <Filter color="#FFFFFF" size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-white/90 capitalize">
                        {new Date().toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </Text>
                </LinearGradient>

                {/* Statistics Cards */}
                <View className="flex-row flex-wrap p-4 gap-3">
                    {stats.map((stat, index) => (
                        <TouchableOpacity
                            key={index}
                            className="flex-1 min-w-[45%] bg-white rounded-xl p-4 items-center shadow-sm"
                        >
                            <View
                                className="w-12 h-12 rounded-full items-center justify-center mb-2"
                                style={{ backgroundColor: `${stat.color}20` }}
                            >
                                <stat.icon color={stat.color} size={24} />
                            </View>
                            <Text className="text-2xl font-bold text-gray-900 mb-1">
                                {stat.value}
                            </Text>
                            <Text className="text-xs text-gray-500 text-center">
                                {stat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Actions */}
                <View className="p-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Actions rapides
                    </Text>
                    <View className="flex-row gap-3">
                        <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm">
                            <Car color="#059669" size={24} />
                            <Text className="text-xs text-gray-700 mt-2 text-center">
                                Nouveau véhicule
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm">
                            <ScanLine color="#059669" size={24} />
                            <Text className="text-xs text-gray-700 mt-2 text-center">
                                Scanner QR
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white rounded-xl p-4 items-center shadow-sm">
                            <MapPin color="#059669" size={24} />
                            <Text className="text-xs text-gray-700 mt-2 text-center">
                                Zones stockage
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recent Activity */}
                <View className="p-4">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-900">
                            Activité récente
                        </Text>
                        <TouchableOpacity>
                            <Text className="text-sm text-emerald-600">
                                Voir tout
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        {recentActivity.map((activity) => (
                            <View
                                key={activity.id}
                                className="flex-row items-center py-3 border-b border-gray-100"
                            >
                                <View
                                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                                    style={{
                                        backgroundColor:
                                            activity.type === "alert"
                                                ? "#FEF2F2"
                                                : "#F0FDF4",
                                    }}
                                >
                                    {activity.type === "alert" ? (
                                        <AlertTriangle
                                            color="#DC2626"
                                            size={16}
                                        />
                                    ) : activity.type === "arrival" ? (
                                        <TrendingUp color="#059669" size={16} />
                                    ) : (
                                        <Car color="#059669" size={16} />
                                    )}
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-900 mb-1">
                                        {activity.message}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        {activity.time}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Charts Section */}
                <View className="p-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-4">
                        Statistiques hebdomadaires
                    </Text>
                    <View className="bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-base font-semibold text-gray-900 mb-4">
                            Débarquements par jour
                        </Text>
                        <View className="h-48 items-center justify-center bg-gray-50 rounded-lg">
                            <BarChart3 color="#6B7280" size={48} />
                            <Text className="text-sm text-gray-500 mt-2">
                                Graphique des débarquements
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
