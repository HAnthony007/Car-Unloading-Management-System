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
import { Calendar, Car, MapPin, Ship } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

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

    // UI toggles
    const [showDocs, setShowDocs] = useState(false);
    const [showMovements, setShowMovements] = useState(false);
    const [showInspection, setShowInspection] = useState(false);
    const [showNotes, setShowNotes] = useState(false);

    return (
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

                    <View className="flex-row flex-wrap -mx-1">
                        <View className="w-1/2 px-1">
                            <InfoRow
                                label="Marque"
                                value={discharge?.vehicle?.make ?? undefined}
                            />
                        </View>
                        <View className="w-1/2 px-1">
                            <InfoRow
                                label="Modèle"
                                value={discharge?.vehicle?.model ?? undefined}
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
                                value={discharge?.vehicle?.color ?? undefined}
                            />
                        </View>
                    </View>
                </View>
            </Section>

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

            <Section title="Information d'arrivée">
                <View className="space-y-4 gap-1 mb-2">
                    <ArrivalRow
                        icon={MapPin}
                        label="Port"
                        value="Toamasina I"
                    />
                    <ArrivalRow
                        icon={Ship}
                        label="Navire"
                        value={discharge?.port_call?.vessel?.vessel_name || "—"}
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
            </Section>

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

            <DocumentsAccordion
                open={showDocs}
                toggle={() => setShowDocs((v) => !v)}
                documents={documents}
                addDocument={addDocument}
                onDownload={(id) => console.log("DL doc", id)}
            />

            <MovementsAccordion
                open={showMovements}
                toggle={() => setShowMovements((v) => !v)}
                movements={movements}
                addMovementRecord={(from, to, reason, reset) =>
                    addMovementRecord(from, to, reason, reset)
                }
            />

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

            <NotesAccordion
                open={showNotes}
                toggle={() => setShowNotes((v) => !v)}
                notes={notes}
                handleAddNote={(title, content, reset) =>
                    handleAddNote(title, content, reset)
                }
            />
        </ScrollView>
    );
}
