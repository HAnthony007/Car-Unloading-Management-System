import { LocationCard } from "@/src/modules/vehicules/components/location-card";
import { LocationHistoryAccordion } from "@/src/modules/vehicules/components/location-history-accordion";
import { NewMovementModal } from "@/src/modules/vehicules/components/new-movement-modal";
import { ParkingsModal } from "@/src/modules/vehicules/components/parkings-modal";
import { useMovements } from "@/src/modules/vehicules/hooks/use-movement";
import { LinearGradient } from "expo-linear-gradient";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { GoogleMapsMapType } from "expo-maps/build/google/GoogleMaps.types";
import { List, Navigation, Plus, Route } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
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
        parkingNumber,
        setParkingNumber,
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
    const [todayOnly, setTodayOnly] = useState(false);

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
    const mahasarikaSelected =
        /mahasarika/i.test(fromLoc) || /mahasarika/i.test(toLoc);

    // Static history polyline path around Toamasina (user-provided)
    const historyPath = [
        { latitude: -18.156167, longitude: 49.424611 },
        { latitude: -18.154972, longitude: 49.426389 },
        { latitude: -18.158667, longitude: 49.426111 },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Top Map showing current and historical positions */}
            <View
                style={{ height: 300 }}
                className="mx-6 mt-4 mb-2 overflow-hidden rounded-3xl border border-slate-200 shadow"
            >
                {Platform.OS === "ios" ? (
                    <AppleMaps.View
                        style={{ flex: 1 }}
                        cameraPosition={{
                            coordinates: coords
                                ? {
                                      latitude: coords.lat,
                                      longitude: coords.lng,
                                  }
                                : {
                                      latitude: -18.157444,
                                      longitude: 49.425083,
                                  },
                            zoom: 15.5,
                        }}
                        markers={[
                            ...(coords
                                ? [
                                      {
                                          coordinates: {
                                              latitude: coords.lat,
                                              longitude: coords.lng,
                                          },
                                          title: "Position actuelle",
                                      },
                                  ]
                                : []),
                            ...(todayOnly
                                ? movements.filter((m) => {
                                      const today = new Date();
                                      const d = new Date(m.at);
                                      return (
                                          d.toDateString() ===
                                          today.toDateString()
                                      );
                                  })
                                : movements
                            )
                                .filter((m) => m.coordsTo)
                                .slice(0, 10)
                                .map((m) => ({
                                    coordinates: {
                                        latitude: m.coordsTo!.lat,
                                        longitude: m.coordsTo!.lng,
                                    },
                                    title: m.title || `${m.from} → ${m.to}`,
                                })),
                        ]}
                        polylines={[
                            // ...(todayOnly
                            //     ? movements.filter((m) => {
                            //           const today = new Date();
                            //           const d = new Date(m.at);
                            //           return (
                            //               d.toDateString() ===
                            //               today.toDateString()
                            //           );
                            //       })
                            //     : movements
                            // )
                            //     .filter((m) => m.coordsFrom && m.coordsTo)
                            //     .map((m) => ({
                            //         coordinates: [
                            //             {
                            //                 latitude: m.coordsFrom!.lat,
                            //                 longitude: m.coordsFrom!.lng,
                            //             },
                            //             {
                            //                 latitude: m.coordsTo!.lat,
                            //                 longitude: m.coordsTo!.lng,
                            //             },
                            //         ],
                            //     })),
                            { coordinates: historyPath },
                        ]}
                        // polygons={[
                        //     // Approx Mahasarika zone
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1583, longitude: 49.4244 },
                        //             { latitude: -18.1588, longitude: 49.4262 },
                        //             { latitude: -18.1569, longitude: 49.4266 },
                        //             { latitude: -18.1565, longitude: 49.425 },
                        //         ],
                        //     },
                        //     // Zone A rectangle approx
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1596, longitude: 49.4246 },
                        //             { latitude: -18.16, longitude: 49.426 },
                        //             { latitude: -18.1588, longitude: 49.4263 },
                        //             { latitude: -18.1584, longitude: 49.4249 },
                        //         ],
                        //     },
                        //     // Zone B rectangle approx
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1572, longitude: 49.4239 },
                        //             { latitude: -18.1577, longitude: 49.4256 },
                        //             { latitude: -18.1564, longitude: 49.4259 },
                        //             { latitude: -18.1559, longitude: 49.4242 },
                        //         ],
                        //     },
                        // ]}
                    />
                ) : Platform.OS === "android" ? (
                    <GoogleMaps.View
                        properties={{ mapType: GoogleMapsMapType.SATELLITE }}
                        style={{ flex: 1 }}
                        cameraPosition={{
                            coordinates: coords
                                ? {
                                      latitude: coords.lat,
                                      longitude: coords.lng,
                                  }
                                : {
                                      latitude: -18.157444,
                                      longitude: 49.425083,
                                  },
                            zoom: 15.5,
                        }}
                        markers={[
                            ...(coords
                                ? [
                                      {
                                          coordinates: {
                                              latitude: coords.lat,
                                              longitude: coords.lng,
                                          },
                                          title: "Position actuelle",
                                      },
                                  ]
                                : []),
                            // ...movements
                            //     .filter((m) => m.coordsTo)
                            //     .slice(0, 10)
                            //     .map((m) => ({
                            //         coordinates: {
                            //             latitude: m.coordsTo!.lat,
                            //             longitude: m.coordsTo!.lng,
                            //         },
                            //         title: m.title || `${m.from} → ${m.to}`,
                            //     })),
                            {
                                coordinates: historyPath[2],
                                title: "Vehicules actuelle",
                            },
                        ]}
                        polylines={[
                            // ...movements
                            //     .filter((m) => m.coordsFrom && m.coordsTo)
                            //     .map((m) => ({
                            //         coordinates: [
                            //             {
                            //                 latitude: m.coordsFrom!.lat,
                            //                 longitude: m.coordsFrom!.lng,
                            //             },
                            //             {
                            //                 latitude: m.coordsTo!.lat,
                            //                 longitude: m.coordsTo!.lng,
                            //             },
                            //         ],
                            //     })),
                            { coordinates: historyPath },
                        ]}
                        // polygons={[
                        //     // Approx Mahasarika zone
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1583, longitude: 49.4244 },
                        //             { latitude: -18.1588, longitude: 49.4262 },
                        //             { latitude: -18.1569, longitude: 49.4266 },
                        //             { latitude: -18.1565, longitude: 49.4250 },
                        //         ],
                        //     },
                        //     // Zone A rectangle approx
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1596, longitude: 49.4246 },
                        //             { latitude: -18.1600, longitude: 49.4260 },
                        //             { latitude: -18.1588, longitude: 49.4263 },
                        //             { latitude: -18.1584, longitude: 49.4249 },
                        //         ],
                        //     },
                        //     // Zone B rectangle approx
                        //     {
                        //         coordinates: [
                        //             { latitude: -18.1572, longitude: 49.4239 },
                        //             { latitude: -18.1577, longitude: 49.4256 },
                        //             { latitude: -18.1564, longitude: 49.4259 },
                        //             { latitude: -18.1559, longitude: 49.4242 },
                        //         ],
                        //     },
                        // ]}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center bg-slate-100">
                        <Text>Maps not supported</Text>
                    </View>
                )}
            </View>
            {/* Toggle bar under the map */}
            <View className="mx-6 mb-2 flex-row items-center justify-between">
                <Text className="text-slate-600 text-xs">Filtrer la carte</Text>
                <TouchableOpacity
                    onPress={() => setTodayOnly((v) => !v)}
                    className={`px-3 py-2 rounded-xl border ${
                        todayOnly
                            ? "bg-emerald-50 border-emerald-300"
                            : "bg-white border-slate-200"
                    }`}
                    activeOpacity={0.8}
                >
                    <Text
                        className={
                            todayOnly
                                ? "text-emerald-700 text-xs font-semibold"
                                : "text-slate-700 text-xs"
                        }
                    >
                        {todayOnly
                            ? "Aujourd'hui seulement"
                            : "Tout l'historique"}
                    </Text>
                </TouchableOpacity>
            </View>

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
                parkingNumber={parkingNumber}
                setParkingNumber={setParkingNumber}
                coords={coords}
                loadingLoc={loadingLoc}
                requestLocation={requestLocation}
                confirmMovement={() => {
                    confirmMovement();
                    setShowNew(false);
                }}
                disabledConfirm={
                    !fromLoc || !toLoc || (mahasarikaSelected && !parkingNumber)
                }
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
                        if (!/mahasarika/i.test(p)) {
                            setParkingNumber("");
                        }
                    }
                }}
            />
        </SafeAreaView>
    );
}
