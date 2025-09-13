import { Input } from "@/src/components/ui/input";
import { Clock3, MoveRight, Plus, Route } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MovementRecord } from "../../scanner/stores/scanner-store";
import { formatRelative } from "../lib/format-relative";

interface Props {
    open: boolean;
    toggle: () => void;
    movements: MovementRecord[];
    addMovementRecord: (
        from: string,
        to: string,
        reason: string,
        reset: () => void
    ) => void;
}

export const MovementsAccordion = ({
    open,
    toggle,
    movements,
    addMovementRecord,
}: Props) => {
    const [adding, setAdding] = useState(false);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [reason, setReason] = useState("");

    const reset = () => {
        setReason("");
        setFrom(to);
        setTo("");
        setAdding(false);
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="px-6 py-4 flex-row items-center justify-between"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                        <Route size={16} color="#8b5cf6" />
                    </View>
                    <View>
                        <Text className="text-slate-900 text-base font-bold">
                            Historique des Mouvements
                        </Text>
                        <Text className="text-slate-600 text-sm">
                            {movements.length} mouvement
                            {movements.length > 1 ? "s" : ""}
                        </Text>
                    </View>
                </View>
                <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                    <Text className="text-slate-600 text-sm font-bold">
                        {open ? "−" : "+"}
                    </Text>
                </View>
            </TouchableOpacity>

            {open && (
                <View className="px-6 pb-6">
                    <View className="h-px bg-slate-100 mb-4" />
                    {movements.length === 0 ? (
                        <View className="bg-slate-50 rounded-xl p-6 items-center">
                            <Route size={32} color="#94a3b8" />
                            <Text className="text-slate-500 text-sm font-medium mt-2">
                                Aucun mouvement
                            </Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">
                                Enregistrez les déplacements du véhicule
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {movements.map((mv, idx) => (
                                <View key={mv.id} className="flex-row">
                                    <View className="items-center mr-4">
                                        <View className="w-4 h-4 rounded-full bg-emerald-500 mt-2" />
                                        {idx < movements.length - 1 && (
                                            <View className="w-px flex-1 bg-slate-300 mt-2" />
                                        )}
                                    </View>
                                    <View className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <View className="flex-row items-center mb-2">
                                            <Clock3 size={14} color="#64748b" />
                                            <Text className="ml-2 text-xs text-slate-500">
                                                {formatRelative(mv.at)}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center mb-2">
                                            <Text
                                                className="text-sm font-semibold text-slate-900"
                                                numberOfLines={1}
                                            >
                                                {mv.from}
                                            </Text>
                                            <MoveRight
                                                size={16}
                                                color="#10b981"
                                                style={{ marginHorizontal: 8 }}
                                            />
                                            <Text
                                                className="text-sm font-semibold text-slate-900"
                                                numberOfLines={1}
                                            >
                                                {mv.to}
                                            </Text>
                                        </View>
                                        {mv.reason ? (
                                            <Text
                                                className="text-xs text-slate-600"
                                                numberOfLines={2}
                                            >
                                                {mv.reason}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {adding ? (
                        <View className="mt-4 space-y-4">
                            <View className="bg-slate-50 rounded-xl p-4">
                                <Text className="text-slate-600 text-sm font-medium mb-3">
                                    Nouveau Mouvement
                                </Text>
                                <View className="space-y-3">
                                    <Input
                                        label="De"
                                        value={from}
                                        onChangeText={setFrom}
                                        placeholder="Zone A2"
                                    />
                                    <Input
                                        label="Vers"
                                        value={to}
                                        onChangeText={setTo}
                                        placeholder="Zone B1"
                                    />
                                    <Input
                                        label="Raison"
                                        value={reason}
                                        onChangeText={setReason}
                                        placeholder="Réorganisation"
                                    />
                                </View>
                            </View>
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={() =>
                                        addMovementRecord(
                                            from,
                                            to,
                                            reason,
                                            reset
                                        )
                                    }
                                    className="flex-1 h-12 rounded-xl bg-emerald-500 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-sm font-semibold">
                                        Enregistrer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAdding(false)}
                                    className="flex-1 h-12 rounded-xl bg-slate-200 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-slate-700 text-sm font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setAdding(true)}
                            className="mt-4 flex-row items-center justify-center px-4 py-3 rounded-xl bg-emerald-500"
                            activeOpacity={0.8}
                        >
                            <Plus size={16} color="#fff" />
                            <Text className="text-white text-sm font-semibold ml-2">
                                Ajouter un mouvement
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
