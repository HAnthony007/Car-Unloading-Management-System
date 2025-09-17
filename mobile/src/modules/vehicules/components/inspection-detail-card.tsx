import { CheckCircle } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { InspectionCheckpointCard } from "./inspection-checkpoint-card";

interface InspectionCheckpoint {
    id: string;
    title_checkpoint: string;
    description_checkpoint: string;
    order_checkpoint: number;
    status?: "ok" | "defaut" | "na";
    comment?: string;
    photos?: string[];
}

interface Inspection {
    id: string;
    survey_name: string;
    survey_description: string;
    overall_status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    checkpoints: InspectionCheckpoint[];
    created_at: string;
    updated_at: string;
}

interface Props {
    inspection: Inspection;
    onCheckpointStatusChange: (
        checkpointId: string,
        status: "ok" | "defaut" | "na"
    ) => void;
    onCheckpointCommentChange: (checkpointId: string, comment: string) => void;
    onCheckpointPhotoAdd: (checkpointId: string, photoUri: string) => void;
    onCheckpointPhotoRemove: (checkpointId: string, photoIndex: number) => void;
    onConfirmInspection: (inspectionId: string) => void;
}

export const InspectionDetailCard = ({
    inspection,
    onCheckpointStatusChange,
    onCheckpointCommentChange,
    onCheckpointPhotoAdd,
    onCheckpointPhotoRemove,
    onConfirmInspection,
}: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const calculateProgress = () => {
        const total = inspection.checkpoints.length;
        const completed = inspection.checkpoints.filter(
            (cp) => cp.status
        ).length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-emerald-100 text-emerald-700";
            case "IN_PROGRESS":
                return "bg-amber-100 text-amber-700";
            case "PENDING":
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "Terminée";
            case "IN_PROGRESS":
                return "En cours";
            case "PENDING":
            default:
                return "En attente";
        }
    };

    const progress = calculateProgress();
    const totalCheckpoints = inspection.checkpoints.length;
    const completedCheckpoints = inspection.checkpoints.filter(
        (cp) => cp.status
    ).length;
    const remainingCheckpoints = Math.max(
        0,
        totalCheckpoints - completedCheckpoints
    );
    const canConfirm = progress === 100; // autoriser dès que tous les checkpoints sont renseignés
    const isCompleted = inspection.overall_status === "COMPLETED";

    console.log("Inspection Status:", inspection.overall_status);

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden mb-6">
            {/* Header */}
            <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="p-6 flex-row items-center justify-between"
                activeOpacity={0.7}
            >
                <View className="flex-1 mr-4">
                    <Text className="text-slate-900 text-lg font-bold mb-1">
                        {inspection.survey_name}
                    </Text>
                    <Text className="text-slate-600 text-sm mb-2">
                        {inspection.survey_description}
                    </Text>
                    <View className="flex-row items-center">
                        <View
                            className={`px-2 py-1 rounded-full ${getStatusColor(inspection.overall_status)}`}
                        >
                            <Text className="text-xs font-medium">
                                {getStatusText(inspection.overall_status)}
                            </Text>
                        </View>
                        <Text className="text-slate-500 text-xs ml-2">
                            {progress}% complété
                        </Text>
                    </View>
                </View>
                <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                    <Text className="text-slate-600 text-sm font-bold">
                        {isExpanded ? "−" : "+"}
                    </Text>
                </View>
            </TouchableOpacity>

            {/* Progress Bar */}
            <View className="px-6 pb-4">
                <View className="bg-slate-200 rounded-full h-2">
                    <View
                        className="bg-emerald-500 rounded-full h-2"
                        style={{ width: `${progress}%` }}
                    />
                </View>
            </View>

            {/* Expanded Content */}
            {isExpanded && (
                <View className="px-6 pb-6">
                    <View className="h-px bg-slate-100 mb-4" />

                    {/* Checkpoints */}
                    <View className="space-y-4 mb-6">
                        {inspection.checkpoints.map((checkpoint) => (
                            <InspectionCheckpointCard
                                key={checkpoint.id}
                                checkpoint={checkpoint}
                                onStatusChange={onCheckpointStatusChange}
                                onCommentChange={onCheckpointCommentChange}
                                onPhotoAdd={onCheckpointPhotoAdd}
                                onPhotoRemove={onCheckpointPhotoRemove}
                            />
                        ))}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                        {!isCompleted ? (
                            <TouchableOpacity
                                onPress={() =>
                                    onConfirmInspection(inspection.id)
                                }
                                disabled={!canConfirm}
                                className={`flex-1 h-12 rounded-lg items-center justify-center flex-row ${
                                    canConfirm
                                        ? "bg-emerald-500"
                                        : "bg-slate-200"
                                }`}
                                activeOpacity={0.8}
                            >
                                <CheckCircle
                                    size={16}
                                    color={canConfirm ? "#fff" : "#64748b"}
                                />
                                <Text
                                    className={`text-sm font-semibold ml-2 ${
                                        canConfirm
                                            ? "text-white"
                                            : "text-slate-700"
                                    }`}
                                >
                                    Confirmer Inspection
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View className="flex-1 h-12 rounded-lg bg-emerald-100 items-center justify-center flex-row">
                                <CheckCircle size={16} color="#10b981" />
                                <Text className="text-emerald-700 text-sm font-semibold ml-2">
                                    Inspection Terminée
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Helper hint */}
                    {!isCompleted && !canConfirm && (
                        <View className="mt-3 bg-slate-50 rounded-lg p-3 border border-slate-200">
                            <Text className="text-slate-600 text-xs text-center">
                                Complétez tous les checkpoints pour confirmer
                                {remainingCheckpoints > 0
                                    ? ` • Restants: ${remainingCheckpoints}`
                                    : ""}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};
