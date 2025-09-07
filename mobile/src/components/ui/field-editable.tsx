import { Text, TextInput, View } from "react-native";

export function EditableField({
    label,
    value,
    onChange,
    keyboardType,
    placeholder,
}: {
    label: string;
    value?: string;
    onChange: (v: string) => void;
    keyboardType?: any;
    placeholder?: string;
}) {
    return (
        <View>
            <Text className="text-[11px] font-medium text-gray-500 mb-1">
                {label}
            </Text>
            <TextInput
                value={value || ""}
                onChangeText={onChange}
                placeholder={placeholder || label}
                placeholderTextColor="#9CA3AF"
                keyboardType={keyboardType}
                className="h-10 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs text-slate-900"
            />
        </View>
    );
}
