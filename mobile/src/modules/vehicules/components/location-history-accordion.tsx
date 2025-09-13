import { Activity, ChevronDown, History } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MovementRecord } from "../../scanner/stores/scanner-store";
import { MovementItem } from "./movement-item";

interface Props {
    movements: MovementRecord[];
    vin?: string | null;
}

export const LocationHistoryAccordion = ({ movements, vin }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    // Calculer les statistiques des mouvements
    const movementStats = {
        total: movements.length,
        today: movements.filter((m) => {
            const today = new Date();
            const movementDate = new Date(m.at);
            return movementDate.toDateString() === today.toDateString();
        }).length,
        uniqueLocations: new Set([
            ...movements.map((m) => m.from),
            ...movements.map((m) => m.to),
        ]).size,
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="px-6 py-4 flex-row items-center justify-between"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center mr-4">
                        <History size={20} color="#8b5cf6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-900 text-lg font-bold">
                            Historique des Mouvements
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <Text className="text-slate-600 text-sm">
                                {movementStats.total} mouvement
                                {movementStats.total > 1 ? "s" : ""}
                            </Text>
                            {vin && (
                                <>
                                    <Text className="text-slate-400 text-sm mx-2">
                                        •
                                    </Text>
                                    <Text className="text-slate-600 text-sm">
                                        VIN: {vin}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center">
                    {/* Stats mini indicators */}
                    <View className="flex-row items-center mr-3 space-x-2">
                        <View className="bg-emerald-100 px-2 py-1 rounded-lg">
                            <Text className="text-emerald-700 text-xs font-semibold">
                                {movementStats.today}
                            </Text>
                        </View>
                        <View className="bg-blue-100 px-2 py-1 rounded-lg">
                            <Text className="text-blue-700 text-xs font-semibold">
                                {movementStats.uniqueLocations}
                            </Text>
                        </View>
                    </View>

                    {/* Chevron */}
                    <View className="w-8 h-8 bg-slate-100 rounded-full items-center justify-center">
                        <ChevronDown
                            size={16}
                            color="#64748b"
                            style={{
                                transform: [
                                    { rotate: isOpen ? "180deg" : "0deg" },
                                ],
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>

            {isOpen && (
                <View>
                    <View className="h-px bg-slate-100 mx-6" />

                    {movements.length === 0 ? (
                        <View className="px-6 py-8">
                            <View className="bg-slate-50 rounded-2xl p-8 items-center">
                                <View className="w-16 h-16 bg-slate-200 rounded-3xl items-center justify-center mb-4">
                                    <Activity size={24} color="#94a3b8" />
                                </View>
                                <Text className="text-slate-600 text-base font-medium mb-2">
                                    Aucun mouvement enregistré
                                </Text>
                                <Text className="text-slate-500 text-sm text-center">
                                    L'historique des déplacements apparaîtra ici
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View className="px-6 py-4">
                            {/* Quick Stats */}
                            <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                                <View className="flex-row justify-between">
                                    <View className="items-center">
                                        <Text className="text-emerald-600 text-lg font-bold">
                                            {movementStats.today}
                                        </Text>
                                        <Text className="text-slate-600 text-xs">
                                            Aujourd'hui
                                        </Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-blue-600 text-lg font-bold">
                                            {movementStats.uniqueLocations}
                                        </Text>
                                        <Text className="text-slate-600 text-xs">
                                            Lieux uniques
                                        </Text>
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-purple-600 text-lg font-bold">
                                            {movementStats.total}
                                        </Text>
                                        <Text className="text-slate-600 text-xs">
                                            Total
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Movements List */}
                            <View className="space-y-4">
                                {movements.map((item, index) => (
                                    <MovementItem
                                        key={item.id}
                                        item={item}
                                        index={index}
                                        total={movements.length}
                                    />
                                ))}
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};
