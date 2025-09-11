import { useState, useEffect } from "react";
import { useScannerStore } from "../../scanner/stores/scanner-store";

export const useVehicleWorkflow = () => {
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
            samples.forEach((mv) => addMovement(mv));
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
