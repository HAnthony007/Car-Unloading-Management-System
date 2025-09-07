import { Image as Img } from "lucide-react-native";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
    images: string[];
    addImage: () => void;
}

export const ImagesSection = ({ images, addImage }: Props) => (
    <View className="mb-6">
        <Text className="text-sm font-semibold text-slate-900 mb-3">
            Photos ({images.length}/5)
        </Text>
        <View className="flex-row flex-wrap -m-1">
            {images.map((uri, i) => (
                <View
                    key={uri + i}
                    className="w-20 h-20 m-1 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                >
                    <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                    />
                </View>
            ))}
            {images.length < 5 && (
                <TouchableOpacity
                    onPress={addImage}
                    className="w-20 h-20 m-1 rounded-lg border-2 border-dashed border-emerald-300 items-center justify-center bg-emerald-50"
                >
                    <Img size={24} color="#059669" />
                    <Text className="text-[10px] mt-1 font-medium text-emerald-700">
                        Ajouter
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    </View>
);
