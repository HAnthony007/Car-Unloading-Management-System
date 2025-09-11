import Animated from "react-native-reanimated";

export function HelloWave() {
    return (
        <Animated.Text
            className="text-[28px] leading-8 -mt-1.5"
            style={{
                // Dynamic animation kept inline (non-Tailwind)
                animationName: {
                    "50%": { transform: [{ rotate: "25deg" }] },
                },
                animationIterationCount: 4,
                animationDuration: "300ms",
            }}
        >
            👋
        </Animated.Text>
    );
}
