import { Bot, Maximize2, Minimize2, RotateCcw, X } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
    isTyping: boolean;
    isMinimized: boolean;
    onToggleMinimize: () => void;
    onClose: () => void;
    onReset?: () => void;
}

export function ChatHeader({
    isTyping,
    isMinimized,
    onToggleMinimize,
    onClose,
    onReset,
}: Props) {
    return (
        <View className="flex-row justify-between items-center bg-emerald-600 px-4 py-3 rounded-t-2xl">
            <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                    <Bot color="#FFFFFF" size={20} />
                </View>
                <View>
                    <Text className="text-white text-base font-semibold">
                        Assistant SMMC
                    </Text>
                    <Text className="text-white/80 text-xs">
                        {isTyping ? "En train d'écrire..." : "En ligne"}
                    </Text>
                </View>
            </View>
            <View className="flex-row gap-2">
                {onReset && (
                    <TouchableOpacity
                        onPress={onReset}
                        className="w-8 h-8 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
                    >
                        <RotateCcw color="#FFFFFF" size={16} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={onToggleMinimize}
                    className="w-8 h-8 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
                >
                    {isMinimized ? (
                        <Maximize2 color="#FFFFFF" size={18} />
                    ) : (
                        <Minimize2 color="#FFFFFF" size={18} />
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
                >
                    <X color="#FFFFFF" size={18} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
