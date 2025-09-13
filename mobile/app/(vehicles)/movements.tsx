import { LocationCard } from "@/src/modules/vehicules/components/location-card";
import { LocationHistoryAccordion } from "@/src/modules/vehicules/components/location-history-accordion";
import { NewMovementModal } from "@/src/modules/vehicules/components/new-movement-modal";
import { ParkingsModal } from "@/src/modules/vehicules/components/parkings-modal";
import { useMovements } from "@/src/modules/vehicules/hooks/use-movement";
import { LinearGradient } from "expo-linear-gradient";
import { List, Navigation, Plus, Route } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
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

    // Calculate movement statistics
    const movementStats = useMemo(() => {
        const totalMovements = movements.length;
        const todayMovements = movements.filter((m) => {
            const today = new Date();
            const movementDate = new Date(m.at);
            return movementDate.toDateString() === today.toDateString();
        }).length;

        const uniqueLocations = new Set([
            ...movements.map((m) => m.from),
            ...movements.map((m) => m.to),
        ]).size;

        return {
            totalMovements,
            todayMovements,
            uniqueLocations,
        };
    }, [movements]);
    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header with statistics */}
                <View className="px-6 pt-4 pb-6">
                    <LinearGradient
                        colors={["#1e293b", "#334155"]}
                        className="rounded-3xl p-6 shadow-lg"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mr-4">
                                    <Route size={24} color="#ffffff" />
                                </View>
                                <View>
                                    <Text className="text-white text-lg font-bold">
                                        Suivi des Mouvements
                                    </Text>
                                    <Text className="text-slate-300 text-sm">
                                        {vin
                                            ? `VIN: ${vin}`
                                            : "Aucun VIN actif"}
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white text-2xl font-bold">
                                    {movementStats.totalMovements}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Total
                                </Text>
                            </View>
                        </View>

                        {/* Stats grid */}
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="text-emerald-400 text-lg font-bold">
                                    {movementStats.todayMovements}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Aujourd&apos;hui
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-blue-400 text-lg font-bold">
                                    {movementStats.uniqueLocations}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Lieux
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-amber-400 text-lg font-bold">
                                    {movements.length > 0
                                        ? Math.round(
                                              (movementStats.todayMovements /
                                                  movementStats.totalMovements) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Actif
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Location Card */}
                <View className="px-6 mb-4">
                    <LocationCard
                        currentLocation={
                            movements.length > 0 ? movements[0].to : undefined
                        }
                        lastMovement={
                            movements.length > 0 ? movements[0] : undefined
                        }
                        coords={coords}
                    />
                </View>

                {/* Movements History Accordion */}
                <View className="px-6 mb-6">
                    <LocationHistoryAccordion movements={movements} vin={vin} />
                </View>

                {/* Empty State for No Movements */}
                {movements.length === 0 && (
                    <View className="px-6 mb-6">
                        <View className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 items-center">
                            <View className="w-20 h-20 bg-slate-100 rounded-3xl items-center justify-center mb-4">
                                <Navigation size={32} color="#94a3b8" />
                            </View>
                            <Text className="text-slate-600 text-lg font-medium mb-2">
                                Aucun mouvement enregistré
                            </Text>
                            <Text className="text-slate-500 text-sm text-center mb-6">
                                Commencez par enregistrer le premier déplacement
                                du véhicule
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    resetForm();
                                    setShowNew(true);
                                    requestLocation();
                                }}
                                className="px-6 py-3 bg-emerald-500 rounded-xl flex-row items-center"
                                activeOpacity={0.8}
                            >
                                <Plus size={16} color="#fff" />
                                <Text className="text-white text-sm font-semibold ml-2">
                                    Premier Mouvement
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Buttons */}
            <View className="absolute left-0 right-0 bottom-0 bg-white border-t border-slate-200 px-6 pt-4 pb-6">
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => {
                            resetForm();
                            setShowNew(true);
                            requestLocation();
                        }}
                        className="flex-1 h-14 rounded-2xl bg-emerald-500 flex-row items-center justify-center shadow-lg"
                        activeOpacity={0.8}
                        style={{
                            shadowColor: "#10b981",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <Plus size={20} color="#fff" />
                        <Text className="ml-2 text-sm font-semibold text-white">
                            Nouveau Mouvement
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setShowParkings(true)}
                        className="w-14 h-14 rounded-2xl bg-slate-700 items-center justify-center shadow-lg"
                        activeOpacity={0.8}
                        style={{
                            shadowColor: "#374151",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 8,
                        }}
                    >
                        <List size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
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
        </SafeAreaView>
    );
}
