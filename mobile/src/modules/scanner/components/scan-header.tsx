import { Text, View } from "react-native";
import { PortCallSelector } from "./portcall-selector";

export function ScanHeader() {
    return (
        <View className="bg-white border-b border-gray-200">
            <View className="px-4 pt-4 pb-2">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    Scanner QR/Code-barres
                </Text>
                <Text className="text-sm text-gray-500 mb-2">
                    Scannez les documents véhicules
                </Text>
            </View>
            <PortCallSelector />
        </View>
    );
}
