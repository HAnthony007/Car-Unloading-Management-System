import { clsx } from "clsx";
import { Send } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface Props {
    value: string;
    onChange: (t: string) => void;
    onSend: () => void;
}

export function InputBar({ value, onChange, onSend }: Props) {
    const canSend = value.trim().length > 0;
    return (
        <View className="px-4 py-3 border-t border-slate-200">
            <View className="flex-row items-end bg-slate-50 rounded-2xl px-1 py-1 gap-2">
                <TextInput
                    className="flex-1 text-sm text-slate-900 px-3 py-2 max-h-20"
                    placeholder="Tapez votre message..."
                    value={value}
                    onChangeText={onChange}
                    multiline
                    maxLength={300}
                />
                <TouchableOpacity
                    disabled={!canSend}
                    onPress={onSend}
                    className={clsx(
                        "w-8 h-8 rounded-full items-center justify-center",
                        canSend ? "bg-emerald-600" : "bg-slate-300"
                    )}
                >
                    <Send color="#FFFFFF" size={16} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
