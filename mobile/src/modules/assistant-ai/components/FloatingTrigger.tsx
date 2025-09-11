import { MessageCircle } from "lucide-react-native";
import React, { PropsWithChildren } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface Props {
    scaleAnim: Animated.Value;
    onPress: () => void;
    show: boolean;
}

export function FloatingTrigger({
    scaleAnim,
    onPress,
    show,
}: PropsWithChildren<Props>) {
    if (!show) return null;
    return (
        <Animated.View
            style={{
                transform: [{ scale: scaleAnim }],
                position: "absolute",
                bottom: 100,
                right: 20,
                zIndex: 1000,
                elevation: 8,
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                className="w-14 h-14 rounded-full bg-emerald-600 items-center justify-center shadow-lg"
            >
                <MessageCircle color="#FFFFFF" size={24} />
                <View className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-600 items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">!</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
