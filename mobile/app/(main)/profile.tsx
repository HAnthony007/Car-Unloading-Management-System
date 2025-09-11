import { LogoutButton } from "@/src/modules/profile/components/logout-button";
import { StatisticsCard } from "@/src/modules/profile/components/statistics-card";
import { UserInfo } from "@/src/modules/profile/components/user-info";
import {
    Bell,
    ChevronRight,
    Download,
    FileText,
    Globe,
    HelpCircle,
    Moon,
    Shield,
    User,
    Users,
} from "lucide-react-native";
import { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    Settings,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const menuSections = [
        {
            title: "Compte",
            items: [
                {
                    icon: User,
                    label: "Informations personnelles",
                    onPress: () => {},
                },
                { icon: Shield, label: "Sécurité", onPress: () => {} },
                { icon: Users, label: "Gestion des rôles", onPress: () => {} },
            ],
        },
        {
            title: "Application",
            items: [
                {
                    icon: Bell,
                    label: "Notifications",
                    onPress: () => {},
                    hasSwitch: true,
                    switchValue: notificationsEnabled,
                    onSwitchChange: setNotificationsEnabled,
                },
                {
                    icon: Moon,
                    label: "Mode sombre",
                    onPress: () => {},
                    hasSwitch: true,
                    switchValue: darkModeEnabled,
                    onSwitchChange: setDarkModeEnabled,
                },
                { icon: Globe, label: "Langue", onPress: () => {} },
            ],
        },
        {
            title: "Données",
            items: [
                { icon: FileText, label: "Rapports", onPress: () => {} },
                {
                    icon: Download,
                    label: "Exporter les données",
                    onPress: () => {},
                },
            ],
        },
        {
            title: "Support",
            items: [
                { icon: HelpCircle, label: "Centre d'aide", onPress: () => {} },
                {
                    icon: Settings,
                    label: "Paramètres avancés",
                    onPress: () => {},
                },
            ],
        },
    ];

    const renderMenuItem = (item: any, index: number) => (
        <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
            onPress={item.onPress}
            activeOpacity={0.7}
        >
            <View className="flex-row items-center flex-1">
                <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
                    <item.icon color="#059669" size={20} />
                </View>
                <Text className="text-base text-gray-900">{item.label}</Text>
            </View>
            <View className="items-center justify-center">
                {item.hasSwitch ? (
                    <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchChange}
                        trackColor={{ false: "#D1D5DB", true: "#10B981" }}
                        thumbColor={item.switchValue ? "#059669" : "#F3F4F6"}
                    />
                ) : (
                    <ChevronRight color="#9CA3AF" size={20} />
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="px-4 py-4 bg-white border-b border-gray-200">
                    <Text className="text-xl font-semibold text-gray-900">
                        Profile
                    </Text>
                </View>

                <UserInfo />

                {/* Statistics Card */}
                <StatisticsCard />

                {/* Menu Sections */}
                {menuSections.map((section, sectionIndex) => (
                    <View key={sectionIndex} className="mx-4 mb-4">
                        <Text className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                            {section.title}
                        </Text>
                        <View className="bg-white rounded-xl shadow-sm">
                            {section.items.map((item, itemIndex) =>
                                renderMenuItem(item, itemIndex)
                            )}
                        </View>
                    </View>
                ))}

                {/* Logout Button */}
                <LogoutButton />

                {/* App Info */}
                <View className="items-center px-4 pb-8">
                    <Text className="text-xs text-gray-400 text-center">
                        SMMC Port Management v1.0.0
                    </Text>
                    <Text className="text-xs text-gray-400 text-center">
                        © 2024 SMMC Toamasina
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
