import { Camera, ImageIcon } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
    images: string[];
    addImage: () => void;
}

export const ImagesSection = ({ images, addImage }: Props) => (
    <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
        <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-amber-100 rounded-2xl items-center justify-center mr-3">
                <Camera size={20} color="#f59e0b" />
            </View>
            <View className="flex-1">
                <Text className="text-slate-900 text-lg font-bold">
                    Galerie Photos
                </Text>
                <Text className="text-slate-600 text-sm">
                    {images.length}/5 photos
                </Text>
            </View>
        </View>

        <View className="flex-row flex-wrap -mx-1">
            {images.map((uri, i) => (
                <View
                    key={uri + i}
                    className="w-24 h-24 mx-1 mb-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                >
                    <Image
                        source={{ uri }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
            ))}
            {images.length < 5 && (
                <TouchableOpacity
                    onPress={addImage}
                    className="w-24 h-24 mx-1 mb-2 rounded-xl border-2 border-dashed border-emerald-300 items-center justify-center bg-emerald-50"
                    activeOpacity={0.7}
                >
                    <ImageIcon size={28} color="#10b981" />
                    <Text className="text-emerald-700 text-xs font-medium mt-1">
                        Ajouter
                    </Text>
                </TouchableOpacity>
            )}
        </View>

        {images.length === 0 && (
            <View className="bg-slate-50 rounded-xl p-6 items-center mt-2">
                <Camera size={32} color="#94a3b8" />
                <Text className="text-slate-500 text-sm font-medium mt-2">
                    Aucune photo ajoutée
                </Text>
                <Text className="text-slate-400 text-xs text-center mt-1">
                    Appuyez sur le bouton pour ajouter des photos
                </Text>
            </View>
        )}
    </View>
);
