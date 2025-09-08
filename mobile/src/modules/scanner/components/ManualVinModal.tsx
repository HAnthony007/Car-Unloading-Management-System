import { X } from "lucide-react-native";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { isValidVin } from "../lib/validation";

interface ManualVinModalProps {
    visible: boolean;
    vin: string;
    error: string | null;
    onChange(v: string): void;
    onClose(): void;
    onSubmit(): void;
}

export function ManualVinModal({
    visible,
    vin,
    error,
    onChange,
    onClose,
    onSubmit,
}: ManualVinModalProps) {
    const valid = isValidVin(vin);
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/40 justify-end">
                <View className="bg-white rounded-t-3xl p-6 shadow-xl">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-semibold text-gray-900">
                            Saisie manuelle VIN
                        </Text>
                        <TouchableOpacity
                            className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
                            onPress={onClose}
                        >
                            <X color="#374151" size={20} />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 mb-4 leading-5">
                        Entrez le numéro VIN à 17 caractères du véhicule pour
                        valider manuellement.
                    </Text>
                    <View className="mb-3">
                        <Text className="text-xs font-medium text-gray-600 mb-2">
                            Numéro VIN
                        </Text>
                        <TextInput
                            value={vin}
                            onChangeText={onChange}
                            placeholder="Ex: JTDBR32E820123456"
                            placeholderTextColor="#9CA3AF"
                            autoCapitalize="characters"
                            maxLength={17}
                            className={`rounded-xl px-4 py-3 text-base tracking-widest font-semibold bg-gray-50 ${vin.length === 0 ? "border border-gray-300 text-gray-900" : valid ? "border-emerald-500 bg-emerald-50/30 text-emerald-700" : "border-red-500 bg-red-50/40 text-red-700"}`}
                            style={{ fontFamily: "monospace" }}
                        />
                        <View className="flex-row justify-between mt-1">
                            <Text
                                className={`text-[11px] ${valid ? "text-emerald-600" : vin.length > 0 ? "text-red-500" : "text-gray-400"}`}
                            >
                                {vin.length}/17
                            </Text>
                            {error && (
                                <Text className="text-[11px] text-red-500">
                                    {error}
                                </Text>
                            )}
                        </View>
                    </View>
                    <TouchableOpacity
                        disabled={!valid}
                        className={`mt-2 rounded-xl px-5 py-4 items-center flex-row justify-center ${valid ? "bg-emerald-600" : "bg-gray-200"}`}
                        onPress={onSubmit}
                        activeOpacity={0.9}
                    >
                        <Text
                            className={`text-base font-semibold ${valid ? "text-white" : "text-gray-500"}`}
                        >
                            {valid
                                ? "VIN valide - Continuer"
                                : "Valider le VIN"}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="mt-4 py-3 items-center"
                        onPress={onClose}
                    >
                        <Text className="text-sm font-medium text-gray-500">
                            Annuler
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
