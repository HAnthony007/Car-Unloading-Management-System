import { ChevronDown, Ship, X } from "lucide-react-native";
import { useState } from "react";
import {
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useScannerStore } from "../stores/scanner-store";
import { PortCallItem } from "./portcall-selector";

interface ScanHeaderProps {
    portCalls?: PortCallItem[];
}

export function ScanHeader({ portCalls = [] }: ScanHeaderProps) {
    const selected = useScannerStore((s) => s.selectedPortCall);
    const setSelected = useScannerStore((s) => s.setSelectedPortCall);
    const [open, setOpen] = useState(false);
    const active = portCalls.find((p) => p.id === selected) || null;

    return (
        <View className="bg-white border-b border-gray-200">
            <View className="px-4 pt-4 pb-3">
                <Text className="text-lg font-semibold text-gray-900 mb-1">
                    Scanner QR/Code-barres
                </Text>
                <Text className="text-sm text-gray-500">
                    Scannez les documents véhicules
                </Text>
            </View>
            <View className="px-4 pb-4">
                <Pressable
                    onPress={() => setOpen(true)}
                    className={`flex-row items-center rounded-xl px-4 py-3 border ${active ? "border-emerald-300 bg-emerald-50/60" : "border-gray-300 bg-gray-50"}`}
                >
                    <View className="w-9 h-9 rounded-lg bg-emerald-500 items-center justify-center mr-3">
                        <Ship size={18} color="#fff" />
                    </View>
                    <View className="flex-1">
                        <Text
                            className="text-[13px] font-semibold text-gray-900"
                            numberOfLines={1}
                        >
                            {active
                                ? active.vessel
                                : "Sélectionner un port call"}
                        </Text>
                        <Text
                            className="text-[11px] text-gray-500"
                            numberOfLines={1}
                        >
                            {active
                                ? `${active.terminal} • ETA ${new Date(active.eta).toLocaleDateString(undefined, { day: "2-digit", month: "short" })}`
                                : "Filtrer vos scans par escale"}
                        </Text>
                    </View>
                    <ChevronDown size={18} color="#374151" />
                </Pressable>
            </View>

            {/* Modal sélection port call */}
            <Modal
                visible={open}
                transparent
                animationType="fade"
                onRequestClose={() => setOpen(false)}
            >
                <View className="flex-1 bg-black/40 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-base font-semibold text-slate-900">
                                Sélection Port Call
                            </Text>
                            <TouchableOpacity
                                onPress={() => setOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <X size={18} color="#374151" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            className="-mx-1"
                            contentContainerStyle={{ paddingBottom: 20 }}
                        >
                            {portCalls.map((pc) => {
                                const isActive = pc.id === selected;
                                return (
                                    <TouchableOpacity
                                        key={pc.id}
                                        onPress={() => {
                                            setSelected(pc.id);
                                            setOpen(false);
                                        }}
                                        className={`px-4 py-3 mx-1 mb-2 rounded-xl border ${isActive ? "border-emerald-500 bg-emerald-50" : "border-gray-200 bg-gray-50"} active:bg-emerald-50`}
                                        activeOpacity={0.85}
                                    >
                                        <View className="flex-row items-center">
                                            <View className="w-10 h-10 rounded-lg bg-emerald-500 items-center justify-center mr-3">
                                                <Ship size={20} color="#fff" />
                                            </View>
                                            <View className="flex-1">
                                                <Text
                                                    className="text-[13px] font-semibold text-slate-900"
                                                    numberOfLines={1}
                                                >
                                                    {pc.vessel}
                                                </Text>
                                                <Text
                                                    className="text-[11px] text-gray-500"
                                                    numberOfLines={1}
                                                >
                                                    {pc.terminal} • ETA{" "}
                                                    {new Date(
                                                        pc.eta
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                        }
                                                    )}
                                                </Text>
                                                {pc.reference && (
                                                    <Text
                                                        className="text-[10px] text-gray-400 mt-0.5"
                                                        numberOfLines={1}
                                                    >
                                                        Ref: {pc.reference}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            {portCalls.length === 0 && (
                                <View className="px-4 py-6 items-center">
                                    <Text className="text-sm text-gray-500">
                                        Aucune escale disponible
                                    </Text>
                                </View>
                            )}
                            {selected && (
                                <TouchableOpacity
                                    onPress={() => setSelected(null)}
                                    className="px-4 py-3 mx-1 mt-2 rounded-xl border border-red-200 bg-red-50"
                                >
                                    <Text className="text-[12px] font-medium text-red-600">
                                        Effacer la sélection
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
