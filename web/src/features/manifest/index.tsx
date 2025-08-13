"use client";

import { Main } from "@/components/layout/main";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    AlertCircle,
    CheckCircle,
    Download,
    Eye,
    FileSpreadsheet,
    RefreshCw,
    Upload,
    X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { ManifestImportStats } from "./components/manifest-import-stats";
import { ManifestImportValidator } from "./components/manifest-import-validator";
import { ImportStats, ManifestData } from "./types/manifest";

export default function Manifest() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewData, setPreviewData] = useState<ManifestData[]>([]);
    const [errors, setErrors] = useState<string[]>([]);
    const [success, setSuccess] = useState<string>("");
    const [importStats, setImportStats] = useState<ImportStats | null>(null);
    const [currentStep, setCurrentStep] = useState<
        "upload" | "validation" | "import" | "complete"
    >("upload");

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFile = e.dataTransfer.files[0];
        if (
            droppedFile &&
            droppedFile.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
            handleFileSelect(droppedFile);
        } else {
            setErrors(["Veuillez sélectionner un fichier Excel (.xlsx)"]);
        }
    }, []);

    const handleFileSelect = (selectedFile: File) => {
        setFile(selectedFile);
        setErrors([]);
        setSuccess("");
        setCurrentStep("upload");

        // Simuler la lecture du fichier Excel
        simulateExcelRead(selectedFile);
    };

    const simulateExcelRead = (selectedFile: File) => {
        // Simulation de données d'exemple
        const mockData: ManifestData[] = [
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
            {
                navire: "MAERSK SEALAND",
                vehicule: "TR-3456-GH",
                chauffeur: "Sophie Bernard",
                dateArrivee: "2024-01-18",
                dateDepart: "2024-01-19",
                status: "En attente",
                cargaison: "Matériaux",
                poids: 15000,
            },
        ];

        setPreviewData(mockData);
    };

    const handleValidationComplete = (result: { isValid: boolean }) => {
        if (result.isValid) {
            setCurrentStep("import");
            handleUpload();
        }
    };

    const handleProceedToImport = () => {
        setCurrentStep("import");
        handleUpload();
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        setCurrentStep("import");

        // Initialiser les stats
        const initialStats: ImportStats = {
            totalRecords: previewData.length,
            processedRecords: 0,
            successCount: 0,
            errorCount: 0,
            warningCount: 0,
            processingTime: 0,
            status: "processing",
        };
        setImportStats(initialStats);

        const startTime = Date.now();

        // Simulation de l'upload avec progression
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                const newProgress = prev + 10;
                const currentTime = Date.now();
                const elapsedTime = Math.floor(
                    (currentTime - startTime) / 1000
                );

                // Mettre à jour les stats
                if (importStats) {
                    const newStats = {
                        ...importStats,
                        processedRecords: Math.floor(
                            (newProgress / 100) * previewData.length
                        ),
                        successCount: Math.floor(
                            (newProgress / 100) * previewData.length * 0.9
                        ),
                        errorCount: Math.floor(
                            (newProgress / 100) * previewData.length * 0.05
                        ),
                        warningCount: Math.floor(
                            (newProgress / 100) * previewData.length * 0.05
                        ),
                        processingTime: elapsedTime,
                        status: newProgress >= 100 ? "completed" : "processing",
                    };
                    setImportStats(newStats);
                }

                if (newProgress >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setSuccess(
                        "Fichier importé avec succès ! 4 enregistrements traités."
                    );
                    setCurrentStep("complete");
                    return 100;
                }
                return newProgress;
            });
        }, 300);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setPreviewData([]);
        setErrors([]);
        setSuccess("");
        setUploadProgress(0);
        setImportStats(null);
        setImportStats(null);
        setCurrentStep("upload");
    };

    const downloadTemplate = () => {
        // Simulation du téléchargement d'un template
        const link = document.createElement("a");
        link.href = "#";
        link.download = "template_manifest.xlsx";
        link.click();
    };

    const resetImport = () => {
        setCurrentStep("upload");
        setImportStats(null);
        setSuccess("");
        setUploadProgress(0);
    };

    return (
        <Main>
            <div className="mb-6 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Import Manifest Excel
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Importez vos données de manifest depuis un fichier Excel
                    </p>
                </div>
                <div className="flex gap-2">
                    {currentStep === "complete" && (
                        <Button
                            variant="outline"
                            onClick={resetImport}
                            className="gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Nouvel import
                        </Button>
                    )}
                    <Button
                        variant="outline"
                        onClick={downloadTemplate}
                        className="gap-2"
                    >
                        <Download className="h-4 w-4" />
                        Télécharger le template
                    </Button>
                </div>
            </div>

            {/* Indicateur de progression */}
            <div className="mb-6">
                <div className="flex items-center justify-center space-x-4">
                    <div
                        className={`flex items-center space-x-2 ${
                            currentStep === "upload"
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentStep === "upload"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            1
                        </div>
                        <span className="font-medium">
                            Sélection du fichier
                        </span>
                    </div>
                    <Separator className="w-8" />
                    <div
                        className={`flex items-center space-x-2 ${
                            currentStep === "validation"
                                ? "text-primary"
                                : currentStep === "upload"
                                ? "text-muted-foreground"
                                : "text-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentStep === "validation"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            2
                        </div>
                        <span className="font-medium">Validation</span>
                    </div>
                    <Separator className="w-8" />
                    <div
                        className={`flex items-center space-x-2 ${
                            currentStep === "import"
                                ? "text-primary"
                                : currentStep === "complete"
                                ? "text-primary"
                                : "text-muted-foreground"
                        }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                currentStep === "import" ||
                                currentStep === "complete"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                            }`}
                        >
                            3
                        </div>
                        <span className="font-medium">Import</span>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Zone de drop - visible seulement à l'étape 1 */}
                {currentStep === "upload" && (
                    <Card
                        className={`transition-all duration-200 ${
                            isDragOver
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                        }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileSpreadsheet className="h-5 w-5 text-primary" />
                                Sélection du fichier Excel
                            </CardTitle>
                            <CardDescription>
                                Glissez-déposez votre fichier Excel ici ou
                                cliquez pour sélectionner
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragOver
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50"
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {!file ? (
                                    <div className="space-y-4">
                                        <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                                        <div>
                                            <p className="text-lg font-medium">
                                                Glissez-déposez votre fichier
                                                Excel ici
                                            </p>
                                            <p className="text-muted-foreground">
                                                ou cliquez pour parcourir
                                            </p>
                                        </div>
                                        <Input
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={(e) => {
                                                const selectedFile =
                                                    e.target.files?.[0];
                                                if (selectedFile)
                                                    handleFileSelect(
                                                        selectedFile
                                                    );
                                            }}
                                            className="hidden"
                                            id="file-input"
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "file-input"
                                                    )
                                                    ?.click()
                                            }
                                            className="gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Sélectionner un fichier
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                                        <div>
                                            <p className="text-lg font-medium text-green-600">
                                                Fichier sélectionné
                                            </p>
                                            <p className="text-muted-foreground">
                                                {file.name} (
                                                {(
                                                    file.size /
                                                    1024 /
                                                    1024
                                                ).toFixed(2)}{" "}
                                                MB)
                                            </p>
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                variant="outline"
                                                onClick={handleRemoveFile}
                                                className="gap-2"
                                            >
                                                <X className="h-4 w-4" />
                                                Supprimer
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    setCurrentStep("validation")
                                                }
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Valider les données
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Validation des données - étape 2 */}
                {currentStep === "validation" && previewData.length > 0 && (
                    <ManifestImportValidator
                        data={previewData}
                        onValidationComplete={handleValidationComplete}
                        onProceed={handleProceedToImport}
                    />
                )}

                {/* Barre de progression - étape 3 */}
                {currentStep === "import" && isUploading && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Progression de l'import</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress
                                    value={uploadProgress}
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Statistiques d'import - étape 3 et 4 */}
                {importStats &&
                    (currentStep === "import" ||
                        currentStep === "complete") && (
                        <ManifestImportStats
                            stats={importStats}
                            showProgress={currentStep === "import"}
                        />
                    )}

                {/* Messages d'erreur et de succès */}
                {errors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errors.map((error, index) => (
                                <div key={index}>{error}</div>
                            ))}
                        </AlertDescription>
                    </Alert>
                )}

                {success && currentStep === "complete" && (
                    <Alert className="border-green-200 bg-green-50 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {/* Prévisualisation des données - visible à toutes les étapes sauf la dernière */}
                {previewData.length > 0 && currentStep !== "complete" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                Aperçu des données ({previewData.length}{" "}
                                enregistrements)
                            </CardTitle>
                            <CardDescription>
                                Vérifiez que vos données sont correctes avant
                                l'import
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium">
                                                Navire
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Véhicule
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Chauffeur
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Date Arrivée
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Date Départ
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Status
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Cargaison
                                            </th>
                                            <th className="text-left p-2 font-medium">
                                                Poids (kg)
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.map((row, index) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-muted/50"
                                            >
                                                <td className="p-2">
                                                    {row.navire}
                                                </td>
                                                <td className="p-2">
                                                    <Badge variant="outline">
                                                        {row.vehicule}
                                                    </Badge>
                                                </td>
                                                <td className="p-2">
                                                    {row.chauffeur}
                                                </td>
                                                <td className="p-2">
                                                    {row.dateArrivee}
                                                </td>
                                                <td className="p-2">
                                                    {row.dateDepart}
                                                </td>
                                                <td className="p-2">
                                                    <Badge
                                                        variant={
                                                            row.status ===
                                                            "Terminé"
                                                                ? "default"
                                                                : row.status ===
                                                                  "En cours"
                                                                ? "secondary"
                                                                : "outline"
                                                        }
                                                    >
                                                        {row.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-2">
                                                    {row.cargaison}
                                                </td>
                                                <td className="p-2">
                                                    {row.poids.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informations sur le format attendu */}
                {currentStep === "upload" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Format du fichier Excel attendu
                            </CardTitle>
                            <CardDescription>
                                Assurez-vous que votre fichier contient les
                                colonnes suivantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Badge variant="outline">Navire</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Nom du navire
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Véhicule</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Plaque d'immatriculation
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Chauffeur</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Nom du chauffeur
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">
                                        Date Arrivée
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Format: YYYY-MM-DD
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Date Départ</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Format: YYYY-MM-DD
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Status</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        En attente/En cours/Terminé
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Cargaison</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Type de cargaison
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Badge variant="outline">Poids</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Poids en kilogrammes
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Main>
    );
}
