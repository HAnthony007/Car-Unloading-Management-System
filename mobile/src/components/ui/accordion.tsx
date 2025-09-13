import { ChevronDown } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    LayoutAnimation,
    Platform,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from "react-native";

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
    // Enable LayoutAnimation on Android
    if (
        Platform.OS === "android" &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const progress = useState(new Animated.Value(open ? 1 : 0))[0];

    useEffect(() => {
        // Smooth layout expand/collapse (height) without manual height animation state bugs
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        Animated.timing(progress, {
            toValue: open ? 1 : 0,
            duration: 220,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true, // only rotating icon
        }).start();
    }, [open, progress]);

    const rotate = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="flex-row items-center justify-between px-4 h-12"
                activeOpacity={0.85}
            >
                <Text className="text-sm font-semibold text-slate-900">
                    {title}
                </Text>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronDown size={18} color="#374151" />
                </Animated.View>
            </TouchableOpacity>
            {open && (
                <View>
                    <View className="h-px bg-gray-100 mx-4" />
                    <View className="px-5 pb-5 pt-4 space-y-4">{children}</View>
                </View>
            )}
        </View>
    );
}
