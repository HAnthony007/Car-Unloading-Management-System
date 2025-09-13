import { ChevronDown } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
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

    const [render, setRender] = useState(defaultOpen);
    const anim = useState(new Animated.Value(defaultOpen ? 1 : 0))[0];

    useEffect(() => {
        if (actualOpen) setRender(true);
        if (disableAnimation) {
            anim.setValue(actualOpen ? 1 : 0);
            if (!actualOpen) setRender(false);
            return;
        }
        Animated.timing(anim, {
            toValue: actualOpen ? 1 : 0,
            duration: 300,
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
        <View className="rounded-3xl border border-slate-200 bg-white shadow-lg overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="px-6 py-5 flex-row items-center justify-between"
                activeOpacity={0.7}
                style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                }}
            >
                <View className="flex-1 pr-4">
                    <Text className="text-base font-bold text-slate-900 mb-1">
                        {title}
                    </Text>
                    <Text
                        className="text-sm text-slate-600 leading-5"
                        numberOfLines={2}
                    >
                        {description}
                    </Text>
                </View>
                <Animated.View
                    style={{
                        transform: [{ rotate }],
                        backgroundColor: actualOpen ? "#f1f5f9" : "#f8fafc",
                        borderRadius: 20,
                        padding: 8,
                    }}
                >
                    <ChevronDown
                        size={20}
                        color={actualOpen ? "#475569" : "#94a3b8"}
                    />
                </Animated.View>
            </TouchableOpacity>
            {render && (
                <Animated.View
                    style={{
                        maxHeight: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 2000],
                        }),
                        opacity: anim,
                    }}
                >
                    <View className="h-px bg-slate-100 mx-6" />
                    <View className="px-6 py-5">{children}</View>
                </Animated.View>
            )}
        </View>
    );
}
