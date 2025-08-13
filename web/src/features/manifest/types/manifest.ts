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
