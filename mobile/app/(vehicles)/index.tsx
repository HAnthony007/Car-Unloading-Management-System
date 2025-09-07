import { Accordion } from "@/components/ui/accordion";
import { ArrivalRow } from "@/components/ui/arrival-row";
import { StatusBadge } from "@/components/ui/badge-status";
import { Field } from "@/components/ui/field";
import { InfoRow } from "@/components/ui/info-row";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { useScannerStore } from "@/lib/store";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    Calendar,
    Car,
    Clock3,
    Download,
    FilePlus2,
    FolderOpen,
    Image as Img,
    MapPin,
    MoveRight,
    NotebookPen,
    Plus,
    Ship,
    X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleScreen() {
    const vin = useScannerStore((s) => s.vin || undefined);
    const inspection = useScannerStore((s) => s.inspection);
    const setInspection = useScannerStore((s) => s.setInspection);
    const movements = useScannerStore((s) => s.movements);
    const addMovement = useScannerStore((s) => s.addMovement);
    const metadata = useScannerStore((s) => s.metadata);
    const setMetadata = useScannerStore((s) => s.setMetadata);
    const documents = useScannerStore((s) => s.documents);
    const addDocument = useScannerStore((s) => s.addDocument);
    const notes = useScannerStore((s) => s.notes);
    const addNote = useScannerStore((s) => s.addNote);

    // Local UI state
    const [showDocs, setShowDocs] = useState(true);
    const [showMovements, setShowMovements] = useState(true);
    const [showInspection, setShowInspection] = useState(true);
    const [showNotes, setShowNotes] = useState(true);
    const [addingMovement, setAddingMovement] = useState(false);
    const [mvFrom, setMvFrom] = useState("");
    const [mvTo, setMvTo] = useState("");
    const [mvReason, setMvReason] = useState("");
    const [vehicleCondition, setVehicleCondition] = useState(
        inspection?.condition || ""
    );
    const [inspectionNotes, setInspectionNotes] = useState(
        inspection?.notes || ""
    );
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");
    const [addingNote, setAddingNote] = useState(false);
    // editingMeta removed – simplified read-only styled sections

    // Mock images (placeholder URIs). In real implementation we would allow picking images.
    const [images, setImages] = useState<string[]>([]);

    // Helpers (UI formatting)
    const formatRelative = (iso?: string) => {
        if (!iso) return "—";
        const d = new Date(iso);
        const now = Date.now();
        const diffMs = d.getTime() - now;
        const abs = Math.abs(diffMs);
        const min = Math.round(abs / 60000);
        if (min < 1) return "à l'instant";
        if (min < 60)
            return diffMs < 0 ? `il y a ${min} min` : `dans ${min} min`;
        const h = Math.round(min / 60);
        if (h < 24) return diffMs < 0 ? `il y a ${h} h` : `dans ${h} h`;
        const dDays = Math.round(h / 24);
        return diffMs < 0 ? `il y a ${dDays} j` : `dans ${dDays} j`;
    };

    const handleDownloadDocument = (docId: string) => {
        // Placeholder pour téléchargement futur (expo-file-system / sharing)
        console.log("Téléchargement doc", docId);
    };

    // Prefill mock data if empty (metadata, inspection, movements)
    useEffect(() => {
        if (!metadata) {
            setMetadata({
                identification: {
                    make: "Toyota",
                    model: "Corolla",
                    year: "2023",
                    color: "Blanc Perle",
                },
                specs: {
                    engine: "1.8L Hybrid",
                    transmission: "CVT",
                    fuel: "Hybride Essence",
                    doors: "4",
                    seats: "5",
                    weight: "1350 kg",
                },
                arrival: {
                    port: "Port de Dakar",
                    vessel: "MV Atlantic Star",
                    arrivalDate: new Date(Date.now() - 86400000)
                        .toISOString()
                        .slice(0, 10),
                    agent: "Bolloré",
                    origin: "Anvers",
                },
            });
        }
        if (!inspection) {
            setInspection({
                condition: "Neuf",
                notes: "Inspection initiale: aucune anomalie visible, carrosserie propre, niveaux OK.",
            });
            setVehicleCondition("Neuf");
            setInspectionNotes(
                "Inspection initiale: aucune anomalie visible, carrosserie propre, niveaux OK."
            );
        }
        if (movements.length === 0) {
            const samples = [
                {
                    from: "Quai Débarquement",
                    to: "Zone Tampon",
                    reason: "Déchargement navire",
                },
                {
                    from: "Zone Tampon",
                    to: "Zone A2",
                    reason: "Placement initial",
                },
                {
                    from: "Zone A2",
                    to: "Zone B5",
                    reason: "Optimisation stockage",
                },
            ];
            // Add in chronological order so last becomes most récent en haut (addMovement préfixe)
            samples.forEach((mv) => addMovement(mv));
            // Initialize movement form convenience
            setMvFrom("Zone B5");
        }
    }, [
        metadata,
        inspection,
        movements.length,
        setMetadata,
        setInspection,
        addMovement,
    ]);

    const saveInspection = () => {
        if (vehicleCondition || inspectionNotes) {
            setInspection({
                condition: vehicleCondition,
                notes: inspectionNotes,
            });
        }
    };

    const addMovementRecord = () => {
        if (!mvFrom || !mvTo) return;
        addMovement({ from: mvFrom, to: mvTo, reason: mvReason });
        setMvReason("");
        setMvFrom(mvTo);
        setMvTo("");
        setAddingMovement(false);
    };

    const handleAddNote = () => {
        if (!newNoteTitle || !newNoteContent) return;
        addNote({ title: newNoteTitle, content: newNoteContent });
        setNewNoteTitle("");
        setNewNoteContent("");
        setAddingNote(false);
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-gray-200">
                <Text className="text-lg font-semibold text-slate-900">
                    Détails Véhicule
                </Text>
                <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                    onPress={() => router.back()}
                >
                    <X color="#374151" size={22} />
                </TouchableOpacity>
            </View>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 20, paddingBottom: 64 }}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Images */}
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
                                onPress={() => {
                                    // Placeholder add mock image
                                    setImages((prev) => [
                                        ...prev,
                                        `https://via.placeholder.com/150?text=${prev.length + 1}`,
                                    ]);
                                }}
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

                <Section title="Identification">
                    <Text className="text-xs font-medium text-gray-500 mb-2">
                        Général
                    </Text>
                    <View className="bg-white -mx-1">
                        <InfoRow label="VIN" value={vin} monospace highlight />
                        {/* Two-column layout for marque / modèle / année / couleur on React Native */}
                        <View className="flex-row flex-wrap -mx-1">
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Marque"
                                    value={metadata?.identification.make}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Modèle"
                                    value={metadata?.identification.model}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Année"
                                    value={metadata?.identification.year}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Couleur"
                                    value={metadata?.identification.color}
                                />
                            </View>
                        </View>
                    </View>
                </Section>

                {/* Specifications */}
                <Section title="Specifications">
                    <Text className="text-xs font-medium text-gray-500 mb-2">
                        Techniques
                    </Text>
                    <View className="bg-white -mx-1">
                        <View className="flex-row flex-wrap -mx-1">
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Moteur"
                                    value={metadata?.specs.engine}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Transmission"
                                    value={metadata?.specs.transmission}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Carburant"
                                    value={metadata?.specs.fuel}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Portes"
                                    value={metadata?.specs.doors}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Places"
                                    value={metadata?.specs.seats}
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Poids"
                                    value={metadata?.specs.weight}
                                />
                            </View>
                        </View>
                    </View>
                </Section>

                {/* Arrival Information */}
                <Section title="Information d'arrivée">
                    <View className="space-y-4 mb-2">
                        <ArrivalRow
                            icon={MapPin}
                            label="Port"
                            value={metadata?.arrival.port}
                        />
                        <ArrivalRow
                            icon={Ship}
                            label="Navire"
                            value={metadata?.arrival.vessel}
                        />
                        <ArrivalRow
                            icon={Calendar}
                            label="Arrivée"
                            value={metadata?.arrival.arrivalDate}
                        />
                        <ArrivalRow
                            icon={Car}
                            label="Agent"
                            value={metadata?.arrival.agent}
                        />
                        <ArrivalRow
                            icon={MapPin}
                            label="Origine"
                            value={metadata?.arrival.origin}
                            subtle
                        />
                    </View>
                    {/* Editable arrival removed for simplified view */}
                </Section>

                {/* Status */}
                <Section title="Statut Actuel">
                    <View className="flex-row flex-wrap -m-1 mb-3">
                        <StatusBadge
                            label="Inspection"
                            value={inspection?.condition || "À définir"}
                        />
                        <StatusBadge
                            label="Mouvements"
                            value={`${movements.length}`}
                            tone="blue"
                        />
                        <StatusBadge
                            label="Photos"
                            value={`${images.length}/5`}
                            tone="amber"
                        />
                        <StatusBadge
                            label="Docs"
                            value={`${documents.length}`}
                            tone="violet"
                        />
                    </View>
                    <Text className="text-[11px] font-medium text-gray-500 mb-1">
                        Mise à jour Inspection
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-3">
                        {["Neuf", "Occasion", "Endommagé", "Réparé"].map(
                            (opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    onPress={() => setVehicleCondition(opt)}
                                    className={`px-3 h-8 rounded-full border items-center justify-center ${vehicleCondition === opt ? "bg-emerald-600 border-emerald-600" : "bg-white border-gray-300"}`}
                                >
                                    <Text
                                        className={`text-[11px] font-medium ${vehicleCondition === opt ? "text-white" : "text-gray-600"}`}
                                    >
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                    <TextInput
                        value={inspectionNotes}
                        onChangeText={setInspectionNotes}
                        placeholder="Notes inspection..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="border border-gray-300 rounded-xl px-4 py-3 text-sm text-slate-900 bg-gray-50"
                        style={{ textAlignVertical: "top", minHeight: 90 }}
                    />
                    <TouchableOpacity
                        onPress={saveInspection}
                        className="mt-3 self-start px-4 h-10 rounded-lg bg-emerald-600 items-center justify-center"
                    >
                        <Text className="text-white text-xs font-semibold">
                            Sauvegarder
                        </Text>
                    </TouchableOpacity>
                </Section>

                {/* Documents */}
                <Accordion
                    title={`Documentation (${documents.length})`}
                    open={showDocs}
                    toggle={() => setShowDocs((v) => !v)}
                >
                    {documents.length === 0 ? (
                        <Text className="text-[11px] text-gray-400">
                            Aucun document.
                        </Text>
                    ) : (
                        <View className="space-y-3">
                            {documents.map((d) => (
                                <TouchableOpacity
                                    key={d.id}
                                    activeOpacity={0.85}
                                    onPress={() => handleDownloadDocument(d.id)}
                                    className="flex-row items-center p-3 rounded-xl border border-gray-200 bg-white"
                                >
                                    <View className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 items-center justify-center mr-3">
                                        <FolderOpen size={18} color="#059669" />
                                    </View>
                                    <View className="flex-1 mr-3">
                                        <Text
                                            className="text-xs font-semibold text-slate-900"
                                            numberOfLines={1}
                                        >
                                            {d.name}
                                        </Text>
                                        <Text
                                            className="text-[10px] text-gray-500"
                                            numberOfLines={1}
                                        >
                                            {d.type} •{" "}
                                            {formatRelative(d.uploadedAt)}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            handleDownloadDocument(d.id)
                                        }
                                        className="px-2 h-8 rounded-lg bg-emerald-600 flex-row items-center"
                                    >
                                        <Download size={14} color="#fff" />
                                        <Text className="ml-1 text-[10px] font-semibold text-white">
                                            DL
                                        </Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={() =>
                            addDocument({
                                name: `Doc ${documents.length + 1}`,
                                type: "Général",
                            })
                        }
                        className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
                    >
                        <FilePlus2 size={16} color="#fff" />
                        <Text className="text-white text-xs font-semibold ml-2">
                            Ajouter
                        </Text>
                    </TouchableOpacity>
                </Accordion>

                {/* Movement history */}
                <Accordion
                    title={`Historique des mouvements (${movements.length})`}
                    open={showMovements}
                    toggle={() => setShowMovements((v) => !v)}
                >
                    {movements.length === 0 ? (
                        <Text className="text-[11px] text-gray-400">
                            Aucun mouvement.
                        </Text>
                    ) : (
                        <View className="space-y-3">
                            {movements.map((mv, idx) => (
                                <View key={mv.id} className="flex-row">
                                    <View className="items-center mr-3">
                                        <View className="w-3 h-3 rounded-full bg-emerald-500 mt-1" />
                                        {idx < movements.length - 1 && (
                                            <View className="w-px flex-1 bg-gray-300 mt-1" />
                                        )}
                                    </View>
                                    <View className="flex-1 p-3 rounded-xl border border-gray-200 bg-white">
                                        <View className="flex-row items-center mb-1">
                                            <Clock3 size={12} color="#6B7280" />
                                            <Text className="ml-1 text-[10px] text-gray-500">
                                                {formatRelative(mv.at)}
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center mb-1">
                                            <Text
                                                className="text-xs font-semibold text-slate-900"
                                                numberOfLines={1}
                                            >
                                                {mv.from}
                                            </Text>
                                            <MoveRight
                                                size={14}
                                                color="#059669"
                                                style={{ marginHorizontal: 6 }}
                                            />
                                            <Text
                                                className="text-xs font-semibold text-slate-900"
                                                numberOfLines={1}
                                            >
                                                {mv.to}
                                            </Text>
                                        </View>
                                        {mv.reason ? (
                                            <Text
                                                className="text-[11px] text-gray-600"
                                                numberOfLines={2}
                                            >
                                                {mv.reason}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                    {addingMovement ? (
                        <View className="mt-4 space-y-3">
                            <Input
                                label="De"
                                value={mvFrom}
                                onChangeText={setMvFrom}
                                placeholder="Zone A2"
                            />
                            <Input
                                label="Vers"
                                value={mvTo}
                                onChangeText={setMvTo}
                                placeholder="Zone B1"
                            />
                            <Input
                                label="Raison"
                                value={mvReason}
                                onChangeText={setMvReason}
                                placeholder="Réorganisation"
                            />
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={addMovementRecord}
                                    className="flex-1 h-10 rounded-lg bg-emerald-600 items-center justify-center"
                                >
                                    <Text className="text-white text-xs font-semibold">
                                        Enregistrer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAddingMovement(false)}
                                    className="flex-1 h-10 rounded-lg bg-gray-200 items-center justify-center"
                                >
                                    <Text className="text-gray-700 text-xs font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setAddingMovement(true)}
                            className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
                        >
                            <Plus size={16} color="#fff" />
                            <Text className="text-white text-xs font-semibold ml-2">
                                Ajouter mouvement
                            </Text>
                        </TouchableOpacity>
                    )}
                </Accordion>

                {/* Inspection Reports */}
                <Accordion
                    title="Rapport Inspection"
                    open={showInspection}
                    toggle={() => setShowInspection((v) => !v)}
                >
                    {inspection ? (
                        <View className="space-y-2">
                            <Field label="État" value={inspection.condition} />
                            <Field
                                label="Notes"
                                value={inspection.notes}
                                multiline
                            />
                        </View>
                    ) : (
                        <Text className="text-[11px] text-gray-400">
                            Aucune inspection enregistrée.
                        </Text>
                    )}
                </Accordion>

                {/* Agent Notes */}
                <Accordion
                    title={`Notes Agent (${notes.length})`}
                    open={showNotes}
                    toggle={() => setShowNotes((v) => !v)}
                >
                    {notes.length === 0 ? (
                        <Text className="text-[11px] text-gray-400">
                            Aucune note.
                        </Text>
                    ) : (
                        <View className="space-y-3">
                            {notes.map((n) => (
                                <View
                                    key={n.id}
                                    className="p-3 rounded-lg border border-gray-200 bg-white"
                                >
                                    <Text
                                        className="text-xs font-semibold text-slate-900"
                                        numberOfLines={1}
                                    >
                                        {n.title}
                                    </Text>
                                    <Text className="text-[10px] text-gray-500 mb-1">
                                        {new Date(n.createdAt).toLocaleString(
                                            "fr-FR"
                                        )}
                                    </Text>
                                    <Text
                                        className="text-[11px] text-gray-600"
                                        numberOfLines={3}
                                    >
                                        {n.content}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {addingNote ? (
                        <View className="mt-4 space-y-3">
                            <Input
                                label="Titre"
                                value={newNoteTitle}
                                onChangeText={setNewNoteTitle}
                                placeholder="Ex: Vérification carrosserie"
                            />
                            <Input
                                label="Contenu"
                                value={newNoteContent}
                                onChangeText={setNewNoteContent}
                                multiline
                                placeholder="Détails..."
                            />
                            <View className="flex-row gap-3">
                                <TouchableOpacity
                                    onPress={handleAddNote}
                                    className="flex-1 h-10 rounded-lg bg-emerald-600 items-center justify-center"
                                >
                                    <Text className="text-white text-xs font-semibold">
                                        Enregistrer
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => setAddingNote(false)}
                                    className="flex-1 h-10 rounded-lg bg-gray-200 items-center justify-center"
                                >
                                    <Text className="text-gray-700 text-xs font-semibold">
                                        Annuler
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => setAddingNote(true)}
                            className="mt-3 flex-row items-center self-start px-3 h-9 rounded-lg bg-emerald-600"
                        >
                            <NotebookPen size={16} color="#fff" />
                            <Text className="text-white text-xs font-semibold ml-2">
                                Ajouter note
                            </Text>
                        </TouchableOpacity>
                    )}
                </Accordion>
            </ScrollView>
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </SafeAreaView>
    );
}
