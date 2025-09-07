import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { MovementRecord } from "@/lib/store";
import { Clock3, MoveRight, Plus } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { formatRelative } from "../lib/format";

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
        <Accordion
            title={`Historique des mouvements (${movements.length})`}
            open={open}
            toggle={toggle}
        >
            {movements.length === 0 ? (
                <Text className="text-[11px] text-gray-400">
                    Aucun mouvement.
                </Text>
            ) : (
                <View className="space-y-3">
                    {movements.map((mv, idx) => (
                        <View key={mv.id} className="flex-row">
                            <View className="items-center mr-3">
                                <View className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
                                {idx < movements.length - 1 && (
                                    <View className="w-px flex-1 bg-gray-300 mt-1" />
                                )}
                            </View>
                            <View className="flex-1 p-3 rounded-xl border border-gray-200 bg-white">
                                <View className="flex-row items-center mb-1">
                                    <Clock3 size={12} color="#6B7280" />
                                    <Text className="ml-1 text-[10px] text-gray-500">
                                        {formatRelative(mv.at)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center mb-1">
                                    <Text
                                        className="text-xs font-semibold text-slate-900"
                                        numberOfLines={1}
                                    >
                                        {mv.from}
                                    </Text>
                                    <MoveRight
                                        size={14}
                                        color="#059669"
                                        style={{ marginHorizontal: 6 }}
                                    />
                                    <Text
                                        className="text-xs font-semibold text-slate-900"
                                        numberOfLines={1}
                                    >
                                        {mv.to}
                                    </Text>
                                </View>
                                {mv.reason ? (
                                    <Text
                                        className="text-[11px] text-gray-600"
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
                <View className="mt-4 space-y-3">
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
                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={() =>
                                addMovementRecord(from, to, reason, reset)
                            }
                            className="flex-1 h-10 rounded-lg bg-emerald-600 items-center justify-center"
                        >
                            <Text className="text-white text-xs font-semibold">
                                Enregistrer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setAdding(false)}
                            className="flex-1 h-10 rounded-lg bg-gray-200 items-center justify-center"
                        >
                            <Text className="text-gray-700 text-xs font-semibold">
                                Annuler
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => setAdding(true)}
                    className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
                >
                    <Plus size={16} color="#fff" />
                    <Text className="text-white text-xs font-semibold ml-2">
                        Ajouter mouvement
                    </Text>
                </TouchableOpacity>
            )}
        </Accordion>
    );
};
