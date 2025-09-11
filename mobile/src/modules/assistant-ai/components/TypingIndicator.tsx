import { Bot } from "lucide-react-native";
import React from "react";
import { View } from "react-native";

export function TypingIndicator() {
    return (
        <View className="mb-3 items-start">
            <View className="flex-row items-center mb-1 gap-1.5">
                <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                    <Bot color="#FFFFFF" size={12} />
                </View>
            </View>
            <View className="max-w-[80%] px-3 py-3 rounded-2xl bg-slate-100 rounded-bl-sm">
                <View className="flex-row gap-1">
                    <View className="w-1 h-1 rounded-full bg-slate-400" />
                    <View className="w-1 h-1 rounded-full bg-slate-400" />
                    <View className="w-1 h-1 rounded-full bg-slate-400" />
                </View>
            </View>
        </View>
    );
}
