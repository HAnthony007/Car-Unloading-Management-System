import { ChevronDown } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";

interface InspectionAccordionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    /** État contrôlé (si fourni) */
    open?: boolean;
    /** Valeur initiale (mode non contrôlé) */
    defaultOpen?: boolean;
    /** Callback sur changement */
    onOpenChange?: (open: boolean) => void;
    /** Désactive l'animation (instantané) */
    disableAnimation?: boolean;
}

export function InspectionAccordion({
    title,
    description,
    children,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disableAnimation = false,
}: InspectionAccordionProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const actualOpen =
        controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const [render, setRender] = useState(actualOpen);
    const anim = useState(new Animated.Value(actualOpen ? 1 : 0))[0];

    useEffect(() => {
        if (actualOpen) setRender(true);
        if (disableAnimation) {
            anim.setValue(actualOpen ? 1 : 0);
            if (!actualOpen) setRender(false);
            return;
        }
        Animated.timing(anim, {
            toValue: actualOpen ? 1 : 0,
            duration: 240,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished && !actualOpen) setRender(false);
        });
    }, [actualOpen, anim, disableAnimation]);

    const toggle = useCallback(() => {
        if (controlledOpen !== undefined) {
            onOpenChange?.(!controlledOpen);
        } else {
            setUncontrolledOpen((v) => {
                const next = !v;
                onOpenChange?.(next);
                return next;
            });
        }
    }, [controlledOpen, onOpenChange]);

    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    return (
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="px-5 py-4 flex-row items-center justify-between"
                activeOpacity={0.85}
            >
                <View className="flex-1 pr-4">
                    <Text className="text-sm font-semibold text-slate-900 mb-0.5">
                        {title}
                    </Text>
                    <Text
                        className="text-[10px] text-gray-500"
                        numberOfLines={2}
                    >
                        {description}
                    </Text>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronDown size={18} color="#374151" />
                </Animated.View>
            </TouchableOpacity>
            {render && (
                <Animated.View
                    style={{
                        maxHeight: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1200],
                        }),
                        opacity: anim,
                    }}
                >
                    <View className="h-px bg-gray-100 mx-5" />
                    <View className="px-5 py-4">{children}</View>
                </Animated.View>
            )}
        </View>
    );
}
