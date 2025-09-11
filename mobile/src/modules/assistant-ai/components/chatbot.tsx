import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    View,
} from "react-native";
import { useChatbot } from "../hooks/useChatbot";
import { ChatMessage } from "../types/message";
import { ChatHeader } from "./ChatHeader";
import { FloatingTrigger } from "./FloatingTrigger";
import { InputBar } from "./InputBar";
import { MessageBubble } from "./MessageBubble";
import { Suggestions } from "./Suggestions";
import { TypingIndicator } from "./TypingIndicator";

export function FloatingChatbot() {
    const { messages, isTyping, sendMessage, reset } = useChatbot();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [draft, setDraft] = useState("");
    const scrollViewRef = useRef<ScrollView>(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const heightAnim = useRef(new Animated.Value(0)).current; // 0 -> minimized, 1 -> expanded
    const MIN_HEIGHT = 64; // px when minimized
    const screenHeight = Dimensions.get("window").height;
    const EXPANDED_HEIGHT = Math.max(400, screenHeight * 0.8);

    // Scroll to end when new message
    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [messages, isOpen, isMinimized]);

    // Initialize / reset height when opening or closing
    useEffect(() => {
        if (isOpen) {
            // Start expanded
            heightAnim.setValue(0);
            Animated.timing(heightAnim, {
                toValue: 1,
                duration: 260,
                useNativeDriver: false,
            }).start();
        } else {
            heightAnim.setValue(0);
        }
    }, [isOpen, heightAnim]);

    const toggleOpen = () => {
        if (isOpen) {
            setIsOpen(false);
            setIsMinimized(false);
        } else {
            setIsOpen(true);
            setIsMinimized(false);
        }
    };

    const toggleMinimize = () => {
        const next = !isMinimized;
        setIsMinimized(next);
        Animated.timing(heightAnim, {
            toValue: next ? 0 : 1,
            duration: 220,
            useNativeDriver: false,
        }).start();
    };

    const animatePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start(() => toggleOpen());
    };

    const animatedStyle = {
        height: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [MIN_HEIGHT, EXPANDED_HEIGHT],
        }),
    } as const;

    return (
        <>
            <FloatingTrigger
                show={!isOpen}
                onPress={animatePress}
                scaleAnim={scaleAnim}
            />
            <Modal
                visible={isOpen}
                transparent
                animationType="slide"
                onRequestClose={() => setIsOpen(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                    >
                        <Animated.View
                            className="bg-white rounded-t-2xl overflow-hidden"
                            style={animatedStyle}
                        >
                            <ChatHeader
                                isTyping={isTyping}
                                isMinimized={isMinimized}
                                onToggleMinimize={toggleMinimize}
                                onClose={() => setIsOpen(false)}
                                onReset={reset}
                            />
                            {!isMinimized && (
                                <>
                                    <ScrollView
                                        ref={scrollViewRef}
                                        className="flex-1 px-4"
                                        showsVerticalScrollIndicator={false}
                                        contentContainerClassName="py-4"
                                    >
                                        {messages.map((m: ChatMessage) => (
                                            <MessageBubble
                                                key={m.id}
                                                message={m}
                                            />
                                        ))}
                                        {isTyping && <TypingIndicator />}
                                    </ScrollView>
                                    <Suggestions
                                        visible={!isMinimized}
                                        onSelect={(t) => sendMessage(t)}
                                    />
                                    <InputBar
                                        value={draft}
                                        onChange={setDraft}
                                        onSend={() => {
                                            sendMessage(draft);
                                            setDraft("");
                                        }}
                                    />
                                </>
                            )}
                        </Animated.View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </>
    );
}
