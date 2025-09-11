import { LoginForm } from "@/src/modules/auth/components/login-form";
import { LinearGradient } from "expo-linear-gradient";
import { Ship } from "lucide-react-native";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Conversion du StyleSheet vers des classes Tailwind (NativeWind)
export default function LoginScreen() {
    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <SafeAreaView className="flex-1">
                    <LinearGradient
                        colors={["#059669", "#10B981"]}
                        className="flex-1"
                    >
                        <View className="flex-1 justify-center p-6">
                            <View className="items-center mb-12">
                                <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
                                    <Ship
                                        color="#FFFFFF"
                                        size={48}
                                        strokeWidth={2}
                                    />
                                </View>
                                <Text className="text-2xl font-bold text-white mb-2">
                                    SMMC Toamasina
                                </Text>
                                <Text className="text-base text-white/80 text-center">
                                    Gestion Débarquement Véhicules
                                </Text>
                            </View>

                            <LoginForm />

                            <View className="items-center mt-8">
                                <Text className="text-xs text-white/60 text-center">
                                    v1.0 • Suivi des operations de debarquement
                                    des vehicules
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </SafeAreaView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
