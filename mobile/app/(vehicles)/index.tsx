// body components moved to VehicleScreenBody
// ...existing code...
import VehicleScreenBody from "@/src/modules/vehicules/components/vehicle-screen-body";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { X } from "lucide-react-native";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleScreen() {
    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900">
                    Détails Véhicule
                </Text>
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <X color="#374151" size={22} />
                </TouchableOpacity>
            </View>
            <VehicleScreenBody />
            <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
        </SafeAreaView>
    );
}
