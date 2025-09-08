import { CircleCheck as CheckCircle } from "lucide-react-native";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ScanResultModalProps {
    visible: boolean;
    code: string;
    onClose(): void;
}

export function ScanResultModal({
    visible,
    code,
    onClose,
}: ScanResultModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 items-center justify-center">
                <View className="bg-white rounded-xl p-6 items-center m-6 min-w-[280px]">
                    <CheckCircle color="#059669" size={64} />
                    <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                        Scan réussi!
                    </Text>
                    <Text className="text-sm text-gray-500 text-center mb-4">
                        Code scanné: {code}
                    </Text>
                    <TouchableOpacity
                        className="bg-emerald-600 px-6 py-3 rounded-lg"
                        onPress={onClose}
                    >
                        <Text className="text-white text-base font-semibold">
                            Continuer
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
