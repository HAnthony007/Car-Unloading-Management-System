import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Props {
    onSelect: (text: string) => void;
    visible: boolean;
}

const DEFAULT_SUGGESTIONS = [
    "Statut véhicules",
    "Capacité zones",
    "Comment scanner ?",
    "Aide navigation",
];

export function Suggestions({ onSelect, visible }: Props) {
    if (!visible) return null;
    return (
        <View className="px-4 py-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="flex-row gap-2"
            >
                {DEFAULT_SUGGESTIONS.map((s) => (
                    <TouchableOpacity
                        key={s}
                        className="bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 active:bg-emerald-100"
                        onPress={() => onSelect(s)}
                    >
                        <Text className="text-emerald-600 text-xs font-medium">
                            {s}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
