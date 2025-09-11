import { X } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Props {
    visible: boolean;
    onClose: () => void;
    parkings: string[];
    onSelect: (p: string) => void;
}

export const ParkingsModal = ({
    visible,
    onClose,
    parkings,
    onSelect,
}: Props) => (
    <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base font-semibold text-slate-900">
                        Parkings au Port
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    >
                        <X size={18} color="#374151" />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    className="-mx-1"
                    contentContainerStyle={{ paddingBottom: 16 }}
                >
                    {parkings.map((p) => (
                        <TouchableOpacity
                            key={p}
                            onPress={() => {
                                onSelect(p);
                                onClose();
                            }}
                            className="px-3 py-3 mx-1 mb-2 rounded-lg border border-gray-200 bg-slate-50 active:bg-emerald-50"
                            activeOpacity={0.85}
                        >
                            <Text
                                className="text-xs font-semibold text-slate-900"
                                numberOfLines={1}
                            >
                                {p}
                            </Text>
                            <Text className="text-[10px] text-gray-500">
                                Zone de stationnement
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </View>
    </Modal>
);
