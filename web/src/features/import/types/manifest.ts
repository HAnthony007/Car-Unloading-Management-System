export interface ManifestData {
    navire: string;
    vehicule: string;
    chauffeur: string;
    dateArrivee: string;
    dateDepart: string;
    status: string;
    cargaison: string;
    poids: number;
}

export interface ImportStats {
    totalRecords: number;
    processedRecords: number;
    successCount: number;
    errorCount: number;
    warningCount: number;
    processingTime: number;
    status: "pending" | "processing" | "completed" | "failed";
}

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    validRows: number;
    totalRows: number;
}

// Shared types for vessel/vehicle parsing (client/server)
export type VesselInfo = {
    nom_du_navire?: string;
    numero_imo?: string | number;
    pavillon?: string;
    agent_maritime?: string;
    port_de_provenance?: string;
    eta?: string | Date;
};

export type VehicleRow = Record<string, unknown> & {
    vin?: string;
    bill_of_lading?: string;
    marque?: string;
    modele?: string;
    type?: string;
    couleur?: string;
    annee?: string | number;
    pays_origine?: string;
    proprietaire_destinataire?: string;
    emplacement_navire?: string;
    statut?: string;
    observations?: string;
    amorce?: boolean | string | number;
    poids_brut_kg?: number | string;
};
