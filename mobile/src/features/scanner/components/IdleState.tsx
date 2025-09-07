import { Camera, ScanLine } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

interface IdleStateProps {
    onStart(): void;
}

export function IdleState({ onStart }: IdleStateProps) {
    return (
        <View className="flex-1 p-4">
            <View className="flex-1 items-center justify-center bg-white rounded-xl p-6 mb-4">
                <ScanLine color="#059669" size={80} />
                <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    Prêt à scanner
                </Text>
                <Text className="text-sm text-gray-500 text-center">
                    Appuyez sur le bouton pour démarrer la numérisation des
                    codes QR ou codes-barres
                </Text>
            </View>
            <TouchableOpacity
                className="flex-row items-center justify-center bg-emerald-600 p-4 rounded-xl gap-2"
                onPress={onStart}
            >
                <Camera color="#FFFFFF" size={24} />
                <Text className="text-white text-base font-semibold">
                    Démarrer le scan
                </Text>
            </TouchableOpacity>
        </View>
    );
}
