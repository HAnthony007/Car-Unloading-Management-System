import { ArrivalRow } from "@/src/components/arrival-row";
import { InfoRow } from "@/src/components/info-row";
import { Section } from "@/src/components/section";
import { Accordion } from "@/src/components/ui/accordion";
import { Field } from "@/src/components/ui/field";
import { DocumentsAccordion } from "@/src/modules/vehicules/components/documents-accordion";
import { ImagesSection } from "@/src/modules/vehicules/components/images-section";
import { MovementsAccordion } from "@/src/modules/vehicules/components/movement-accorion";
import { NotesAccordion } from "@/src/modules/vehicules/components/notes-accordion";
import { StatusSection } from "@/src/modules/vehicules/components/status-section";
import { useVehicleWorkflow } from "@/src/modules/vehicules/hooks/use-vehicle-workflow";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Calendar, Car, MapPin, Ship, X } from "lucide-react-native";
import { useState } from "react";
import {
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VehicleScreen() {
    const {
        vin,
        vehicle, // (debug usage below)
        discharge, // (debug usage below)
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

    // UI toggles
    const [showDocs, setShowDocs] = useState(false);
    const [showMovements, setShowMovements] = useState(false);
    const [showInspection, setShowInspection] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

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
                <ImagesSection
                    images={images}
                    addImage={() =>
                        setImages((prev) => [
                            ...prev,
                            `https://via.placeholder.com/150?text=${prev.length + 1}`,
                        ])
                    }
                />

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
                                    value={
                                        discharge?.vehicle?.make ?? undefined
                                    }
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Modèle"
                                    value={
                                        discharge?.vehicle?.model ?? undefined
                                    }
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Année"
                                    value={
                                        discharge?.vehicle?.year != null
                                            ? String(discharge?.vehicle?.year)
                                            : undefined
                                    }
                                />
                            </View>
                            <View className="w-1/2 px-1">
                                <InfoRow
                                    label="Couleur"
                                    value={
                                        discharge?.vehicle?.color ?? undefined
                                    }
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
                                    value={
                                        discharge?.vehicle?.weight != null
                                            ? String(discharge?.vehicle?.weight)
                                            : undefined
                                    }
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
                            value="Toamasina I"
                        />
                        <ArrivalRow
                            icon={Ship}
                            label="Navire"
                            value={
                                discharge?.port_call?.vessel?.vessel_name || "—"
                            }
                        />
                        <ArrivalRow
                            icon={Calendar}
                            label="Arrivée"
                            value={
                                discharge?.port_call?.arrival_date != null
                                    ? String(discharge?.port_call?.arrival_date)
                                    : "—"
                            }
                        />
                        <ArrivalRow
                            icon={Car}
                            label="Agent"
                            value={discharge?.agent?.full_name || "—"}
                        />
                        <ArrivalRow
                            icon={MapPin}
                            label="Origine"
                            value={discharge?.port_call?.origin_port || "—"}
                            subtle
                        />
                    </View>
                    {/* Editable arrival removed for simplified view */}
                </Section>

                {/* Status */}
                <Section title="Statut Actuel">
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
                </Section>

                {/* Documents */}
                <DocumentsAccordion
                    open={showDocs}
                    toggle={() => setShowDocs((v) => !v)}
                    documents={documents}
                    addDocument={addDocument}
                    onDownload={(id) => console.log("DL doc", id)}
                />

                {/* Movement history */}
                <MovementsAccordion
                    open={showMovements}
                    toggle={() => setShowMovements((v) => !v)}
                    movements={movements}
                    addMovementRecord={(from, to, reason, reset) =>
                        addMovementRecord(from, to, reason, reset)
                    }
                />

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
                <NotesAccordion
                    open={showNotes}
                    toggle={() => setShowNotes((v) => !v)}
                    notes={notes}
                    handleAddNote={(title, content, reset) =>
                        handleAddNote(title, content, reset)
                    }
                />
            </ScrollView>
            <StatusBar style={Platform.OS === "ios" ? "dark" : "auto"} />
        </SafeAreaView>
    );
}
