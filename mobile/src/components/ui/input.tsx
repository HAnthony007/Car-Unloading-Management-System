import { Text, TextInput, View } from "react-native";

export function Input({ label, multiline, ...rest }: any) {
    return (
        <View>
            <Text className="text-[11px] font-medium text-gray-500 mb-1">
                {label}
            </Text>
            <TextInput
                {...rest}
                multiline={multiline}
                style={
                    multiline
                        ? { textAlignVertical: "top", minHeight: 80 }
                        : undefined
                }
                placeholderTextColor="#9CA3AF"
                className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
            />
        </View>
    );
}
