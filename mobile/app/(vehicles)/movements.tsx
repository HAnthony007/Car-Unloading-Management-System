import { useScannerStore } from "@/lib/store";
import {
    Clock3,
    Compass,
    FileText,
    List,
    MapPin,
    MoveRight,
    Plus,
    RefreshCcw,
    X,
} from "lucide-react-native";
import { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const formatRelative = (iso: string) => {
    const d = new Date(iso);
    const now = Date.now();
    const diffMs = d.getTime() - now;
    const abs = Math.abs(diffMs);
    const m = Math.round(abs / 60000);
    if (m < 1) return "à l'instant";
    if (m < 60) return diffMs < 0 ? `il y a ${m} min` : `dans ${m} min`;
    const h = Math.round(m / 60);
    if (h < 24) return diffMs < 0 ? `il y a ${h} h` : `dans ${h} h`;
    const dDays = Math.round(h / 24);
    return diffMs < 0 ? `il y a ${dDays} j` : `dans ${dDays} j`;
};

export default function MovementsScreen() {
    const movements = useScannerStore((s) => s.movements);
    const vin = useScannerStore((s) => s.vin);
    const addMovement = useScannerStore((s) => s.addMovement);

    // UI state for new movement modal
    const [showNew, setShowNew] = useState(false);
    const [showParkings, setShowParkings] = useState(false);
    const [title, setTitle] = useState("");
    const [fromLoc, setFromLoc] = useState("");
    const [toLoc, setToLoc] = useState("");
    const [note, setNote] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [focusedLocationField, setFocusedLocationField] = useState<
        "from" | "to" | null
    >(null);

    const PARKINGS = [
        "Zone Tampon",
        "Zone A1",
        "Zone A2",
        "Zone B3",
        "Zone B5",
        "Quai Débarquement",
        "Parc Export",
        "Inspection Technique",
        "Zone Logistique",
    ];

    const requestLocation = async () => {
        setLoadingLoc(true);
        try {
            let Location: any;
            try {
                Location = require("expo-location");
            } catch {
                Location = null;
            }
            if (!Location) {
                // Fallback mock
                setCoords({
                    lat: 14.7167 + (Math.random() - 0.5) * 0.01,
                    lng: -17.4677 + (Math.random() - 0.5) * 0.01,
                });
                return;
            }
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setCoords(null);
                return;
            }
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } catch (e) {
            setCoords(null);
        } finally {
            setLoadingLoc(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setFromLoc("");
        setToLoc("");
        setNote("");
        setCoords(null);
        setFocusedLocationField(null);
    };

    const confirmMovement = () => {
        if (!fromLoc || !toLoc) return; // minimal
        addMovement({
            from: fromLoc,
            to: toLoc,
            reason: note,
            title: title || `${fromLoc} → ${toLoc}`,
            description: note,
            coordsFrom: coords || undefined,
            coordsTo: coords || undefined,
        });
        setShowNew(false);
        resetForm();
    };
    return (
        <View className="flex-1 bg-slate-50">
            <View className="px-5 pt-10 pb-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900 mb-1">
                    Mouvements
                </Text>
                <Text className="text-[11px] text-gray-500">
                    {vin
                        ? `VIN actif: ${vin} | ${movements.length} mouvement(s)`
                        : "Aucun VIN actif"}
                </Text>
            </View>
            {movements.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-xs text-gray-400">
                        Aucun mouvement enregistré.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={movements}
                    keyExtractor={(i) => i.id}
                    contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
                    ItemSeparatorComponent={() => <View className="h-4" />}
                    renderItem={({ item, index }) => (
                        <View className="flex-row">
                            {/* Timeline */}
                            <View className="items-center mr-3">
                                <View className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
                                {index < movements.length - 1 && (
                                    <View className="w-px flex-1 bg-gray-300 mt-1" />
                                )}
                            </View>
                            {/* Card */}
                            <TouchableOpacity
                                activeOpacity={0.85}
                                className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                            >
                                {/* Title */}
                                <Text
                                    className="text-sm font-semibold text-slate-900 mb-1"
                                    numberOfLines={1}
                                >
                                    {item.title || `${item.from} → ${item.to}`}
                                </Text>
                                {/* From -> To */}
                                <View className="flex-row items-center mb-2">
                                    <MapPin size={14} color="#059669" />
                                    <Text
                                        className="ml-1 text-[11px] font-medium text-slate-700"
                                        numberOfLines={1}
                                    >
                                        {item.from}
                                    </Text>
                                    <MoveRight
                                        size={16}
                                        color="#059669"
                                        style={{ marginHorizontal: 6 }}
                                    />
                                    <MapPin size={14} color="#059669" />
                                    <Text
                                        className="ml-1 text-[11px] font-medium text-slate-700"
                                        numberOfLines={1}
                                    >
                                        {item.to}
                                    </Text>
                                </View>
                                {/* Date & Relative */}
                                <View className="flex-row items-center mb-2">
                                    <Clock3 size={14} color="#6B7280" />
                                    <Text className="ml-1 text-[10px] text-gray-500">
                                        {new Date(item.at).toLocaleString(
                                            "fr-FR"
                                        )}{" "}
                                        • {formatRelative(item.at)}
                                    </Text>
                                </View>
                                {/* GPS Coordinates */}
                                <View className="flex-row items-center mb-2">
                                    <Compass size={14} color="#6B7280" />
                                    <Text
                                        className="ml-1 text-[10px] text-gray-500"
                                        numberOfLines={1}
                                    >
                                        {item.coordsFrom && item.coordsTo
                                            ? `${item.coordsFrom.lat.toFixed(5)}, ${item.coordsFrom.lng.toFixed(5)} → ${item.coordsTo.lat.toFixed(5)}, ${item.coordsTo.lng.toFixed(5)}`
                                            : "Coordonnées: —"}
                                    </Text>
                                </View>
                                {/* Description / Reason */}
                                {(item.description || item.reason) && (
                                    <View className="flex-row items-start">
                                        <FileText
                                            size={14}
                                            color="#6B7280"
                                            style={{ marginTop: 2 }}
                                        />
                                        <Text
                                            className="ml-1 text-[11px] text-gray-600 flex-1"
                                            numberOfLines={3}
                                        >
                                            {item.description || item.reason}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {/* Bottom Action Bar */}
            <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 px-5 pt-3 pb-4 flex-row gap-3">
                <TouchableOpacity
                    onPress={() => {
                        resetForm();
                        setShowNew(true);
                        requestLocation();
                    }}
                    className="flex-1 h-11 rounded-xl bg-emerald-600 flex-row items-center justify-center"
                    activeOpacity={0.9}
                >
                    <Plus size={18} color="#fff" />
                    <Text className="ml-2 text-xs font-semibold text-white">
                        Nouveau Mouvement
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setShowParkings(true)}
                    className="w-11 h-11 rounded-xl bg-slate-800 items-center justify-center"
                    activeOpacity={0.9}
                >
                    <List size={18} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* New Movement Modal */}
            <Modal
                visible={showNew}
                animationType="slide"
                transparent
                onRequestClose={() => {
                    setShowNew(false);
                    resetForm();
                }}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-semibold text-slate-900">
                                Nouveau mouvement
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowNew(false);
                                    resetForm();
                                }}
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
                                    onFocus={() =>
                                        setFocusedLocationField("from")
                                    }
                                    placeholder="Ex: Zone A2"
                                    placeholderTextColor="#9CA3AF"
                                    className="h-11 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
                                />
                            </Field>
                            <Field label="Lieu arrivée">
                                <TextInput
                                    value={toLoc}
                                    onChangeText={setToLoc}
                                    onFocus={() =>
                                        setFocusedLocationField("to")
                                    }
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
                                    style={{
                                        textAlignVertical: "top",
                                        minHeight: 80,
                                    }}
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
                                            <RefreshCcw
                                                size={14}
                                                color="#059669"
                                            />
                                        )}
                                        <Text className="ml-1 text-[10px] font-medium text-emerald-700">
                                            Maj
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {coords ? (
                                    <Text className="text-[11px] text-slate-800">
                                        {coords.lat.toFixed(6)},{" "}
                                        {coords.lng.toFixed(6)}
                                    </Text>
                                ) : (
                                    <Text className="text-[11px] text-slate-400">
                                        Non disponible
                                    </Text>
                                )}
                            </View>
                            <View className="mt-6 flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() => {
                                        confirmMovement();
                                    }}
                                    disabled={!fromLoc || !toLoc}
                                    className={`flex-1 h-11 rounded-xl items-center justify-center ${!fromLoc || !toLoc ? "bg-emerald-300" : "bg-emerald-600"}`}
                                >
                                    <Text className="text-white text-xs font-semibold">
                                        Confirmer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowNew(false);
                                        resetForm();
                                    }}
                                    className="flex-1 h-11 rounded-xl bg-gray-200 items-center justify-center"
                                >
                                    <Text className="text-gray-700 text-xs font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowParkings(true)}
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

            {/* Parkings Modal */}
            <Modal
                visible={showParkings}
                animationType="fade"
                transparent
                onRequestClose={() => setShowParkings(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-semibold text-slate-900">
                                Parkings au Port
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowParkings(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            className="-mx-1"
                            contentContainerStyle={{ paddingBottom: 16 }}
                        >
                            {PARKINGS.map((p) => (
                                <TouchableOpacity
                                    key={p}
                                    onPress={() => {
                                        if (showNew && focusedLocationField) {
                                            if (focusedLocationField === "from")
                                                setFromLoc(p);
                                            else setToLoc(p);
                                        }
                                        setShowParkings(false);
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
        </View>
    );
}

// Reusable form field wrapper
function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View className="px-1 mb-4">
            <Text className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                {label}
            </Text>
            {children}
        </View>
    );
}
