import { useState } from "react";
import { useScannerStore } from "../../scanner/stores/scanner-store";

export const useMovements = () => {
    const movements = useScannerStore((s) => s.movements);
    const vin = useScannerStore((s) => s.vin);
    const addMovement = useScannerStore((s) => s.addMovement);

    // form state
    const [title, setTitle] = useState("");
    const [fromLoc, setFromLoc] = useState("");
    const [toLoc, setToLoc] = useState("");
    const [note, setNote] = useState("");
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
        null
    );
    const [loadingLoc, setLoadingLoc] = useState(false);
    const [focusedLocationField, setFocusedLocationField] = useState<
        "from" | "to" | null
    >(null);

    const resetForm = () => {
        setTitle("");
        setFromLoc("");
        setToLoc("");
        setNote("");
        setCoords(null);
        setFocusedLocationField(null);
    };

    const confirmMovement = () => {
        if (!fromLoc || !toLoc) return;
        addMovement({
            from: fromLoc,
            to: toLoc,
            reason: note,
            title: title || `${fromLoc} → ${toLoc}`,
            description: note,
            coordsFrom: coords || undefined,
            coordsTo: coords || undefined,
        });
        resetForm();
    };

    const requestLocation = async () => {
        setLoadingLoc(true);
        try {
            let Location: any;
            try {
                Location = require("expo-location");
            } catch {
                Location = null;
            }
            if (!Location) {
                setCoords({
                    lat: 14.7167 + (Math.random() - 0.5) * 0.01,
                    lng: -17.4677 + (Math.random() - 0.5) * 0.01,
                });
                return;
            }
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setCoords(null);
                return;
            }
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        } catch {
            setCoords(null);
        } finally {
            setLoadingLoc(false);
        }
    };

    const PARKINGS = [
        "Zone Tampon",
        "Zone A1",
        "Zone A2",
        "Zone B3",
        "Zone B5",
        "Quai Débarquement",
        "Parc Export",
        "Inspection Technique",
        "Zone Logistique",
    ];

    return {
        movements,
        vin,
        title,
        setTitle,
        fromLoc,
        setFromLoc,
        toLoc,
        setToLoc,
        note,
        setNote,
        coords,
        loadingLoc,
        focusedLocationField,
        setFocusedLocationField,
        resetForm,
        confirmMovement,
        requestLocation,
        PARKINGS,
    };
};
