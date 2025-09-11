import { Badge } from "@/src/components/ui/badge";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    inspectionCondition?: string;
    movementsCount: number;
    imagesCount: number;
    documentsCount: number;
    vehicleCondition: string;
    setVehicleCondition: (v: string) => void;
    inspectionNotes: string;
    setInspectionNotes: (v: string) => void;
    saveInspection: () => void;
}

const CONDITION_OPTIONS = ["Neuf", "Occasion", "Endommagé", "Réparé"];

export const StatusSection = ({
    inspectionCondition,
    movementsCount,
    imagesCount,
    documentsCount,
    vehicleCondition,
    setVehicleCondition,
    inspectionNotes,
    setInspectionNotes,
    saveInspection,
}: Props) => (
    <View>
        <View className="flex-row flex-wrap -m-1 mb-3">
            <Badge
                label="Inspection"
                value={inspectionCondition || "À définir"}
            />
            <Badge label="Mouvements" value={`${movementsCount}`} tone="blue" />
            <Badge label="Photos" value={`${imagesCount}/5`} tone="amber" />
            <Badge label="Docs" value={`${documentsCount}`} tone="violet" />
        </View>
        <Text className="text-[11px] font-medium text-gray-500 mb-1">
            Mise à jour Inspection
        </Text>
        <View className="flex-row flex-wrap gap-2 mb-3">
            {CONDITION_OPTIONS.map((opt) => (
                <TouchableOpacity
                    key={opt}
                    onPress={() => setVehicleCondition(opt)}
                    className={`px-3 h-8 rounded-full border items-center justify-center ${vehicleCondition === opt ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-300"}`}
                >
                    <Text
                        className={`text-[11px] font-medium ${vehicleCondition === opt ? "text-white" : "text-gray-600"}`}
                    >
                        {opt}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
        <TextInput
            value={inspectionNotes}
            onChangeText={setInspectionNotes}
            placeholder="Notes inspection..."
            placeholderTextColor="#9CA3AF"
            multiline
            className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-slate-900 bg-gray-50"
            style={{ textAlignVertical: "top", minHeight: 90 }}
        />
        <TouchableOpacity
            onPress={saveInspection}
            className="mt-3 self-start px-4 h-10 rounded-lg bg-emerald-600 items-center justify-center"
        >
            <Text className="text-white text-xs font-semibold">
                Sauvegarder
            </Text>
        </TouchableOpacity>
    </View>
);
