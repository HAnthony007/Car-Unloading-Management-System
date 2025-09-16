import { InspectionCategories } from "@/src/modules/vehicules/components/inspection-categories";
import { InspectionHeader } from "@/src/modules/vehicules/components/inspection-header";
import { StartInspectionCard } from "@/src/modules/vehicules/components/start-inspection-card";
import { VehicleInfoCard } from "@/src/modules/vehicules/components/vehicle-info-card";
import { useDischargeInspection } from "@/src/modules/vehicules/hooks/use-discharge-inspection";
import { useInspection } from "@/src/modules/vehicules/hooks/use-inspection";
import { useEffect, useMemo } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SurveyScreen() {
    const { categories, addPhoto, setStatus, setComment } = useInspection();
    const { hasInspection, loading, starting, error, start } =
        useDischargeInspection();

    // Calculate inspection progress (local categories state)
    const inspectionStats = useMemo(() => {
        let totalItems = 0;
        let completedItems = 0;
        let okItems = 0;
        let defectItems = 0;
        let naItems = 0;

        categories.forEach((category) => {
            category.items.forEach((item) => {
                totalItems++;
                if (item.status) {
                    completedItems++;
                    if (item.status === "ok") okItems++;
                    else if (item.status === "defaut") defectItems++;
                    else if (item.status === "na") naItems++;
                }
            });
        });

        return {
            totalItems,
            completedItems,
            okItems,
            defectItems,
            naItems,
            progressPercentage:
                totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
        };
    }, [categories]);

    useEffect(() => {
        // Debug log; remove in production
        console.log("Inspection categories:", categories.length);
    }, [categories]);

    // Handlers already provided by hook

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 100 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View className="px-6 pt-4 pb-6">
                    {hasInspection ? (
                        <InspectionHeader
                            completed={inspectionStats.completedItems}
                            total={inspectionStats.totalItems}
                            ok={inspectionStats.okItems}
                            defect={inspectionStats.defectItems}
                            na={inspectionStats.naItems}
                            progress={inspectionStats.progressPercentage}
                        />
                    ) : (
                        <StartInspectionCard
                            loading={loading}
                            starting={starting}
                            error={error}
                            onStart={(force) => start(force)}
                            hasDischarge={
                                true /* discharge selection handled in hook */
                            }
                        />
                    )}
                </View>

                {/* Vehicle information card */}
                {hasInspection && (
                    <View className="px-6 mb-6">
                        <VehicleInfoCard />
                    </View>
                )}

                {/* Categories accordions */}
                {hasInspection && (
                    <View className="px-6">
                        <InspectionCategories
                            categories={categories}
                            addPhoto={addPhoto}
                            setStatus={setStatus}
                            setComment={setComment}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
