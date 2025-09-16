import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import {
    Calendar,
    Car,
    FileText,
    Palette,
    Settings,
} from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { useVehicleWorkflow } from "../hooks/use-vehicle-workflow";

export const VehicleInfoCard: React.FC = () => {
    const { discharge } = useVehicleWorkflow();
    const vin = useScannerStore((s) => s.vin || "VIN-INCONNU");
    return (
        <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
            <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                    <Settings size={20} color="#3b82f6" />
                </View>
                <Text className="text-slate-900 text-lg font-bold">
                    Informations
                </Text>
            </View>
            <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                <View className="flex-row items-center mb-2">
                    <FileText size={16} color="#64748b" />
                    <Text className="text-slate-600 text-sm font-medium ml-2">
                        VIN
                    </Text>
                </View>
                <Text className="text-slate-900 text-base font-mono tracking-wider">
                    {vin}
                </Text>
            </View>
            <View className="flex-row flex-wrap -mx-2">
                <View className="w-1/2 px-2 mb-3">
                    <View className="bg-slate-50 rounded-xl p-3">
                        <View className="flex-row items-center mb-1">
                            <Car size={14} color="#64748b" />
                            <Text className="text-slate-600 text-xs font-medium ml-1">
                                Marque
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-sm font-semibold">
                            {discharge?.vehicle?.make || "-"}
                        </Text>
                    </View>
                </View>
                <View className="w-1/2 px-2 mb-3">
                    <View className="bg-slate-50 rounded-xl p-3">
                        <View className="flex-row items-center mb-1">
                            <Settings size={14} color="#64748b" />
                            <Text className="text-slate-600 text-xs font-medium ml-1">
                                Modèl
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-sm font-semibold">
                            {discharge?.vehicle?.model || "-"}
                        </Text>
                    </View>
                </View>
                <View className="w-1/2 px-2 mb-3">
                    <View className="bg-slate-50 rounded-xl p-3">
                        <View className="flex-row items-center mb-1">
                            <Calendar size={14} color="#64748b" />
                            <Text className="text-slate-600 text-xs font-medium ml-1">
                                Année
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-sm font-semibold">
                            {discharge?.vehicle?.year || "—"}
                        </Text>
                    </View>
                </View>
                <View className="w-1/2 px-2 mb-3">
                    <View className="bg-slate-50 rounded-xl p-3">
                        <View className="flex-row items-center mb-1">
                            <Palette size={14} color="#64748b" />
                            <Text className="text-slate-600 text-xs font-medium ml-1">
                                Couleur
                            </Text>
                        </View>
                        <Text className="text-slate-900 text-sm font-semibold">
                            {discharge?.vehicle?.color || "—"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
