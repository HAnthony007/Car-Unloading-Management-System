import { Text, View } from "react-native";

export function ScanHeader() {
    return (
        <View className="px-4 py-4 bg-white border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
                Scanner QR/Code-barres
            </Text>
            <Text className="text-sm text-gray-500">
                Scannez les documents véhicules
            </Text>
        </View>
    );
}
