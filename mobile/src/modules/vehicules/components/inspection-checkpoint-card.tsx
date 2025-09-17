import { AlertCircle, Camera, CheckCircle, XCircle } from "lucide-react-native";
import { useState } from "react";
import {
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface InspectionCheckpoint {
    id: string;
    title_checkpoint: string;
    description_checkpoint: string;
    order_checkpoint: number;
    status?: "ok" | "defaut" | "na";
    comment?: string;
    photos?: string[];
}

interface Props {
    checkpoint: InspectionCheckpoint;
    onStatusChange: (
        checkpointId: string,
        status: "ok" | "defaut" | "na"
    ) => void;
    onCommentChange: (checkpointId: string, comment: string) => void;
    onPhotoAdd: (checkpointId: string, photoUri: string) => void;
    onPhotoRemove: (checkpointId: string, photoIndex: number) => void;
}

export const InspectionCheckpointCard = ({
    checkpoint,
    onStatusChange,
    onCommentChange,
    onPhotoAdd,
    onPhotoRemove,
}: Props) => {
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [comment, setComment] = useState(checkpoint.comment || "");

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "ok":
                return "bg-emerald-100 border-emerald-200";
            case "defaut":
                return "bg-red-100 border-red-200";
            case "na":
                return "bg-slate-100 border-slate-200";
            default:
                return "bg-slate-50 border-slate-200";
        }
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "ok":
                return <CheckCircle size={20} color="#10b981" />;
            case "defaut":
                return <XCircle size={20} color="#ef4444" />;
            case "na":
                return <AlertCircle size={20} color="#64748b" />;
            default:
                return <AlertCircle size={20} color="#94a3b8" />;
        }
    };

    const getStatusText = (status?: string) => {
        switch (status) {
            case "ok":
                return "Conforme";
            case "defaut":
                return "Non conforme";
            case "na":
                return "Non applicable";
            default:
                return "Non vérifié";
        }
    };

    const handleStatusChange = (status: "ok" | "defaut" | "na") => {
        onStatusChange(checkpoint.id, status);
        if (status === "defaut") {
            setShowCommentInput(true);
        }
    };

    const handleCommentSave = () => {
        onCommentChange(checkpoint.id, comment);
        setShowCommentInput(false);
    };

    const handleCommentCancel = () => {
        setComment(checkpoint.comment || "");
        setShowCommentInput(false);
    };

    const pickImage = async () => {
        try {
            // TODO: Implement real image picker when expo-image-picker is properly installed
            // For now, simulate adding a placeholder image
            const placeholderImage = `https://via.placeholder.com/300x200?text=Photo+${Date.now()}`;
            onPhotoAdd(checkpoint.id, placeholderImage);
        } catch {
            Alert.alert("Erreur", "Impossible de sélectionner une image");
        }
    };

    const takePhoto = async () => {
        try {
            // TODO: Implement real camera when expo-image-picker is properly installed
            // For now, simulate taking a photo
            const placeholderImage = `https://via.placeholder.com/300x200?text=Camera+${Date.now()}`;
            onPhotoAdd(checkpoint.id, placeholderImage);
        } catch {
            Alert.alert("Erreur", "Impossible de prendre une photo");
        }
    };

    const showImagePicker = () => {
        Alert.alert("Ajouter une photo", "Choisissez une option", [
            { text: "Annuler", style: "cancel" },
            { text: "Galerie", onPress: pickImage },
            { text: "Appareil photo", onPress: takePhoto },
        ]);
    };

    return (
        <View
            className={`rounded-2xl border-2 p-4 mb-4 ${getStatusColor(checkpoint.status)}`}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                    <Text className="text-slate-900 text-base font-bold mb-1">
                        {checkpoint.title_checkpoint}
                    </Text>
                    <Text className="text-slate-600 text-sm">
                        {checkpoint.description_checkpoint}
                    </Text>
                </View>
                <View className="flex-row items-center">
                    {getStatusIcon(checkpoint.status)}
                    <Text className="text-slate-700 text-sm font-medium ml-2">
                        {getStatusText(checkpoint.status)}
                    </Text>
                </View>
            </View>

            {/* Status Buttons */}
            <View className="flex-row gap-2 mb-4">
                <TouchableOpacity
                    onPress={() => handleStatusChange("ok")}
                    className={`flex-1 h-10 rounded-lg items-center justify-center flex-row ${
                        checkpoint.status === "ok"
                            ? "bg-emerald-500"
                            : "bg-emerald-100"
                    }`}
                    activeOpacity={0.8}
                >
                    <CheckCircle
                        size={16}
                        color={checkpoint.status === "ok" ? "#fff" : "#10b981"}
                    />
                    <Text
                        className={`text-sm font-semibold ml-1 ${
                            checkpoint.status === "ok"
                                ? "text-white"
                                : "text-emerald-700"
                        }`}
                    >
                        Conforme
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleStatusChange("defaut")}
                    className={`flex-1 h-10 rounded-lg items-center justify-center flex-row ${
                        checkpoint.status === "defaut"
                            ? "bg-red-500"
                            : "bg-red-100"
                    }`}
                    activeOpacity={0.8}
                >
                    <XCircle
                        size={16}
                        color={
                            checkpoint.status === "defaut" ? "#fff" : "#ef4444"
                        }
                    />
                    <Text
                        className={`text-sm font-semibold ml-1 ${
                            checkpoint.status === "defaut"
                                ? "text-white"
                                : "text-red-700"
                        }`}
                    >
                        Défaut
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleStatusChange("na")}
                    className={`flex-1 h-10 rounded-lg items-center justify-center flex-row ${
                        checkpoint.status === "na"
                            ? "bg-slate-500"
                            : "bg-slate-100"
                    }`}
                    activeOpacity={0.8}
                >
                    <AlertCircle
                        size={16}
                        color={checkpoint.status === "na" ? "#fff" : "#64748b"}
                    />
                    <Text
                        className={`text-sm font-semibold ml-1 ${
                            checkpoint.status === "na"
                                ? "text-white"
                                : "text-slate-700"
                        }`}
                    >
                        N/A
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Comment Section */}
            {checkpoint.status === "defaut" && (
                <View className="mb-4">
                    {showCommentInput ? (
                        <View className="space-y-3">
                            <TextInput
                                value={comment}
                                onChangeText={setComment}
                                placeholder="Décrivez le défaut observé..."
                                multiline
                                numberOfLines={3}
                                className="bg-white rounded-lg p-3 border border-slate-200 text-slate-900"
                                textAlignVertical="top"
                            />
                            <View className="flex-row gap-2">
                                <TouchableOpacity
                                    onPress={handleCommentSave}
                                    className="flex-1 h-10 rounded-lg bg-emerald-500 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-white text-sm font-semibold">
                                        Enregistrer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCommentCancel}
                                    className="flex-1 h-10 rounded-lg bg-slate-200 items-center justify-center"
                                    activeOpacity={0.8}
                                >
                                    <Text className="text-slate-700 text-sm font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setShowCommentInput(true)}
                            className="bg-white rounded-lg p-3 border border-slate-200"
                            activeOpacity={0.7}
                        >
                            <Text className="text-slate-600 text-sm">
                                {checkpoint.comment ||
                                    "Ajouter un commentaire..."}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Photos Section */}
            {checkpoint.status === "defaut" && (
                <View className="mb-4">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-slate-700 text-sm font-medium">
                            Photos du défaut
                        </Text>
                        <TouchableOpacity
                            onPress={showImagePicker}
                            className="flex-row items-center px-3 py-2 bg-blue-500 rounded-lg"
                            activeOpacity={0.8}
                        >
                            <Camera size={16} color="#fff" />
                            <Text className="text-white text-sm font-semibold ml-1">
                                Ajouter
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {checkpoint.photos && checkpoint.photos.length > 0 ? (
                        <View className="flex-row flex-wrap gap-2">
                            {checkpoint.photos.map((photo, index) => (
                                <View key={index} className="relative">
                                    <Image
                                        source={{ uri: photo }}
                                        className="w-20 h-20 rounded-lg"
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={() =>
                                            onPhotoRemove(checkpoint.id, index)
                                        }
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full items-center justify-center"
                                        activeOpacity={0.8}
                                    >
                                        <XCircle size={14} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-slate-50 rounded-lg p-4 items-center">
                            <Camera size={32} color="#94a3b8" />
                            <Text className="text-slate-500 text-sm mt-2">
                                Aucune photo ajoutée
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};
