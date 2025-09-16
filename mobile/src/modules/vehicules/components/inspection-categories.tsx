import {
    AlertTriangle,
    Camera,
    CameraIcon,
    CheckCircle2,
    MessageSquare,
    Minus,
} from "lucide-react-native";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { CategoryBlock } from "../types";
import { InspectionAccordion } from "./inspection-accordion";
import { StatusChip } from "./status-chip";

interface Props {
    categories: CategoryBlock[];
    addPhoto: (catKey: string, itemId: string) => void;
    setStatus: (catKey: string, itemId: string, status: any) => void;
    setComment: (catKey: string, itemId: string, comment: string) => void;
}

export const InspectionCategories: React.FC<Props> = ({
    categories,
    addPhoto,
    setStatus,
    setComment,
}) => {
    if (!categories.length) {
        return (
            <View className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 items-center">
                <Text className="text-slate-600 text-lg font-medium mb-2">
                    Aucune catégorie d&apos;inspection disponible
                </Text>
                <Text className="text-slate-500 text-sm text-center">
                    Les catégories d&apos;inspection seront chargées
                    automatiquement
                </Text>
            </View>
        );
    }
    return (
        <>
            {categories.map((cat, idx) => (
                <View key={cat.key} className="mb-6">
                    <InspectionAccordion
                        title={cat.title}
                        description={cat.description}
                        defaultOpen={idx === 0}
                    >
                        <View>
                            {cat.items.map((it) => (
                                <View
                                    key={it.id}
                                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-4"
                                >
                                    <View className="flex-row justify-between items-start mb-4">
                                        <Text className="text-sm font-semibold text-slate-900 flex-1 pr-3 leading-5">
                                            {it.label}
                                        </Text>
                                        <View className="flex-row items-center space-x-2">
                                            <StatusChip
                                                active={it.status === "ok"}
                                                label="OK"
                                                tone="emerald"
                                                onPress={() =>
                                                    setStatus(
                                                        cat.key,
                                                        it.id,
                                                        "ok"
                                                    )
                                                }
                                                icon={CheckCircle2}
                                            />
                                            <StatusChip
                                                active={it.status === "defaut"}
                                                label="Défaut"
                                                tone="amber"
                                                onPress={() =>
                                                    setStatus(
                                                        cat.key,
                                                        it.id,
                                                        "defaut"
                                                    )
                                                }
                                                icon={AlertTriangle}
                                            />
                                            <StatusChip
                                                active={it.status === "na"}
                                                label="N/A"
                                                tone="slate"
                                                onPress={() =>
                                                    setStatus(
                                                        cat.key,
                                                        it.id,
                                                        "na"
                                                    )
                                                }
                                                icon={Minus}
                                            />
                                        </View>
                                    </View>
                                    <View className="mb-4">
                                        <View className="flex-row items-center mb-3">
                                            <CameraIcon
                                                size={16}
                                                color="#64748b"
                                            />
                                            <Text className="text-slate-600 text-sm font-medium ml-2">
                                                Photos ({it.photos.length}/4)
                                            </Text>
                                        </View>
                                        <View className="flex-row flex-wrap -mx-1">
                                            {it.photos.map((p, idx) => (
                                                <View
                                                    key={p + idx}
                                                    className="w-20 h-20 mx-1 mb-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                                                >
                                                    <Image
                                                        source={{ uri: p }}
                                                        className="w-full h-full"
                                                        resizeMode="cover"
                                                    />
                                                </View>
                                            ))}
                                            {it.photos.length < 4 && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        addPhoto(cat.key, it.id)
                                                    }
                                                    className="w-20 h-20 mx-1 mb-2 rounded-xl border-2 border-dashed border-emerald-300 items-center justify-center bg-emerald-50"
                                                    activeOpacity={0.7}
                                                >
                                                    <Camera
                                                        size={20}
                                                        color="#10b981"
                                                    />
                                                    <Text className="text-emerald-700 text-xs font-medium mt-1">
                                                        Ajouter
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                    <View>
                                        <View className="flex-row items-center mb-3">
                                            <MessageSquare
                                                size={16}
                                                color="#64748b"
                                            />
                                            <Text className="text-slate-600 text-sm font-medium ml-2">
                                                Commentaire
                                            </Text>
                                        </View>
                                        <TextInput
                                            value={it.comment}
                                            onChangeText={(t) =>
                                                setComment(cat.key, it.id, t)
                                            }
                                            placeholder="Ajoutez vos observations..."
                                            placeholderTextColor="#94a3b8"
                                            multiline
                                            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                                            style={{
                                                textAlignVertical: "top",
                                                minHeight: 80,
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </InspectionAccordion>
                </View>
            ))}
        </>
    );
};
