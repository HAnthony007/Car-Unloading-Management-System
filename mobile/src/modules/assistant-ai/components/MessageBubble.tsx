import clsx from "clsx";
import { Bot, User } from "lucide-react-native";
import React from "react";
import { Text, View } from "react-native";
import { ChatMessage } from "../types/message";

interface Props {
    message: ChatMessage;
}

export function MessageBubble({ message }: Props) {
    const isUser = message.sender === "user";
    return (
        <View className={clsx("mb-3", isUser ? "items-end" : "items-start")}>
            <View className="flex-row items-center mb-1 gap-1.5">
                <View
                    className={clsx(
                        "w-5 h-5 rounded-full items-center justify-center",
                        isUser ? "bg-emerald-600" : "bg-blue-500"
                    )}
                >
                    {isUser ? (
                        <User color="#FFFFFF" size={12} />
                    ) : (
                        <Bot color="#FFFFFF" size={12} />
                    )}
                </View>
                <Text className="text-[10px] text-slate-400">
                    {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </Text>
            </View>
            <View
                className={clsx(
                    "max-w-[80%] px-3 py-2 rounded-2xl",
                    isUser
                        ? "bg-emerald-600 rounded-br-sm"
                        : "bg-slate-100 rounded-bl-sm"
                )}
            >
                <Text
                    className={clsx(
                        "text-sm leading-4",
                        isUser ? "text-white" : "text-slate-900"
                    )}
                >
                    {message.text}
                </Text>
            </View>
        </View>
    );
}
