import { useState } from "react";
import { ManifestData } from "../types/manifest";

export function useExcelFileHandler() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const processExcelFile = async (file: File): Promise<ManifestData[]> => {
        setIsProcessing(true);
        setError(null);

        try {
            // Simulation du traitement d'un fichier Excel
            // Dans un vrai projet, vous utiliseriez une bibliothèque comme 'xlsx' ou 'exceljs'

            // Vérifier le type de fichier
            if (!file.name.match(/\.(xlsx|xls)$/i)) {
                throw new Error(
                    "Format de fichier non supporté. Veuillez utiliser un fichier Excel (.xlsx ou .xls)"
                );
            }

            // Vérifier la taille du fichier (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(
                    "Fichier trop volumineux. Taille maximum : 10MB"
                );
            }

            // Simuler un délai de traitement
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Retourner des données simulées basées sur le nom du fichier
            const mockData: ManifestData[] = generateMockData(file.name);

            return mockData;
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Erreur lors du traitement du fichier";
            setError(errorMessage);
            throw err;
        } finally {
            setIsProcessing(false);
        }
    };

    const generateMockData = (fileName: string): ManifestData[] => {
        // Générer des données basées sur le nom du fichier pour la démo
        const baseData: ManifestData[] = [
            {
                navire: "MSC OSCAR",
                vehicule: "TR-1234-AB",
                chauffeur: "Jean Dupont",
                dateArrivee: "2024-01-15",
                dateDepart: "2024-01-16",
                status: "En attente",
                cargaison: "Conteneurs",
                poids: 25000,
            },
            {
                navire: "CMA CGM MARCO POLO",
                vehicule: "TR-5678-CD",
                chauffeur: "Marie Martin",
                dateArrivee: "2024-01-16",
                dateDepart: "2024-01-17",
                status: "En cours",
                cargaison: "Marchandises",
                poids: 18000,
            },
            {
                navire: "EVER GIVEN",
                vehicule: "TR-9012-EF",
                chauffeur: "Pierre Durand",
                dateArrivee: "2024-01-17",
                dateDepart: "2024-01-18",
                status: "Terminé",
                cargaison: "Produits chimiques",
                poids: 32000,
            },
        ];

        // Ajouter des données supplémentaires basées sur le nom du fichier
        if (fileName.includes("manifest")) {
            baseData.push({
                navire: "MAERSK SEALAND",
                vehicule: "TR-3456-GH",
                chauffeur: "Sophie Bernard",
                dateArrivee: "2024-01-18",
                dateDepart: "2024-01-19",
                status: "En attente",
                cargaison: "Matériaux",
                poids: 15000,
            });
        }

        if (fileName.includes("cargo")) {
            baseData.push({
                navire: "HAPAG LLOYD",
                vehicule: "TR-7890-IJ",
                chauffeur: "Lucas Moreau",
                dateArrivee: "2024-01-19",
                dateDepart: "2024-01-20",
                status: "En cours",
                cargaison: "Équipements",
                poids: 28000,
            });
        }

        return baseData;
    };

    const validateExcelStructure = (
        data: ManifestData[]
    ): { isValid: boolean; errors: string[] } => {
        const errors: string[] = [];

        if (data.length === 0) {
            errors.push("Aucune donnée trouvée dans le fichier");
            return { isValid: false, errors };
        }

        // Vérifier que toutes les lignes ont les champs obligatoires
        data.forEach((row, index) => {
            const rowNumber = index + 1;

            if (!row.navire || row.navire.trim() === "") {
                errors.push(`Ligne ${rowNumber}: Nom du navire manquant`);
            }

            if (!row.vehicule || row.vehicule.trim() === "") {
                errors.push(`Ligne ${rowNumber}: Plaque du véhicule manquante`);
            }

            if (!row.chauffeur || row.chauffeur.trim() === "") {
                errors.push(`Ligne ${rowNumber}: Nom du chauffeur manquant`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors,
        };
    };

    return {
        processExcelFile,
        validateExcelStructure,
        isProcessing,
        error,
    };
}
