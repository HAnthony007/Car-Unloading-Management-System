import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { InspectionAccordion } from "@/src/modules/vehicules/components/inspection-accordion";
import { StatusChip } from "@/src/modules/vehicules/components/status-chip";
import { useInspection } from "@/src/modules/vehicules/hooks/use-inspection";
import { LinearGradient } from "expo-linear-gradient";
import {
    AlertTriangle,
    Calendar,
    Camera,
    CameraIcon,
    Car,
    CheckCircle2,
    FileText,
    MessageSquare,
    Minus,
    Palette,
    Settings,
} from "lucide-react-native";
import { useEffect, useMemo } from "react";
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SurveyScreen() {
    const metadata = useScannerStore((s) => s.metadata);
    const vin = useScannerStore((s) => s.vin || "VIN-INCONNU");
    const { categories, addPhoto, setStatus, setComment } = useInspection();

    // Calculate inspection progress
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

    // Example ensure metadata present (optional)
    useEffect(() => {
        // Could prefill if needed; left minimal here.
        console.log("Categories loaded:", categories.length, categories);
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
                {/* Header with progress */}
                <View className="px-6 pt-4 pb-6">
                    <LinearGradient
                        colors={["#1e293b", "#334155"]}
                        className="rounded-3xl p-6 shadow-lg"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center">
                                <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center mr-4">
                                    <Car size={24} color="#ffffff" />
                                </View>
                                <View>
                                    <Text className="text-white text-lg font-bold">
                                        Inspection Véhicule
                                    </Text>
                                    <Text className="text-slate-300 text-sm">
                                        {inspectionStats.completedItems}/
                                        {inspectionStats.totalItems} éléments
                                    </Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white text-2xl font-bold">
                                    {Math.round(
                                        inspectionStats.progressPercentage
                                    )}
                                    %
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Terminé
                                </Text>
                            </View>
                        </View>

                        {/* Progress bar */}
                        <View className="bg-white/20 rounded-full h-2 mb-4">
                            <View
                                className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full h-2"
                                style={{
                                    width: `${inspectionStats.progressPercentage}%`,
                                }}
                            />
                        </View>

                        {/* Stats */}
                        <View className="flex-row justify-between">
                            <View className="items-center">
                                <Text className="text-emerald-400 text-lg font-bold">
                                    {inspectionStats.okItems}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    OK
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-amber-400 text-lg font-bold">
                                    {inspectionStats.defectItems}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    Défauts
                                </Text>
                            </View>
                            <View className="items-center">
                                <Text className="text-slate-400 text-lg font-bold">
                                    {inspectionStats.naItems}
                                </Text>
                                <Text className="text-slate-300 text-xs">
                                    N/A
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Vehicle information card */}
                <View className="px-6 mb-6">
                    <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                        <View className="flex-row items-center mb-4">
                            <View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                                <Settings size={20} color="#3b82f6" />
                            </View>
                            <Text className="text-slate-900 text-lg font-bold">
                                Informations Véhicule
                            </Text>
                        </View>

                        <View className="bg-slate-50 rounded-2xl p-4 mb-4">
                            <View className="flex-row items-center mb-2">
                                <FileText size={16} color="#64748b" />
                                <Text className="text-slate-600 text-sm font-medium ml-2">
                                    VIN
                                </Text>
                            </View>
                            <Text className="text-slate-900 text-base font-mono tracking-wider">
                                {vin}
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap -mx-2">
                            <View className="w-1/2 px-2 mb-3">
                                <View className="bg-slate-50 rounded-xl p-3">
                                    <View className="flex-row items-center mb-1">
                                        <Car size={14} color="#64748b" />
                                        <Text className="text-slate-600 text-xs font-medium ml-1">
                                            Marque
                                        </Text>
                                    </View>
                                    <Text className="text-slate-900 text-sm font-semibold">
                                        {metadata?.identification.make || "—"}
                                    </Text>
                                </View>
                            </View>
                            <View className="w-1/2 px-2 mb-3">
                                <View className="bg-slate-50 rounded-xl p-3">
                                    <View className="flex-row items-center mb-1">
                                        <Settings size={14} color="#64748b" />
                                        <Text className="text-slate-600 text-xs font-medium ml-1">
                                            Modèle
                                        </Text>
                                    </View>
                                    <Text className="text-slate-900 text-sm font-semibold">
                                        {metadata?.identification.model || "—"}
                                    </Text>
                                </View>
                            </View>
                            <View className="w-1/2 px-2 mb-3">
                                <View className="bg-slate-50 rounded-xl p-3">
                                    <View className="flex-row items-center mb-1">
                                        <Calendar size={14} color="#64748b" />
                                        <Text className="text-slate-600 text-xs font-medium ml-1">
                                            Année
                                        </Text>
                                    </View>
                                    <Text className="text-slate-900 text-sm font-semibold">
                                        {metadata?.identification.year || "—"}
                                    </Text>
                                </View>
                            </View>
                            <View className="w-1/2 px-2 mb-3">
                                <View className="bg-slate-50 rounded-xl p-3">
                                    <View className="flex-row items-center mb-1">
                                        <Palette size={14} color="#64748b" />
                                        <Text className="text-slate-600 text-xs font-medium ml-1">
                                            Couleur
                                        </Text>
                                    </View>
                                    <Text className="text-slate-900 text-sm font-semibold">
                                        {metadata?.identification.color || "—"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Categories accordions */}
                <View className="px-6">
                    {categories.length > 0 ? (
                        categories.map((cat, idx) => (
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
                                                {/* Item header with status */}
                                                <View className="flex-row justify-between items-start mb-4">
                                                    <Text className="text-sm font-semibold text-slate-900 flex-1 pr-3 leading-5">
                                                        {it.label}
                                                    </Text>
                                                    <View className="flex-row items-center space-x-2">
                                                        <StatusChip
                                                            active={
                                                                it.status ===
                                                                "ok"
                                                            }
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
                                                            active={
                                                                it.status ===
                                                                "defaut"
                                                            }
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
                                                            active={
                                                                it.status ===
                                                                "na"
                                                            }
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

                                                {/* Photos section */}
                                                <View className="mb-4">
                                                    <View className="flex-row items-center mb-3">
                                                        <CameraIcon
                                                            size={16}
                                                            color="#64748b"
                                                        />
                                                        <Text className="text-slate-600 text-sm font-medium ml-2">
                                                            Photos (
                                                            {it.photos.length}
                                                            /4)
                                                        </Text>
                                                    </View>
                                                    <View className="flex-row flex-wrap -mx-1">
                                                        {it.photos.map(
                                                            (p, idx) => (
                                                                <View
                                                                    key={
                                                                        p + idx
                                                                    }
                                                                    className="w-20 h-20 mx-1 mb-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm"
                                                                >
                                                                    <Image
                                                                        source={{
                                                                            uri: p,
                                                                        }}
                                                                        className="w-full h-full"
                                                                        resizeMode="cover"
                                                                    />
                                                                </View>
                                                            )
                                                        )}
                                                        {it.photos.length <
                                                            4 && (
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    addPhoto(
                                                                        cat.key,
                                                                        it.id
                                                                    )
                                                                }
                                                                className="w-20 h-20 mx-1 mb-2 rounded-xl border-2 border-dashed border-emerald-300 items-center justify-center bg-emerald-50"
                                                                activeOpacity={
                                                                    0.7
                                                                }
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

                                                {/* Comment section */}
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
                                                            setComment(
                                                                cat.key,
                                                                it.id,
                                                                t
                                                            )
                                                        }
                                                        placeholder="Ajoutez vos observations..."
                                                        placeholderTextColor="#94a3b8"
                                                        multiline
                                                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900"
                                                        style={{
                                                            textAlignVertical:
                                                                "top",
                                                            minHeight: 80,
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </InspectionAccordion>
                            </View>
                        ))
                    ) : (
                        <View className="bg-white rounded-3xl p-8 shadow-lg border border-slate-200 items-center">
                            <Text className="text-slate-600 text-lg font-medium mb-2">
                                Aucune catégorie d&apos;inspection disponible
                            </Text>
                            <Text className="text-slate-500 text-sm text-center">
                                Les catégories d&apos;inspection seront chargées
                                automatiquement
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
