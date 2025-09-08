import { Text, TouchableOpacity, View } from "react-native";

interface QuickActionsProps {
    onManual(): void;
}

export function QuickActions({ onManual }: QuickActionsProps) {
    return (
        <View className="p-4">
            <Text className="text-base font-semibold text-gray-900 mb-3">
                Actions rapides
            </Text>
            <View className="flex-row gap-3">
                <TouchableOpacity
                    className="flex-1 bg-white p-3 rounded-lg items-center border border-emerald-100"
                    onPress={onManual}
                    activeOpacity={0.85}
                >
                    <Text className="text-sm font-medium text-emerald-600">
                        Saisie manuelle
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-white p-3 rounded-lg items-center">
                    <Text className="text-sm font-medium text-emerald-600">
                        Historique
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
