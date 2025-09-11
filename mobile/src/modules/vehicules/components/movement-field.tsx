import { ReactNode } from "react";
import { Text, View } from "react-native";

interface Props {
    label: string;
    children: ReactNode;
}
export const Field = ({ label, children }: Props) => (
    <View className="px-1 mb-4">
        <Text className="text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wide">
            {label}
        </Text>
        {children}
    </View>
);
