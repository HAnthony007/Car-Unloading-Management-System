import { ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";

export function Accordion({
    title,
    children,
    open,
    toggle,
}: {
    title: string;
    children: React.ReactNode;
    open: boolean;
    toggle: () => void;
}) {
    const [renderContent, setRenderContent] = useState(open);
    const progress = useState(new Animated.Value(open ? 1 : 0))[0];

    useEffect(() => {
        if (open) {
            setRenderContent(true);
        }
        Animated.timing(progress, {
            toValue: open ? 1 : 0,
            duration: 260,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false, // height & padding need false
        }).start(({ finished }) => {
            if (finished && !open) setRenderContent(false);
        });
    }, [open, progress]);

    const rotate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const contentHeight = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1], // will multiply by auto height using opacity & pointerEvents
    });

    const opacity = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <TouchableOpacity
                onPress={() => toggle()}
                className="flex-row items-center justify-between px-4 h-12"
                activeOpacity={0.85}
            >
                <Text className="text-sm font-semibold text-slate-900">
                    {title}
                </Text>
                <Animated.View
                    style={{
                        transform: [{ rotate }],
                    }}
                >
                    <ChevronDown size={18} color="#374151" />
                </Animated.View>
            </TouchableOpacity>
            {renderContent && (
                <Animated.View
                    style={{
                        opacity,
                        maxHeight: progress.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 600], // large max height to allow expansion
                        }),
                    }}
                >
                    <View className="h-px bg-gray-100 mx-4" />
                    <View className="px-5 pb-5 pt-4 space-y-4">{children}</View>
                </Animated.View>
            )}
        </View>
    );
}
