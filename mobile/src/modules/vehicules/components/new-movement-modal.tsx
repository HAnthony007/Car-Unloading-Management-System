import { List, RefreshCcw, X } from "lucide-react-native";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Field } from "./movement-field";

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    setTitle: (v: string) => void;
    fromLoc: string;
    setFromLoc: (v: string) => void;
    toLoc: string;
    setToLoc: (v: string) => void;
    note: string;
    setNote: (v: string) => void;
    coords: { lat: number; lng: number } | null;
    loadingLoc: boolean;
    requestLocation: () => void;
    confirmMovement: () => void;
    disabledConfirm: boolean;
    openParkings: () => void;
    setFocusedLocationField: (v: "from" | "to" | null) => void;
}

export const NewMovementModal = ({
    visible,
    onClose,
    title,
    setTitle,
    fromLoc,
    setFromLoc,
    toLoc,
    setToLoc,
    note,
    setNote,
    coords,
    loadingLoc,
    requestLocation,
    confirmMovement,
    disabledConfirm,
    openParkings,
    setFocusedLocationField,
}: Props) => (
    <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
    >
        <View className="flex-1 bg-black/40 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-base font-semibold text-slate-900">
                        Nouveau mouvement
                    </Text>
                    <TouchableOpacity
                        onPress={onClose}
                        className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    >
                        <X size={18} color="#374151" />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 32 }}
                    className="-mx-1"
                >
                    <Field label="Titre">
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Déplacement vers Zone B5"
                            placeholderTextColor="#9CA3AF"
                            className="h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
                        />
                    </Field>
                    <Field label="Lieu départ">
                        <TextInput
                            value={fromLoc}
                            onChangeText={setFromLoc}
                            onFocus={() => setFocusedLocationField("from")}
                            placeholder="Ex: Zone A2"
                            placeholderTextColor="#9CA3AF"
                            className="h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
                        />
                    </Field>
                    <Field label="Lieu arrivée">
                        <TextInput
                            value={toLoc}
                            onChangeText={setToLoc}
                            onFocus={() => setFocusedLocationField("to")}
                            placeholder="Ex: Zone B5"
                            placeholderTextColor="#9CA3AF"
                            className="h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
                        />
                    </Field>
                    <Field label="Note">
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Observation / raison"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
                            style={{ textAlignVertical: "top", minHeight: 80 }}
                        />
                    </Field>
                    <View className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <View className="flex-row items-center justify-between mb-2">
                            <Text className="text-[10px] font-semibold text-slate-700 uppercase tracking-wide">
                                GPS Actuel
                            </Text>
                            <TouchableOpacity
                                onPress={requestLocation}
                                className="flex-row items-center px-2 h-7 rounded-lg bg-white border border-gray-300"
                            >
                                {loadingLoc ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#059669"
                                    />
                                ) : (
                                    <RefreshCcw size={14} color="#059669" />
                                )}
                                <Text className="ml-1 text-[10px] font-medium text-emerald-700">
                                    Maj
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {coords ? (
                            <Text className="text-[11px] text-slate-800">
                                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                            </Text>
                        ) : (
                            <Text className="text-[11px] text-slate-400">
                                Non disponible
                            </Text>
                        )}
                    </View>
                    <View className="mt-6 flex-row gap-3">
                        <TouchableOpacity
                            onPress={confirmMovement}
                            disabled={disabledConfirm}
                            className={`flex-1 h-11 rounded-xl items-center justify-center ${disabledConfirm ? "bg-emerald-300" : "bg-emerald-600"}`}
                        >
                            <Text className="text-white text-xs font-semibold">
                                Confirmer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 h-11 rounded-xl bg-gray-200 items-center justify-center"
                        >
                            <Text className="text-gray-700 text-xs font-semibold">
                                Annuler
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={openParkings}
                        className="mt-4 self-start px-3 h-9 rounded-lg bg-slate-800 flex-row items-center"
                    >
                        <List size={16} color="#fff" />
                        <Text className="ml-2 text-[11px] font-semibold text-white">
                            Voir Parkings
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    </Modal>
);
