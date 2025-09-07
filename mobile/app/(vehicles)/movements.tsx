import { MovementItem } from "@/features/vehicles/movements/components/MovementItem";
import { NewMovementModal } from "@/features/vehicles/movements/components/NewMovementModal";
import { ParkingsModal } from "@/features/vehicles/movements/components/ParkingsModal";
import { useMovements } from "@/features/vehicles/movements/hooks/useMovements";
import { List, Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MovementsScreen() {
    const {
        movements,
        vin,
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
        focusedLocationField,
        setFocusedLocationField,
        resetForm,
        confirmMovement,
        requestLocation,
        PARKINGS,
    } = useMovements();

    const [showNew, setShowNew] = useState(false);
    const [showParkings, setShowParkings] = useState(false);
    return (
        <SafeAreaView className="flex-1 bg-slate-50">
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
                        contentContainerStyle={{
                            padding: 20,
                            paddingBottom: 80,
                        }}
                        ItemSeparatorComponent={() => <View className="h-4" />}
                        renderItem={({ item, index }) => (
                            <MovementItem
                                item={item}
                                index={index}
                                total={movements.length}
                            />
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
                <NewMovementModal
                    visible={showNew}
                    onClose={() => {
                        setShowNew(false);
                        resetForm();
                    }}
                    title={title}
                    setTitle={setTitle}
                    fromLoc={fromLoc}
                    setFromLoc={setFromLoc}
                    toLoc={toLoc}
                    setToLoc={setToLoc}
                    note={note}
                    setNote={setNote}
                    coords={coords}
                    loadingLoc={loadingLoc}
                    requestLocation={requestLocation}
                    confirmMovement={() => {
                        confirmMovement();
                        setShowNew(false);
                    }}
                    disabledConfirm={!fromLoc || !toLoc}
                    openParkings={() => setShowParkings(true)}
                    setFocusedLocationField={setFocusedLocationField}
                />

                {/* Parkings Modal */}
                <ParkingsModal
                    visible={showParkings}
                    onClose={() => setShowParkings(false)}
                    parkings={PARKINGS}
                    onSelect={(p) => {
                        if (showNew && focusedLocationField) {
                            if (focusedLocationField === "from") setFromLoc(p);
                            else setToLoc(p);
                        }
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
