import { DocumentsAccordion } from "@/src/modules/vehicules/components/documents-accordion";
import { ImagesSection } from "@/src/modules/vehicules/components/images-section";
import { InspectionsAccordion } from "@/src/modules/vehicules/components/inspections-accordion";
import { MovementsAccordion } from "@/src/modules/vehicules/components/movement-accorion";
import { NotesAccordion } from "@/src/modules/vehicules/components/notes-accordion";
import { StatusSection } from "@/src/modules/vehicules/components/status-section";
import { useInspectionsAccordion } from "@/src/modules/vehicules/hooks/use-inspections-accordion";
import { useVehicleWorkflow } from "@/src/modules/vehicules/hooks/use-vehicle-workflow";
import { useInspectionSync } from "@/src/modules/vehicules/stores/inspection-sync";
import { LinearGradient } from "expo-linear-gradient";
import {
    Activity,
    Anchor,
    Calendar,
    Calendar as CalendarIcon,
    Car,
    FileText,
    Globe,
    MapPin,
    Navigation,
    Palette,
    Settings,
    User,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function VehicleScreenBody() {
    const {
        vin,
        discharge,
        inspection,
        saveInspection,
        movements,
        addMovementRecord,
        metadata,
        documents,
        addDocument,
        notes,
        handleAddNote,
        images,
        setImages,
        vehicleCondition,
        setVehicleCondition,
        inspectionNotes,
        setInspectionNotes,
    } = useVehicleWorkflow();

    // Inspections data from API
    const {
        inspections,
        loading: inspectionsLoading,
        error: inspectionsError,
        validateInspection,
        startInspection,
        refetch: refetchInspections,
    } = useInspectionsAccordion();

    // Cross-screen refresh: when survey confirms changes, bump version -> refetch here
    const version = useInspectionSync((s) => s.version);
    useEffect(() => {
        // Avoid firing on mount unnecessarily; refetch on any version bump
        refetchInspections();
    }, [version, refetchInspections]);

    // UI toggles
    const [showDocs, setShowDocs] = useState(false);
    const [showMovements, setShowMovements] = useState(false);
    const [showInspection, setShowInspection] = useState(false);
    const [showInspections, setShowInspections] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    // Calculate vehicle statistics
    const vehicleStats = useMemo(() => {
        const totalDocuments = documents.length;
        const totalMovements = movements.length;
        const totalImages = images.length;
        const totalNotes = notes.length;

        const hasInspection = !!inspection;
        const inspectionStatus = inspection?.condition || "Non inspecté";

        return {
            totalDocuments,
            totalMovements,
            totalImages,
            totalNotes,
            hasInspection,
            inspectionStatus,
            completionPercentage: hasInspection ? 100 : 0,
        };
    }, [documents, movements, images, notes, inspection]);
    console.log("Vehicle stats:", discharge);

    // Inspection handlers
    const handleValidateInspection = async (inspectionId: string) => {
        try {
            await validateInspection(inspectionId);
        } catch (error) {
            console.error("Error validating inspection:", error);
        }
    };

    const handleStartInspection = async (inspectionId: string) => {
        try {
            await startInspection(inspectionId);
        } catch (error) {
            console.error("Error starting inspection:", error);
        }
    };

    return (
        <ScrollView
            className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100"
            contentContainerStyle={{ paddingBottom: 100 }}
            overScrollMode="never"
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            {/* Header with vehicle overview */}
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
                                    Résumé Véhicule
                                </Text>
                                <Text className="text-slate-300 text-sm">
                                    {discharge?.vehicle?.make}{" "}
                                    {discharge?.vehicle?.model}
                                </Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="text-white text-2xl font-bold">
                                {vehicleStats.completionPercentage}%
                            </Text>
                            <Text className="text-slate-300 text-xs">
                                Complet
                            </Text>
                        </View>
                    </View>

                    {/* Progress bar */}
                    <View className="bg-white/20 rounded-full h-2 mb-4">
                        <View
                            className="bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full h-2"
                            style={{
                                width: `${vehicleStats.completionPercentage}%`,
                            }}
                        />
                    </View>

                    {/* Stats grid */}
                    <View className="flex-row justify-between">
                        <View className="items-center">
                            <Text className="text-blue-400 text-lg font-bold">
                                {vehicleStats.totalDocuments}
                            </Text>
                            <Text className="text-slate-300 text-xs">
                                Documents
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-purple-400 text-lg font-bold">
                                {vehicleStats.totalMovements}
                            </Text>
                            <Text className="text-slate-300 text-xs">
                                Mouvements
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-amber-400 text-lg font-bold">
                                {vehicleStats.totalImages}
                            </Text>
                            <Text className="text-slate-300 text-xs">
                                Photos
                            </Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-emerald-400 text-lg font-bold">
                                {vehicleStats.totalNotes}
                            </Text>
                            <Text className="text-slate-300 text-xs">
                                Notes
                            </Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

            {/* Images Section */}
            <View className="px-6 mb-6">
                <ImagesSection
                    images={images}
                    addImage={() =>
                        setImages((prev) => [
                            ...prev,
                            `https://via.placeholder.com/150?text=${prev.length + 1}`,
                        ])
                    }
                />
            </View>

            {/* Vehicle Identification Card */}
            <View className="px-6 mb-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-blue-100 rounded-2xl items-center justify-center mr-3">
                            <Settings size={20} color="#3b82f6" />
                        </View>
                        <Text className="text-slate-900 text-lg font-bold">
                            Identification Véhicule
                        </Text>
                    </View>

                    {/* VIN Section */}
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

                    {/* Vehicle Details Grid */}
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
                                    {discharge?.vehicle?.make || "—"}
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
                                    {discharge?.vehicle?.model || "—"}
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
                                    {discharge?.vehicle?.year || "—"}
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
                                    {discharge?.vehicle?.color || "—"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Technical Specifications Card */}
            <View className="px-6 mb-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-purple-100 rounded-2xl items-center justify-center mr-3">
                            <Settings size={20} color="#8b5cf6" />
                        </View>
                        <Text className="text-slate-900 text-lg font-bold">
                            Spécifications Techniques
                        </Text>
                    </View>

                    <View className="flex-row flex-wrap -mx-2">
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Moteur
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {metadata?.specs.engine || "—"}
                                </Text>
                            </View>
                        </View>
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Transmission
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {metadata?.specs.transmission || "—"}
                                </Text>
                            </View>
                        </View>
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Carburant
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {metadata?.specs.fuel || "—"}
                                </Text>
                            </View>
                        </View>
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Portes
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {metadata?.specs.doors || "—"}
                                </Text>
                            </View>
                        </View>
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Places
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {metadata?.specs.seats || "—"}
                                </Text>
                            </View>
                        </View>
                        <View className="w-1/2 px-2 mb-3">
                            <View className="bg-slate-50 rounded-xl p-3">
                                <View className="flex-row items-center mb-1">
                                    <Settings size={14} color="#64748b" />
                                    <Text className="text-slate-600 text-xs font-medium ml-1">
                                        Poids
                                    </Text>
                                </View>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {discharge?.vehicle?.weight
                                        ? `${discharge.vehicle.weight} kg`
                                        : "—"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Arrival Information Card */}
            <View className="px-6 mb-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-green-100 rounded-2xl items-center justify-center mr-3">
                            <Navigation size={20} color="#10b981" />
                        </View>
                        <Text className="text-slate-900 text-lg font-bold">
                            Information d&apos;Arrivée
                        </Text>
                    </View>

                    <View className="space-y-3">
                        <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
                            <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3">
                                <MapPin size={16} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-600 text-xs font-medium">
                                    Port
                                </Text>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    Toamasina I
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
                            <View className="w-8 h-8 bg-purple-100 rounded-lg items-center justify-center mr-3">
                                <Anchor size={16} color="#8b5cf6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-600 text-xs font-medium">
                                    Navire
                                </Text>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {discharge?.port_call?.vessel
                                        ?.vessel_name || "—"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
                            <View className="w-8 h-8 bg-amber-100 rounded-lg items-center justify-center mr-3">
                                <CalendarIcon size={16} color="#f59e0b" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-600 text-xs font-medium">
                                    Date d&apos;Arrivée
                                </Text>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {discharge?.port_call?.arrival_date || "—"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
                            <View className="w-8 h-8 bg-emerald-100 rounded-lg items-center justify-center mr-3">
                                <User size={16} color="#10b981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-600 text-xs font-medium">
                                    Agent
                                </Text>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {discharge?.agent?.full_name || "—"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center p-3 bg-slate-50 rounded-xl">
                            <View className="w-8 h-8 bg-slate-100 rounded-lg items-center justify-center mr-3">
                                <Globe size={16} color="#64748b" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-slate-600 text-xs font-medium">
                                    Port d&apos;Origine
                                </Text>
                                <Text className="text-slate-900 text-sm font-semibold">
                                    {discharge?.port_call?.origin_port || "—"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Status Section */}
            <View className="px-6 mb-6">
                <View className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-orange-100 rounded-2xl items-center justify-center mr-3">
                            <Activity size={20} color="#f97316" />
                        </View>
                        <Text className="text-slate-900 text-lg font-bold">
                            Statut Actuel
                        </Text>
                    </View>
                    <StatusSection
                        inspectionCondition={inspection?.condition}
                        movementsCount={movements.length}
                        imagesCount={images.length}
                        documentsCount={documents.length}
                        vehicleCondition={vehicleCondition}
                        setVehicleCondition={setVehicleCondition}
                        inspectionNotes={inspectionNotes}
                        setInspectionNotes={setInspectionNotes}
                        saveInspection={saveInspection}
                    />
                </View>
            </View>

            {/* Documents Accordion */}
            <View className="px-6 mb-6">
                <DocumentsAccordion
                    open={showDocs}
                    toggle={() => setShowDocs((v) => !v)}
                    documents={documents}
                    addDocument={addDocument}
                    onDownload={(id) => console.log("DL doc", id)}
                />
            </View>

            {/* Movements Accordion */}
            <View className="px-6 mb-6">
                <MovementsAccordion
                    open={showMovements}
                    toggle={() => setShowMovements((v) => !v)}
                    movements={movements}
                    addMovementRecord={(from, to, reason, reset) =>
                        addMovementRecord(from, to, reason, reset)
                    }
                />
            </View>

            {/* Inspections Accordion */}
            <View className="px-6 mb-6">
                <InspectionsAccordion
                    open={showInspections}
                    toggle={() => setShowInspections((v) => !v)}
                    inspections={inspections}
                    onValidateInspection={handleValidateInspection}
                    onStartInspection={handleStartInspection}
                    loading={inspectionsLoading}
                    error={inspectionsError}
                />
            </View>

            {/* Inspection Report Accordion */}
            <View className="px-6 mb-6">
                <View className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                    <TouchableOpacity
                        onPress={() => setShowInspection((v) => !v)}
                        className="px-6 py-4 flex-row items-center justify-between"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center">
                            <View className="w-8 h-8 bg-blue-100 rounded-lg items-center justify-center mr-3">
                                <FileText size={16} color="#3b82f6" />
                            </View>
                            <Text className="text-slate-900 text-base font-bold">
                                Rapport d&apos;Inspection
                            </Text>
                        </View>
                        <View className="w-6 h-6 bg-slate-100 rounded-full items-center justify-center">
                            <Text className="text-slate-600 text-sm font-bold">
                                {showInspection ? "−" : "+"}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {showInspection && (
                        <View className="px-6 pb-6">
                            <View className="h-px bg-slate-100 mb-4" />
                            {inspection ? (
                                <View className="space-y-3">
                                    <View className="bg-slate-50 rounded-xl p-3">
                                        <Text className="text-slate-600 text-xs font-medium mb-1">
                                            État
                                        </Text>
                                        <Text className="text-slate-900 text-sm font-semibold">
                                            {inspection.condition}
                                        </Text>
                                    </View>
                                    <View className="bg-slate-50 rounded-xl p-3">
                                        <Text className="text-slate-600 text-xs font-medium mb-1">
                                            Notes
                                        </Text>
                                        <Text className="text-slate-900 text-sm font-semibold">
                                            {inspection.notes || "Aucune note"}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View className="bg-slate-50 rounded-xl p-4 items-center">
                                    <Text className="text-slate-500 text-sm text-center">
                                        Aucune inspection enregistrée
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* Notes Accordion */}
            <View className="px-6 mb-6">
                <NotesAccordion
                    open={showNotes}
                    toggle={() => setShowNotes((v) => !v)}
                    notes={notes}
                    handleAddNote={(title, content, reset) =>
                        handleAddNote(title, content, reset)
                    }
                />
            </View>
        </ScrollView>
    );
}
