import { useScannerStore } from "@/lib/store";
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    ChevronDown,
    Minus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Data structures for inspection checklist
type ItemStatus = "ok" | "defaut" | "na";
interface ChecklistItem {
    id: string;
    label: string;
    status: ItemStatus;
    comment: string;
    photos: string[]; // URIs placeholders
}
interface CategoryBlock {
    key: string;
    title: string;
    description: string;
    items: ChecklistItem[];
}

const makeItems = (labels: string[]): ChecklistItem[] =>
    labels.map((l) => ({
        id: `${l}-${Math.random().toString(36).slice(2, 7)}`,
        label: l,
        status: "ok",
        comment: "",
        photos: [],
    }));

const INITIAL_CATEGORIES: CategoryBlock[] = [
    {
        key: "exterior",
        title: "Extérieur",
        description: "Inspection de la carrosserie et des éléments extérieurs",
        items: makeItems([
            "Carrosserie",
            "Portes / Fermetures",
            "Pare-chocs",
            "Vitres & Rétroviseurs",
            "Feux / Éclairage",
            "Pneumatiques",
        ]),
    },
    {
        key: "interior",
        title: "Intérieur",
        description: "Inspection de l'habitacle et des équipements intérieurs",
        items: makeItems([
            "Sièges",
            "Ceintures",
            "Tableau de bord",
            "Commandes",
            "Climatisation / Ventilation",
        ]),
    },
    {
        key: "engine",
        title: "Moteur",
        description: "Inspection du compartiment moteur et mécanique",
        items: makeItems([
            "Huile moteur",
            "Liquide de refroidissement",
            "Batterie",
            "Système de freinage",
            "Courroies / Fuites",
        ]),
    },
    {
        key: "docs",
        title: "Documentation",
        description: "Vérification des papiers et documents",
        items: makeItems([
            "Carte grise",
            "Certificat conformité",
            "Carnet entretien",
            "Assurance",
        ]),
    },
    {
        key: "safety",
        title: "Équipement de sécurité",
        description: "Vérification des équipements de sécurité obligatoires",
        items: makeItems([
            "Triangle",
            "Gilet haute visibilité",
            "Extincteur",
            "Trousse de secours",
            "Roue de secours ou kit",
        ]),
    },
];

export default function SurveyScreen() {
    const metadata = useScannerStore((s) => s.metadata);
    const vin = useScannerStore((s) => s.vin || "VIN-INCONNU");
    const [categories, setCategories] =
        useState<CategoryBlock[]>(INITIAL_CATEGORIES);

    // Example ensure metadata present (optional)
    useEffect(() => {
        // Could prefill if needed; left minimal here.
    }, []);

    const updateItem = (
        catKey: string,
        itemId: string,
        patch: Partial<ChecklistItem>
    ) => {
        setCategories((prev) =>
            prev.map((c) =>
                c.key === catKey
                    ? {
                          ...c,
                          items: c.items.map((it) =>
                              it.id === itemId ? { ...it, ...patch } : it
                          ),
                      }
                    : c
            )
        );
    };

    const addPhoto = (catKey: string, itemId: string) => {
        updateItem(catKey, itemId, {
            photos: [
                ...categories
                    .find((c) => c.key === catKey)!
                    .items.find((i) => i.id === itemId)!.photos,
                `https://via.placeholder.com/120x90?text=${Math.random()
                    .toString(36)
                    .slice(2, 5)}`,
            ].slice(0, 4), // limit 4
        });
    };

    const setStatus = (cat: string, id: string, status: ItemStatus) =>
        updateItem(cat, id, { status });
    const setComment = (cat: string, id: string, comment: string) =>
        updateItem(cat, id, { comment });

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
                {categories.map((cat) => (
                    <InspectionAccordion
                        key={cat.key}
                        title={cat.title}
                        description={cat.description}
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
                                {/* Photos */}
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
                                {/* Commentaire */}
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

// Small components
function InfoField({
    label,
    value,
    mono,
}: {
    label: string;
    value?: string;
    mono?: boolean;
}) {
    return (
        <View>
            <Text className="text-[10px] font-medium text-gray-500 mb-0.5 uppercase tracking-wide">
                {label}
            </Text>
            <Text
                className={`text-xs font-semibold text-slate-900 ${mono ? "tracking-widest" : ""}`}
                style={mono ? { fontFamily: "monospace" } : undefined}
                numberOfLines={1}
            >
                {value || "—"}
            </Text>
        </View>
    );
}

function HalfField({ label, value }: { label: string; value?: string }) {
    return (
        <View className="w-1/2 px-1 mb-2">
            <InfoField label={label} value={value} />
        </View>
    );
}

function StatusChip({
    active,
    label,
    onPress,
    tone,
    icon: Icon,
}: {
    active: boolean;
    label: string;
    onPress: () => void;
    tone: "emerald" | "amber" | "slate";
    icon: any;
}) {
    const map: Record<string, { bg: string; text: string; border: string }> = {
        emerald: {
            bg: active ? "bg-emerald-600" : "bg-emerald-50",
            text: active ? "text-white" : "text-emerald-700",
            border: active ? "border-emerald-600" : "border-emerald-200",
        },
        amber: {
            bg: active ? "bg-amber-600" : "bg-amber-50",
            text: active ? "text-white" : "text-amber-700",
            border: active ? "border-amber-600" : "border-amber-200",
        },
        slate: {
            bg: active ? "bg-slate-600" : "bg-slate-100",
            text: active ? "text-white" : "text-slate-700",
            border: active ? "border-slate-600" : "border-slate-300",
        },
    };
    const t = map[tone];
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`ml-1 px-2 h-7 rounded-full border flex-row items-center ${t.bg} ${t.border}`}
            activeOpacity={0.85}
        >
            <Icon
                size={12}
                color={
                    active
                        ? "#fff"
                        : t.text.replace("text-", "#").includes("#")
                          ? "#000"
                          : undefined
                }
            />
            <Text className={`ml-1 text-[10px] font-semibold ${t.text}`}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

function InspectionAccordion({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);
    const [render, setRender] = useState(open);
    const anim = useState(new Animated.Value(open ? 1 : 0))[0];
    useEffect(() => {
        if (open) setRender(true);
        Animated.timing(anim, {
            toValue: open ? 1 : 0,
            duration: 240,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished && !open) setRender(false);
        });
    }, [open, anim]);
    const rotate = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });
    return (
        <View className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <TouchableOpacity
                onPress={() => setOpen((v) => !v)}
                className="px-5 py-4 flex-row items-center justify-between"
                activeOpacity={0.85}
            >
                <View className="flex-1 pr-4">
                    <Text className="text-sm font-semibold text-slate-900 mb-0.5">
                        {title}
                    </Text>
                    <Text
                        className="text-[10px] text-gray-500"
                        numberOfLines={2}
                    >
                        {description}
                    </Text>
                </View>
                <Animated.View style={{ transform: [{ rotate }] }}>
                    <ChevronDown size={18} color="#374151" />
                </Animated.View>
            </TouchableOpacity>
            {render && (
                <Animated.View
                    style={{
                        maxHeight: anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 1200],
                        }),
                        opacity: anim,
                    }}
                >
                    <View className="h-px bg-gray-100 mx-5" />
                    <View className="px-5 py-4">{children}</View>
                </Animated.View>
            )}
        </View>
    );
}
