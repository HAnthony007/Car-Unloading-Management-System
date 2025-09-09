// Ajout de nouveaux statuts opérationnels pour le workflow véhicule
export type VehicleStatus =
    | "pending" // créé / attendu
    | "unloaded" // débarqué du navire
    | "under_inspection" // inspection en cours
    | "inspected" // inspection terminée (avant parking)
    | "parked" // stationné dans une zone
    | "completed" // processus global terminé
    | "quarantined" // isolé (anomalie)
    | "rejected" // refusé / sorti du flux
    | "arrived" // (ancien) arrivé
    | "stored" // (ancien) stocké
    | "delivered" // (ancien) livré
    | "in_transit"; // (ancien) en transit
export type CustomsStatus = "pending" | "cleared" | "hold";

// Statut d'inspection spécifique
export type InspectionStatus =
    | "in_progress"
    | "conforme"
    | "non_conforme"
    | "critical"
    | "pending_review"
    | "approved"
    | "rejected";

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    chassisNumber: string;
    color: string;
    origin: string;
    shipowner: string;
    arrivalDate: string; // ISO date
    zone: string;
    status: VehicleStatus;
    images?: string[];
    notes?: string;
    customsStatus?: CustomsStatus;
    estimatedDelivery?: string; // ISO date
    /**
     * Progression de l'inspection du véhicule (0 à 1).
     * Optionnel: si absent, la barre de progression n'est pas affichée.
     */
    inspectionProgress?: number;
    /** Statut qualitatif / décisionnel de l'inspection */
    inspectionStatus?: InspectionStatus;
}
