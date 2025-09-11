import { useCallback, useEffect, useRef, useState } from "react";
import { generateAssistantResponse } from "../lib/responses";
import { ChatMessage } from "../types/message";

// Wrapper to safely access AsyncStorage (no-op if not installed yet)
async function getAsyncStorage() {
    try {
        const mod = await import("@react-native-async-storage/async-storage");
        return mod.default;
    } catch {
        return {
            getItem: async () => null,
            setItem: async () => {},
            removeItem: async () => {},
        } as const;
    }
}

const STORAGE_KEY = "chatbot_messages_v1";

interface UseChatbotOptions {
    typingDelay?: number; // ms
}

interface UseChatbotReturn {
    messages: ChatMessage[];
    isTyping: boolean;
    sendMessage: (text: string) => void;
    reset: () => void;
    hydrateDone: boolean;
}

// Simulated async fetch (placeholder for real API)
async function fetchAssistantResponse(userText: string, delay: number) {
    await new Promise((r) => setTimeout(r, delay));
    return generateAssistantResponse(userText);
}

export function useChatbot(options: UseChatbotOptions = {}): UseChatbotReturn {
    const { typingDelay = 1200 } = options;
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "welcome",
            text: "Bonjour ! Je suis votre assistant SMMC. Comment puis-je vous aider ?",
            sender: "assistant",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [hydrateDone, setHydrateDone] = useState(false);
    const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Hydrate from storage
    useEffect(() => {
        (async () => {
            const AsyncStorage = await getAsyncStorage();
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed: ChatMessage[] = JSON.parse(raw).map(
                        (m: any) => ({
                            ...m,
                            timestamp: new Date(m.timestamp),
                        })
                    );
                    if (parsed.length) setMessages(parsed);
                }
            } catch {
                // silent
            } finally {
                setHydrateDone(true);
            }
        })();
    }, []);

    // Persist
    useEffect(() => {
        if (!hydrateDone) return;
        (async () => {
            const AsyncStorage = await getAsyncStorage();
            AsyncStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    messages.map((m) => ({
                        ...m,
                        timestamp: m.timestamp.toISOString(),
                    }))
                )
            ).catch(() => {});
        })();
    }, [messages, hydrateDone]);

    const sendMessage = useCallback(
        (text: string) => {
            if (!text.trim()) return;
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                text,
                sender: "user",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);
            setIsTyping(true);
            // Clear previous timeout if any
            if (pendingRef.current) clearTimeout(pendingRef.current);
            pendingRef.current = setTimeout(async () => {
                try {
                    const answer = await fetchAssistantResponse(
                        text,
                        typingDelay / 2
                    );
                    const assistantMessage: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        text: answer,
                        sender: "assistant",
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, assistantMessage]);
                } finally {
                    setIsTyping(false);
                }
            }, typingDelay);
        },
        [typingDelay]
    );

    const reset = useCallback(() => {
        setMessages([
            {
                id: "welcome",
                text: "Bonjour ! Je suis votre assistant SMMC. Comment puis-je vous aider ?",
                sender: "assistant",
                timestamp: new Date(),
            },
        ]);
        (async () => {
            const AsyncStorage = await getAsyncStorage();
            AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
        })();
    }, []);

    // Cleanup
    useEffect(
        () => () => {
            if (pendingRef.current) clearTimeout(pendingRef.current);
        },
        []
    );

    return { messages, isTyping, sendMessage, reset, hydrateDone };
}
