import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";
import { useState } from "react";

import { ManifestData, ValidationResult } from "../types/manifest";

interface ManifestImportValidatorProps {
    data: ManifestData[];
    onValidationComplete: (result: ValidationResult) => void;
    onProceed: () => void;
}

export function ManifestImportValidator({
    data,
    onValidationComplete,
    onProceed,
}: ManifestImportValidatorProps) {
    const [validationResult, setValidationResult] =
        useState<ValidationResult | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const validateData = () => {
        setIsValidating(true);

        // Simulation de la validation
        setTimeout(() => {
            const errors: string[] = [];
            const warnings: string[] = [];
            let validRows = 0;

            data.forEach((row, index) => {
                const rowNumber = index + 1;

                // Validation des champs obligatoires
                if (!row.navire || row.navire.trim() === "") {
                    errors.push(`Ligne ${rowNumber}: Nom du navire manquant`);
                }

                if (!row.vehicule || row.vehicule.trim() === "") {
                    errors.push(
                        `Ligne ${rowNumber}: Plaque du véhicule manquante`
                    );
                }

                if (!row.chauffeur || row.chauffeur.trim() === "") {
                    errors.push(
                        `Ligne ${rowNumber}: Nom du chauffeur manquant`
                    );
                }

                // Validation des dates
                if (row.dateArrivee && !isValidDate(row.dateArrivee)) {
                    errors.push(
                        `Ligne ${rowNumber}: Format de date d'arrivée invalide (utilisez YYYY-MM-DD)`
                    );
                }

                if (row.dateDepart && !isValidDate(row.dateDepart)) {
                    errors.push(
                        `Ligne ${rowNumber}: Format de date de départ invalide (utilisez YYYY-MM-DD)`
                    );
                }

                // Validation du poids
                if (row.poids && (isNaN(row.poids) || row.poids <= 0)) {
                    errors.push(
                        `Ligne ${rowNumber}: Poids invalide (doit être un nombre positif)`
                    );
                }

                // Validation du status
                if (
                    row.status &&
                    !["En attente", "En cours", "Terminé"].includes(row.status)
                ) {
                    warnings.push(
                        `Ligne ${rowNumber}: Status non standard (${row.status})`
                    );
                }

                // Si la ligne passe toutes les validations critiques
                if (row.navire && row.vehicule && row.chauffeur) {
                    validRows++;
                }
            });

            const result: ValidationResult = {
                isValid: errors.length === 0,
                errors,
                warnings,
                validRows,
                totalRows: data.length,
            };

            setValidationResult(result);
            onValidationComplete(result);
            setIsValidating(false);
        }, 1500);
    };

    const isValidDate = (dateString: string): boolean => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date.getTime());
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "En attente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "En cours":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "Terminé":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (!validationResult) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        Validation des données
                    </CardTitle>
                    <CardDescription>
                        Validez vos données avant l'import final
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            {data.length} enregistrements détectés dans votre
                            fichier
                        </p>
                        <Button
                            onClick={validateData}
                            disabled={isValidating}
                            className="gap-2"
                        >
                            {isValidating
                                ? "Validation en cours..."
                                : "Valider les données"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {validationResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    Résultat de la validation
                </CardTitle>
                <CardDescription>
                    {validationResult.isValid
                        ? "Toutes les données sont valides !"
                        : "Des erreurs ont été détectées"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Résumé */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {validationResult.validRows}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Lignes valides
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {validationResult.errors.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Erreurs
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {validationResult.warnings.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Avertissements
                        </div>
                    </div>
                </div>

                {/* Erreurs critiques */}
                {validationResult.errors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="font-medium mb-2">
                                Erreurs critiques à corriger :
                            </div>
                            <ul className="space-y-1 text-sm">
                                {validationResult.errors.map((error, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start gap-2"
                                    >
                                        <span className="text-red-500">•</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Avertissements */}
                {validationResult.warnings.length > 0 && (
                    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="font-medium mb-2">
                                Avertissements :
                            </div>
                            <ul className="space-y-1 text-sm">
                                {validationResult.warnings.map(
                                    (warning, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2"
                                        >
                                            <span className="text-yellow-500">
                                                •
                                            </span>
                                            {warning}
                                        </li>
                                    )
                                )}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    {validationResult.isValid ? (
                        <Button onClick={onProceed} className="gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Procéder à l'import
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={() => setValidationResult(null)}
                        >
                            Revalider
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
