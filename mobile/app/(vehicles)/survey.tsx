import { InspectionDetailCard } from "@/src/modules/vehicules/components/inspection-detail-card";
import { VehicleInfoCard } from "@/src/modules/vehicules/components/vehicle-info-card";
import { useInspectionManagement } from "@/src/modules/vehicules/hooks/use-inspection-management";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SurveyScreen() {
    const {
        inspections,
        loading,
        error,
        updating,
        updateCheckpointStatus,
        updateCheckpointComment,
        addCheckpointPhoto,
        removeCheckpointPhoto,
        confirmInspection,
    } = useInspectionManagement();

    const handleConfirmInspection = async (inspectionId: string) => {
        Alert.alert(
            "Confirmer l'inspection",
            "Êtes-vous sûr de vouloir confirmer cette inspection ? Cette action est irréversible.",
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Confirmer",
                    style: "destructive",
                    onPress: () => confirmInspection(inspectionId),
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View className="px-6 pt-4 pb-6">
                    <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                        <Text className="text-slate-900 text-2xl font-bold mb-2">
                            Inspections Véhicule
                        </Text>
                        <Text className="text-slate-600 text-base">
                            Vérifiez chaque point d&apos;inspection et confirmez
                            les résultats
                        </Text>
                        {updating && (
                            <View className="mt-4 bg-amber-50 rounded-lg p-3">
                                <Text className="text-amber-700 text-sm text-center">
                                    Mise à jour en cours...
                                </Text>
                            </View>
                        )}
                        {error && (
                            <View className="mt-4 bg-red-50 rounded-lg p-3">
                                <Text className="text-red-700 text-sm text-center">
                                    {error}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Vehicle information card */}
                <View className="px-6 mb-6">
                    <VehicleInfoCard />
                </View>

                {/* Inspections List */}
                <View className="px-6">
                    {loading ? (
                        <View className="bg-white rounded-3xl p-8 items-center shadow-lg border border-slate-200">
                            <Text className="text-slate-500 text-base">
                                Chargement des inspections...
                            </Text>
                        </View>
                    ) : inspections.length === 0 ? (
                        <View className="bg-white rounded-3xl p-8 items-center shadow-lg border border-slate-200">
                            <Text className="text-slate-500 text-base mb-2">
                                Aucune inspection disponible
                            </Text>
                            <Text className="text-slate-400 text-sm text-center">
                                Les inspections seront affichées ici une fois
                                créées
                            </Text>
                        </View>
                    ) : (
                        inspections.map((inspection) => (
                            <InspectionDetailCard
                                key={inspection.id}
                                inspection={inspection}
                                onCheckpointStatusChange={
                                    updateCheckpointStatus
                                }
                                onCheckpointCommentChange={
                                    updateCheckpointComment
                                }
                                onCheckpointPhotoAdd={addCheckpointPhoto}
                                onCheckpointPhotoRemove={removeCheckpointPhoto}
                                onConfirmInspection={handleConfirmInspection}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
