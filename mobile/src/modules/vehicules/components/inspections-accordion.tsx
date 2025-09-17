import { useRouter } from "expo-router";
import { CheckCircle, FileText, Plus, Search } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { formatRelative } from "../lib/format-relative";

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
    open: boolean;
    toggle: () => void;
    inspections: Inspection[];
    onValidateInspection: (inspectionId: string) => void;
    onStartInspection: (inspectionId: string) => void;
    loading?: boolean;
    error?: string | null;
}

export const InspectionsAccordion = ({
    open,
    toggle,
    inspections,
    onValidateInspection,
    onStartInspection,
    loading = false,
    error = null,
}: Props) => {
    const router = useRouter();
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

    const getCheckpointStatusColor = (status?: string) => {
        switch (status) {
            case "ok":
                return "bg-emerald-100 text-emerald-700";
            case "defaut":
                return "bg-red-100 text-red-700";
            case "na":
                return "bg-slate-100 text-slate-700";
            default:
                return "bg-slate-100 text-slate-500";
        }
    };

    const getCheckpointStatusText = (status?: string) => {
        switch (status) {
            case "ok":
                return "OK";
            case "defaut":
                return "Défaut";
            case "na":
                return "N/A";
            default:
                return "Non vérifié";
        }
    };

    const calculateProgress = (checkpoints: InspectionCheckpoint[]) => {
        const total = checkpoints.length;
        const completed = checkpoints.filter((cp) => cp.status).length;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    };

    return (
        <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
            <TouchableOpacity
                onPress={toggle}
                className="px-6 py-4 flex-row items-center justify-between"
                activeOpacity={0.7}
            >
                <View className="flex-row items-center">
                    <View className="w-8 h-8 bg-orange-100 rounded-lg items-center justify-center mr-3">
                        <Search size={16} color="#f97316" />
                    </View>
                    <View>
                        <Text className="text-slate-900 text-base font-bold">
                            Inspections
                        </Text>
                        <Text className="text-slate-600 text-sm">
                            {inspections.length} inspection
                            {inspections.length > 1 ? "s" : ""}
                        </Text>
                    </View>
                </View>
                <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                    <Text className="text-slate-600 text-sm font-bold">
                        {open ? "−" : "+"}
                    </Text>
                </View>
            </TouchableOpacity>

            {open && (
                <View className="px-6 pb-6">
                    <View className="h-px bg-slate-100 mb-4" />
                    {loading ? (
                        <View className="bg-slate-50 rounded-xl p-6 items-center">
                            <Search size={32} color="#94a3b8" />
                            <Text className="text-slate-500 text-sm font-medium mt-2">
                                Chargement des inspections...
                            </Text>
                        </View>
                    ) : error ? (
                        <View className="bg-red-50 rounded-xl p-6 items-center">
                            <Search size={32} color="#ef4444" />
                            <Text className="text-red-500 text-sm font-medium mt-2">
                                Erreur de chargement
                            </Text>
                            <Text className="text-red-400 text-xs text-center mt-1">
                                {error}
                            </Text>
                        </View>
                    ) : inspections.length === 0 ? (
                        <View className="bg-slate-50 rounded-xl p-6 items-center">
                            <Search size={32} color="#94a3b8" />
                            <Text className="text-slate-500 text-sm font-medium mt-2">
                                Aucune inspection
                            </Text>
                            <Text className="text-slate-400 text-xs text-center mt-1">
                                Les inspections seront disponibles ici
                            </Text>
                        </View>
                    ) : (
                        <View className="space-y-4">
                            {inspections.map((inspection) => {
                                const progress = calculateProgress(
                                    inspection.checkpoints
                                );
                                const isCompleted =
                                    inspection.overall_status === "COMPLETED";
                                const canValidate =
                                    inspection.overall_status ===
                                        "IN_PROGRESS" && progress === 100;

                                return (
                                    <View
                                        key={inspection.id}
                                        className="bg-slate-50 rounded-xl p-4 border border-slate-200"
                                    >
                                        {/* Header */}
                                        <View className="flex-row items-start justify-between mb-3">
                                            <View className="flex-1 mr-3">
                                                <Text className="text-slate-900 text-base font-bold mb-1">
                                                    {inspection.survey_name}
                                                </Text>
                                                <Text className="text-slate-600 text-sm mb-2">
                                                    {
                                                        inspection.survey_description
                                                    }
                                                </Text>
                                                <View className="flex-row items-center">
                                                    <View
                                                        className={`px-2 py-1 rounded-full ${getStatusColor(inspection.overall_status)}`}
                                                    >
                                                        <Text className="text-xs font-medium">
                                                            {getStatusText(
                                                                inspection.overall_status
                                                            )}
                                                        </Text>
                                                    </View>
                                                    <Text className="text-slate-500 text-xs ml-2">
                                                        {formatRelative(
                                                            inspection.created_at
                                                        )}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Progress Bar */}
                                        <View className="mb-4">
                                            <View className="flex-row items-center justify-between mb-1">
                                                <Text className="text-slate-600 text-xs font-medium">
                                                    Progression
                                                </Text>
                                                <Text className="text-slate-600 text-xs font-medium">
                                                    {progress}%
                                                </Text>
                                            </View>
                                            <View className="bg-slate-200 rounded-full h-2">
                                                <View
                                                    className="bg-emerald-500 rounded-full h-2"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </View>
                                        </View>

                                        {/* Checkpoints */}
                                        <View className="space-y-2 mb-4">
                                            {inspection.checkpoints.map(
                                                (checkpoint) => (
                                                    <View
                                                        key={checkpoint.id}
                                                        className="flex-row items-center p-2 bg-white rounded-lg border border-slate-100"
                                                    >
                                                        <View className="flex-1 mr-2">
                                                            <Text className="text-slate-900 text-sm font-medium">
                                                                {
                                                                    checkpoint.title_checkpoint
                                                                }
                                                            </Text>
                                                            <Text className="text-slate-500 text-xs">
                                                                {
                                                                    checkpoint.description_checkpoint
                                                                }
                                                            </Text>
                                                        </View>
                                                        <View
                                                            className={`px-2 py-1 rounded-full ${getCheckpointStatusColor(checkpoint.status)}`}
                                                        >
                                                            <Text className="text-xs font-medium">
                                                                {getCheckpointStatusText(
                                                                    checkpoint.status
                                                                )}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )
                                            )}
                                        </View>

                                        {/* Action Buttons */}
                                        <View className="flex-row gap-2">
                                            {!isCompleted && (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        onStartInspection(
                                                            inspection.id
                                                        );
                                                        // navigate to survey screen
                                                        router.push(
                                                            "/(vehicles)/survey" as any
                                                        );
                                                    }}
                                                    className="flex-1 h-10 rounded-lg bg-blue-500 items-center justify-center flex-row"
                                                    activeOpacity={0.8}
                                                >
                                                    <FileText
                                                        size={14}
                                                        color="#fff"
                                                    />
                                                    <Text className="text-white text-sm font-semibold ml-1">
                                                        {inspection.overall_status ===
                                                        "PENDING"
                                                            ? "Commencer"
                                                            : "Continuer"}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}

                                            {canValidate && (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        onValidateInspection(
                                                            inspection.id
                                                        )
                                                    }
                                                    className="flex-1 h-10 rounded-lg bg-emerald-500 items-center justify-center flex-row"
                                                    activeOpacity={0.8}
                                                >
                                                    <CheckCircle
                                                        size={14}
                                                        color="#fff"
                                                    />
                                                    <Text className="text-white text-sm font-semibold ml-1">
                                                        Valider
                                                    </Text>
                                                </TouchableOpacity>
                                            )}

                                            {isCompleted && (
                                                <View className="flex-1 h-10 rounded-lg bg-emerald-100 items-center justify-center flex-row">
                                                    <CheckCircle
                                                        size={14}
                                                        color="#10b981"
                                                    />
                                                    <Text className="text-emerald-700 text-sm font-semibold ml-1">
                                                        Terminée
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {inspections.length === 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                onStartInspection("new");
                                router.push("/(vehicles)/survey" as any);
                            }}
                            className="mt-4 flex-row items-center justify-center px-4 py-3 rounded-xl bg-emerald-500"
                            activeOpacity={0.8}
                        >
                            <Plus size={16} color="#fff" />
                            <Text className="text-white text-sm font-semibold ml-2">
                                Nouvelle inspection
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};
