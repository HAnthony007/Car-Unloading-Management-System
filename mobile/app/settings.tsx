import { Text, View } from "@/components/Themed";
import { ActionButton, InfoCard, InfoRow } from "@/src/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Switch, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
    const router = useRouter();
    const [settings, setSettings] = useState({
        notifications: true,
        locationTracking: true,
        autoSync: true,
        darkMode: false,
        biometricAuth: false,
        soundEffects: true,
        vibration: true,
    });

    const handleSettingChange = (key: string, value: boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleExportData = () => {
        Alert.alert(
            "Exporter les données",
            "Voulez-vous exporter toutes vos données de travail ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Exporter", onPress: () => console.log("Export data") },
            ]
        );
    };

    const handleClearCache = () => {
        Alert.alert(
            "Vider le cache",
            "Cela supprimera les données temporaires. Continuer ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Vider",
                    style: "destructive",
                    onPress: () => console.log("Clear cache"),
                },
            ]
        );
    };

    const handleLogout = () => {
        Alert.alert(
            "Déconnexion",
            "Êtes-vous sûr de vouloir vous déconnecter ?",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Déconnexion",
                    style: "destructive",
                    onPress: () => router.push("/login"),
                },
            ]
        );
    };

    const generalSettings = [
        {
            title: "Notifications push",
            subtitle: "Recevoir des alertes en temps réel",
            key: "notifications",
            icon: "notifications-outline" as const,
        },
        {
            title: "Mode sombre",
            subtitle: "Interface adaptée pour la nuit",
            key: "darkMode",
            icon: "moon-outline" as const,
        },
        {
            title: "Effets sonores",
            subtitle: "Sons pour les actions",
            key: "soundEffects",
            icon: "volume-high-outline" as const,
        },
        {
            title: "Vibration",
            subtitle: "Vibrations pour les notifications",
            key: "vibration",
            icon: "phone-portrait-outline" as const,
        },
    ];

    const securitySettings = [
        {
            title: "Authentification biométrique",
            subtitle: "Utiliser l'empreinte ou Face ID",
            key: "biometricAuth",
            icon: "finger-print-outline" as const,
        },
        {
            title: "Suivi de localisation",
            subtitle: "Partager la position pour les rapports",
            key: "locationTracking",
            icon: "location-outline" as const,
        },
    ];

    const dataSettings = [
        {
            title: "Synchronisation automatique",
            subtitle: "Synchroniser les données en arrière-plan",
            key: "autoSync",
            icon: "sync-outline" as const,
        },
    ];

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
                <Text className="text-white text-lg font-bold">Paramètres</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4">
                    {/* General Settings */}
                    <InfoCard title="Général" icon="⚙️">
                        {generalSettings.map((setting, index) => (
                            <View
                                key={setting.key}
                                className={
                                    index !== generalSettings.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }
                            >
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons
                                            name={setting.icon}
                                            size={20}
                                            color="#6b7280"
                                            style={{ marginRight: 12 }}
                                        />
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-base">
                                                {setting.title}
                                            </Text>
                                            <Text className="text-gray-500 text-sm mt-1">
                                                {setting.subtitle}
                                            </Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ] as boolean
                                        }
                                        onValueChange={(value) =>
                                            handleSettingChange(
                                                setting.key,
                                                value
                                            )
                                        }
                                        trackColor={{
                                            false: "#e5e7eb",
                                            true: "#2563eb",
                                        }}
                                        thumbColor={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ]
                                                ? "#ffffff"
                                                : "#ffffff"
                                        }
                                    />
                                </View>
                            </View>
                        ))}
                    </InfoCard>

                    {/* Security Settings */}
                    <InfoCard title="Sécurité" icon="🔒" className="mt-4">
                        {securitySettings.map((setting, index) => (
                            <View
                                key={setting.key}
                                className={
                                    index !== securitySettings.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }
                            >
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons
                                            name={setting.icon}
                                            size={20}
                                            color="#6b7280"
                                            style={{ marginRight: 12 }}
                                        />
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-base">
                                                {setting.title}
                                            </Text>
                                            <Text className="text-gray-500 text-sm mt-1">
                                                {setting.subtitle}
                                            </Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ] as boolean
                                        }
                                        onValueChange={(value) =>
                                            handleSettingChange(
                                                setting.key,
                                                value
                                            )
                                        }
                                        trackColor={{
                                            false: "#e5e7eb",
                                            true: "#2563eb",
                                        }}
                                        thumbColor={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ]
                                                ? "#ffffff"
                                                : "#ffffff"
                                        }
                                    />
                                </View>
                            </View>
                        ))}
                    </InfoCard>

                    {/* Data Settings */}
                    <InfoCard title="Données" icon="💾" className="mt-4">
                        {dataSettings.map((setting, index) => (
                            <View
                                key={setting.key}
                                className={
                                    index !== dataSettings.length - 1
                                        ? "border-b border-gray-100"
                                        : ""
                                }
                            >
                                <View className="flex-row items-center justify-between py-3">
                                    <View className="flex-row items-center flex-1">
                                        <Ionicons
                                            name={setting.icon}
                                            size={20}
                                            color="#6b7280"
                                            style={{ marginRight: 12 }}
                                        />
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-base">
                                                {setting.title}
                                            </Text>
                                            <Text className="text-gray-500 text-sm mt-1">
                                                {setting.subtitle}
                                            </Text>
                                        </View>
                                    </View>
                                    <Switch
                                        value={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ] as boolean
                                        }
                                        onValueChange={(value) =>
                                            handleSettingChange(
                                                setting.key,
                                                value
                                            )
                                        }
                                        trackColor={{
                                            false: "#e5e7eb",
                                            true: "#2563eb",
                                        }}
                                        thumbColor={
                                            settings[
                                                setting.key as keyof typeof settings
                                            ]
                                                ? "#ffffff"
                                                : "#ffffff"
                                        }
                                    />
                                </View>
                            </View>
                        ))}
                    </InfoCard>

                    {/* Data Management */}
                    <InfoCard
                        title="Gestion des données"
                        icon="📊"
                        className="mt-4"
                    >
                        <InfoRow
                            label="Espace utilisé"
                            value="2.3 GB"
                            icon="storage-outline"
                        />
                        <InfoRow
                            label="Dernière synchronisation"
                            value="Il y a 5 min"
                            icon="sync-outline"
                        />
                        <InfoRow
                            label="Exporter les données"
                            value=""
                            icon="download-outline"
                            onPress={handleExportData}
                        />
                        <InfoRow
                            label="Vider le cache"
                            value=""
                            icon="trash-outline"
                            onPress={handleClearCache}
                        />
                    </InfoCard>

                    {/* App Info */}
                    <InfoCard title="Application" icon="📱" className="mt-4">
                        <InfoRow
                            label="Version"
                            value="1.0.0"
                            icon="information-circle-outline"
                        />
                        <InfoRow
                            label="Dernière mise à jour"
                            value="15 Jan 2024"
                            icon="calendar-outline"
                        />
                        <InfoRow
                            label="Conditions d'utilisation"
                            value=""
                            icon="document-text-outline"
                            onPress={() => console.log("Terms")}
                        />
                        <InfoRow
                            label="Politique de confidentialité"
                            value=""
                            icon="shield-outline"
                            onPress={() => console.log("Privacy")}
                        />
                    </InfoCard>

                    {/* Logout Button */}
                    <View className="mt-6">
                        <ActionButton
                            title="Se déconnecter"
                            onPress={handleLogout}
                            variant="danger"
                            icon="log-out-outline"
                            fullWidth
                        />
                    </View>

                    {/* App Version */}
                    <View className="mt-6 mb-4">
                        <Text className="text-center text-gray-400 text-sm">
                            SMMC Transport Mobile v1.0.0
                        </Text>
                        <Text className="text-center text-gray-400 text-xs mt-1">
                            © 2024 SMMC Transport. Tous droits réservés.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
