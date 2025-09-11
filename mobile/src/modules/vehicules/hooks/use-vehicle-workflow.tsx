import { Discharge } from "@/src/types/domain";
import { useEffect, useState } from "react";
import { useScannerStore } from "../../scanner/stores/scanner-store";

export const useVehicleWorkflow = () => {
    const vin = useScannerStore((s) => s.vin || undefined);
    const inspection = useScannerStore((s) => s.inspection);
    const setInspection = useScannerStore((s) => s.setInspection);
    const movements = useScannerStore((s) => s.movements);
    const addMovement = useScannerStore((s) => s.addMovement);
    const metadata = useScannerStore((s) => s.metadata);
    const vehicle = useScannerStore((s) => (s as any).vehicle);
    const discharge: Discharge = useScannerStore((s) => (s as any).discharge);
    const setMetadata = useScannerStore((s) => s.setMetadata);
    const documents = useScannerStore((s) => s.documents);
    const addDocument = useScannerStore((s) => s.addDocument);
    const notes = useScannerStore((s) => s.notes);
    const addNote = useScannerStore((s) => s.addNote);

    // local UI state extracted
    const [images, setImages] = useState<string[]>([]);
    const [vehicleCondition, setVehicleCondition] = useState(
        inspection?.condition || ""
    );
    const [inspectionNotes, setInspectionNotes] = useState(
        inspection?.notes || ""
    );

    useEffect(() => {
        // Prefill metadata
        if (!metadata) {
            // Build from real API objects if available
            if (vehicle || discharge) {
                setMetadata({
                    identification: {
                        vin: vehicle?.vin,
                        make: vehicle?.make || undefined,
                        model: vehicle?.model || undefined,
                        year: vehicle?.year ? String(vehicle.year) : undefined,
                        color: vehicle?.color || undefined,
                    },
                    specs: {
                        weight: vehicle?.weight
                            ? String(vehicle.weight)
                            : undefined,
                        // engine / transmission / fuel not present in resource -> left blank
                    },
                    arrival: {
                        port:
                            (discharge?.port_call as any)?.dock?.name ||
                            (discharge?.port_call as any)?.port_name ||
                            undefined,
                        vessel:
                            (discharge?.port_call as any)?.vessel
                                ?.vessel_name || undefined,
                        arrivalDate: discharge?.discharge_date?.slice(0, 10),
                        agent: (discharge?.agent as any)?.name || undefined,
                        origin:
                            (discharge?.port_call as any)?.origin_port ||
                            undefined,
                    },
                });
            } else {
                // fallback placeholder if nothing fetched yet
                setMetadata({
                    identification: { make: "—", model: "—" },
                    specs: {},
                    arrival: {},
                });
            }
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
            samples.forEach((mv) => addMovement(mv));
        }
    }, [
        metadata,
        inspection,
        movements.length,
        setMetadata,
        setInspection,
        addMovement,
        vehicle,
        discharge,
    ]);

    const saveInspection = () => {
        if (vehicleCondition || inspectionNotes) {
            setInspection({
                condition: vehicleCondition,
                notes: inspectionNotes,
            });
        }
    };

    const addMovementRecord = (
        from: string,
        to: string,
        reason: string,
        cb: () => void
    ) => {
        if (!from || !to) return;
        addMovement({ from, to, reason });
        cb();
    };

    const handleAddNote = (
        title: string,
        content: string,
        reset: () => void
    ) => {
        if (!title || !content) return;
        addNote({ title, content });
        reset();
    };

    return {
        vin,
        vehicle,
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
    };
};
