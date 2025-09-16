import { LinearGradient } from "expo-linear-gradient";
import { Loader2, PlayCircle, RefreshCw } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface Props {
    loading: boolean;
    starting: boolean;
    error: string | null;
    onStart: (force?: boolean) => void;
    hasDischarge: boolean;
}

export const StartInspectionCard: React.FC<Props> = ({
    loading,
    starting,
    error,
    onStart,
    hasDischarge,
}) => {
    return (
        <LinearGradient
            colors={["#1e293b", "#334155"]}
            className="rounded-3xl p-6 shadow-lg"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <Text className="text-white text-xl font-bold mb-2">
                Inspection
            </Text>
            {loading ? (
                <View className="flex-row items-center">
                    <ActivityIndicator color="#fff" />
                    <Text className="text-slate-300 ml-3">
                        Vérification de l&apos;inspection...
                    </Text>
                </View>
            ) : hasDischarge ? (
                <View>
                    <Text className="text-slate-300 mb-4">
                        Aucune inspection initialisée pour ce discharge. Lancez
                        l&apos;inspection pour commencer.
                    </Text>
                    {error && (
                        <Text className="text-red-300 text-xs mb-2">
                            {error}
                        </Text>
                    )}
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            disabled={starting}
                            onPress={() => onStart(false)}
                            className="flex-row items-center bg-emerald-500 rounded-full px-5 py-3"
                            activeOpacity={0.8}
                        >
                            {starting ? (
                                <Loader2 size={18} color="#fff" />
                            ) : (
                                <PlayCircle size={18} color="#fff" />
                            )}
                            <Text className="text-white font-semibold ml-2">
                                Démarrer
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={starting}
                            onPress={() => onStart(true)}
                            className="flex-row items-center bg-amber-500 rounded-full px-5 py-3"
                            activeOpacity={0.8}
                        >
                            {starting ? (
                                <Loader2 size={18} color="#fff" />
                            ) : (
                                <RefreshCw size={18} color="#fff" />
                            )}
                            <Text className="text-white font-semibold ml-2">
                                Forcer
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text className="text-slate-300">
                    Aucun discharge sélectionné.
                </Text>
            )}
        </LinearGradient>
    );
};
