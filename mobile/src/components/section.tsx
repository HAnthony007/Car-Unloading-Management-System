import { Text, View } from "react-native";

export function Section({
    children,
    title,
}: {
    children: React.ReactNode;
    title: string;
}) {
    return (
        <View className="mb-6">
            <Text className="text-sm font-semibold text-slate-900 mb-3">
                {title}
            </Text>
            <View className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                {children}
            </View>
        </View>
    );
}
