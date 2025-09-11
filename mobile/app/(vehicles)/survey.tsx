import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import {
    HalfField,
    InfoField,
} from "@/src/modules/vehicules/components/info-field";
import { InspectionAccordion } from "@/src/modules/vehicules/components/inspection-accordion";
import { StatusChip } from "@/src/modules/vehicules/components/status-chip";
import { useInspection } from "@/src/modules/vehicules/hooks/use-inspection";
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    Minus,
} from "lucide-react-native";
import { useEffect } from "react";
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

    // Example ensure metadata present (optional)
    useEffect(() => {
        // Could prefill if needed; left minimal here.
    }, []);

    // Handlers already provided by hook

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView
                className="flex-1 bg-slate-50"
                contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* General vehicle info */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-slate-900 mb-3">
                        Information Générale
                    </Text>
                    <View className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-sm">
                        <InfoField label="VIN" value={vin} mono />
                        <View className="flex-row flex-wrap -mx-1">
                            <HalfField
                                label="Marque"
                                value={metadata?.identification.make}
                            />
                            <HalfField
                                label="Modèle"
                                value={metadata?.identification.model}
                            />
                            <HalfField
                                label="Année"
                                value={metadata?.identification.year}
                            />
                            <HalfField
                                label="Couleur"
                                value={metadata?.identification.color}
                            />
                        </View>
                    </View>
                </View>

                {/* Categories accordions */}
                {categories.map((cat, idx) => (
                    <InspectionAccordion
                        key={cat.key}
                        title={cat.title}
                        description={cat.description}
                        defaultOpen={idx === 0}
                    >
                        {cat.items.map((it) => (
                            <View
                                key={it.id}
                                className="mb-5 last:mb-0 border border-gray-200 bg-white rounded-xl p-3"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-xs font-semibold text-slate-900 flex-1 pr-2">
                                        {it.label}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <StatusChip
                                            active={it.status === "ok"}
                                            label="OK"
                                            tone="emerald"
                                            onPress={() =>
                                                setStatus(cat.key, it.id, "ok")
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
                                                setStatus(cat.key, it.id, "na")
                                            }
                                            icon={Minus}
                                        />
                                    </View>
                                </View>
                                <View className="mb-3">
                                    <Text className="text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                        Photos ({it.photos.length}/4)
                                    </Text>
                                    <View className="flex-row flex-wrap -m-1">
                                        {it.photos.map((p, idx) => (
                                            <View
                                                key={p + idx}
                                                className="w-16 h-16 m-1 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                                            >
                                                <Image
                                                    source={{ uri: p }}
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                />
                                            </View>
                                        ))}
                                        {it.photos.length < 4 && (
                                            <TouchableOpacity
                                                onPress={() =>
                                                    addPhoto(cat.key, it.id)
                                                }
                                                className="w-16 h-16 m-1 rounded-lg border-2 border-dashed border-emerald-300 items-center justify-center bg-emerald-50"
                                            >
                                                <Camera
                                                    size={18}
                                                    color="#059669"
                                                />
                                                <Text className="text-[9px] mt-0.5 font-medium text-emerald-700">
                                                    Ajouter
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                                <View>
                                    <Text className="text-[10px] font-medium text-gray-500 mb-1 uppercase tracking-wide">
                                        Commentaire
                                    </Text>
                                    <TextInput
                                        value={it.comment}
                                        onChangeText={(t) =>
                                            setComment(cat.key, it.id, t)
                                        }
                                        placeholder="Observation..."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-900 bg-gray-50"
                                        style={{
                                            textAlignVertical: "top",
                                            minHeight: 60,
                                        }}
                                    />
                                </View>
                            </View>
                        ))}
                    </InspectionAccordion>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
