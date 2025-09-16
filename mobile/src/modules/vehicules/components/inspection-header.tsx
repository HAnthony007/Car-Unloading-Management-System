import { LinearGradient } from "expo-linear-gradient";
import { Car } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";

interface Props {
    completed: number;
    total: number;
    ok: number;
    defect: number;
    na: number;
    progress: number;
}

export const InspectionHeader: React.FC<Props> = ({
    completed,
    total,
    ok,
    defect,
    na,
    progress,
}) => {
    return (
        <LinearGradient
            colors={["#1e293b", "#334155"]}
            className="rounded-3xl p-6 shadow-lg"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mr-4">
                        <Car size={24} color="#ffffff" />
                    </View>
                    <View>
                        <Text className="text-white text-lg font-bold">
                            Inspection Véhicule
                        </Text>
                        <Text className="text-slate-300 text-sm">
                            {completed}/{total} éléments
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                    <Text className="text-white text-2xl font-bold">
                        {Math.round(progress)}%
                    </Text>
                    <Text className="text-slate-300 text-xs">Terminé</Text>
                </View>
            </View>
            <View className="bg-white/20 rounded-full h-2 mb-4">
                <View
                    className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full h-2"
                    style={{ width: `${progress}%` }}
                />
            </View>
            <View className="flex-row justify-between">
                <View className="items-center">
                    <Text className="text-emerald-400 text-lg font-bold">
                        {ok}
                    </Text>
                    <Text className="text-slate-300 text-xs">OK</Text>
                </View>
                <View className="items-center">
                    <Text className="text-amber-400 text-lg font-bold">
                        {defect}
                    </Text>
                    <Text className="text-slate-300 text-xs">Défauts</Text>
                </View>
                <View className="items-center">
                    <Text className="text-slate-400 text-lg font-bold">
                        {na}
                    </Text>
                    <Text className="text-slate-300 text-xs">N/A</Text>
                </View>
            </View>
        </LinearGradient>
    );
};
