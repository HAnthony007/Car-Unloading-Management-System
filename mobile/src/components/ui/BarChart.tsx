import { useEffect, useRef } from "react";
import { Animated, Dimensions, Text, View } from "react-native";
import { cn } from "../../lib/utils";

interface DataPoint {
    label: string;
    value: number;
    color?: string;
}

interface BarChartProps {
    data: DataPoint[];
    height?: number;
    showValues?: boolean;
    maxValue?: number;
}

export function BarChart({
    data,
    height = 200,
    showValues = true,
    maxValue,
}: BarChartProps) {
    const screenWidth = Dimensions.get("window").width;
    const chartWidth = screenWidth - 64; // Account for padding
    const barWidth = (chartWidth - (data.length - 1) * 8) / data.length; // 8px gap between bars

    const max = maxValue || Math.max(...data.map((d) => d.value));

    // Animated values for each bar
    const animatedValuesRef = useRef<Animated.Value[]>([]);

    // Ensure we have an Animated.Value for each data point
    useEffect(() => {
        animatedValuesRef.current = data.map(
            (_, i) => animatedValuesRef.current[i] || new Animated.Value(0)
        );
    }, [data.length]);

    // Animate bars when data or dimensions change
    useEffect(() => {
        const animations = data.map((item, i) => {
            const targetHeight = Math.max(
                (max === 0 ? 0 : item.value / max) * (height - 40),
                4
            );
            return Animated.timing(animatedValuesRef.current[i], {
                toValue: targetHeight,
                duration: 600,
                useNativeDriver: false, // height is layout property
            });
        });

        // Stagger for nicer effect
        Animated.stagger(80, animations).start();
    }, [data, max, height]);

    return (
        <View className={cn("p-4")}>
            <View className={cn("justify-end")} style={{ height }}>
                <View className={cn("flex-row items-end justify-between")}>
                    {data.map((item, index) => {
                        const targetHeight = Math.max(
                            (max === 0 ? 0 : item.value / max) * (height - 40),
                            4
                        );
                        const animatedHeight =
                            animatedValuesRef.current[index] ||
                            new Animated.Value(targetHeight);

                        return (
                            <View
                                key={index}
                                className={cn("flex-1 items-center")}
                                style={{
                                    marginRight:
                                        index < data.length - 1 ? 8 : 0,
                                }}
                            >
                                <View
                                    className={cn(
                                        "items-center justify-end flex-1"
                                    )}
                                >
                                    {showValues && (
                                        <Animated.Text
                                            className={cn(
                                                "text-xs font-semibold text-slate-700 mb-1"
                                            )}
                                        >
                                            {item.value}
                                        </Animated.Text>
                                    )}
                                    <Animated.View
                                        style={{
                                            height: animatedHeight,
                                            width: barWidth,
                                            backgroundColor:
                                                item.color || "#059669",
                                            borderRadius: 8,
                                            minHeight: 4,
                                        }}
                                    />
                                </View>
                                <Text
                                    className={cn(
                                        "text-[10px] text-gray-500 mt-2 text-center"
                                    )}
                                    numberOfLines={1}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
