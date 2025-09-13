import { LinearGradient } from "expo-linear-gradient";
import {
    Compass,
    FileText,
    List,
    MapPin,
    Navigation,
    Plus,
    RefreshCcw,
    X,
} from "lucide-react-native";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

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
        <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl max-h-[95%] shadow-2xl">
                {/* Header */}
                <LinearGradient
                    colors={["#1e293b", "#334155"]}
                    className="rounded-t-3xl p-6"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 bg-white/10 rounded-2xl items-center justify-center mr-3">
                                <Plus size={20} color="#ffffff" />
                            </View>
                            <View>
                                <Text className="text-white text-lg font-bold">
                                    Nouveau Mouvement
                                </Text>
                                <Text className="text-slate-300 text-sm">
                                    Enregistrer un déplacement
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-10 h-10 rounded-2xl bg-white/10 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <X size={20} color="#ffffff" />
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <ScrollView
                    className="flex-1"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Title Field */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <FileText size={16} color="#64748b" />
                            <Text className="text-slate-700 text-sm font-semibold ml-2">
                                Titre du mouvement
                            </Text>
                        </View>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Déplacement vers Zone B5"
                            placeholderTextColor="#94a3b8"
                            className="h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                        />
                    </View>

                    {/* Route Fields */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-4">
                            <Navigation size={16} color="#64748b" />
                            <Text className="text-slate-700 text-sm font-semibold ml-2">
                                Itinéraire
                            </Text>
                        </View>

                        <View className="space-y-4">
                            {/* From Location */}
                            <View className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-6 h-6 bg-blue-100 rounded-lg items-center justify-center mr-3">
                                        <MapPin size={14} color="#3b82f6" />
                                    </View>
                                    <Text className="text-slate-600 text-xs font-medium">
                                        Lieu de départ
                                    </Text>
                                </View>
                                <TextInput
                                    value={fromLoc}
                                    onChangeText={setFromLoc}
                                    onFocus={() =>
                                        setFocusedLocationField("from")
                                    }
                                    placeholder="Ex: Zone A2"
                                    placeholderTextColor="#94a3b8"
                                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900"
                                />
                            </View>

                            {/* Arrow */}
                            <View className="flex-row items-center justify-center">
                                <View className="w-8 h-8 bg-emerald-100 rounded-full items-center justify-center">
                                    <Navigation size={16} color="#10b981" />
                                </View>
                            </View>

                            {/* To Location */}
                            <View className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <View className="flex-row items-center mb-2">
                                    <View className="w-6 h-6 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                                        <MapPin size={14} color="#10b981" />
                                    </View>
                                    <Text className="text-slate-600 text-xs font-medium">
                                        Lieu d&apos;arrivée
                                    </Text>
                                </View>
                                <TextInput
                                    value={toLoc}
                                    onChangeText={setToLoc}
                                    onFocus={() =>
                                        setFocusedLocationField("to")
                                    }
                                    placeholder="Ex: Zone B5"
                                    placeholderTextColor="#94a3b8"
                                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm text-slate-900"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Note Field */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-3">
                            <FileText size={16} color="#64748b" />
                            <Text className="text-slate-700 text-sm font-semibold ml-2">
                                Note / Raison
                            </Text>
                        </View>
                        <TextInput
                            value={note}
                            onChangeText={setNote}
                            placeholder="Décrivez la raison du déplacement..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900"
                            style={{ textAlignVertical: "top", minHeight: 80 }}
                        />
                    </View>

                    {/* GPS Section */}
                    <View className="mb-6">
                        <View className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <Compass size={16} color="#64748b" />
                                    <Text className="text-slate-700 text-sm font-semibold ml-2">
                                        Position GPS
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={requestLocation}
                                    className="flex-row items-center px-3 py-2 rounded-lg bg-white border border-slate-200"
                                    activeOpacity={0.7}
                                >
                                    {loadingLoc ? (
                                        <ActivityIndicator
                                            size="small"
                                            color="#10b981"
                                        />
                                    ) : (
                                        <RefreshCcw size={14} color="#10b981" />
                                    )}
                                    <Text className="ml-2 text-xs font-medium text-emerald-700">
                                        Actualiser
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {coords ? (
                                <View className="bg-white rounded-lg p-3">
                                    <Text className="text-slate-800 text-sm font-mono">
                                        {coords.lat.toFixed(6)},{" "}
                                        {coords.lng.toFixed(6)}
                                    </Text>
                                </View>
                            ) : (
                                <View className="bg-slate-200 rounded-lg p-3">
                                    <Text className="text-slate-500 text-sm text-center">
                                        Position non disponible
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3 mb-4">
                        <TouchableOpacity
                            onPress={confirmMovement}
                            disabled={disabledConfirm}
                            className={`flex-1 h-14 rounded-2xl items-center justify-center ${
                                disabledConfirm
                                    ? "bg-slate-300"
                                    : "bg-emerald-500"
                            }`}
                            activeOpacity={0.8}
                            style={
                                !disabledConfirm
                                    ? {
                                          shadowColor: "#10b981",
                                          shadowOffset: { width: 0, height: 4 },
                                          shadowOpacity: 0.3,
                                          shadowRadius: 8,
                                          elevation: 8,
                                      }
                                    : {}
                            }
                        >
                            <Text className="text-white text-sm font-semibold">
                                Enregistrer le Mouvement
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 h-14 rounded-2xl bg-slate-200 items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Text className="text-slate-700 text-sm font-semibold">
                                Annuler
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Parkings Button */}
                    <TouchableOpacity
                        onPress={openParkings}
                        className="flex-row items-center justify-center px-4 py-3 rounded-xl bg-slate-700"
                        activeOpacity={0.8}
                    >
                        <List size={16} color="#fff" />
                        <Text className="ml-2 text-sm font-semibold text-white">
                            Voir les Parkings Disponibles
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    </Modal>
);
