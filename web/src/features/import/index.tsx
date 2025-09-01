"use client";

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
import { Progress } from "@/components/ui/progress";
// ...
import {
    AlertCircle,
    CheckCircle,
    Download,
    Eye,
    RefreshCw
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { FormatInfo } from "./components/format-info";
import { ImportDropzone } from "./components/import-dropzone";
import { ManifestImportStats } from "./components/manifest-import-stats";
import { ManifestImportValidator } from "./components/manifest-import-validator";
import { StepIndicator } from "./components/step-indicator";
import { useImportSteps } from "./hooks/useImportSteps";
import { useManifestPreview } from "./hooks/useManifestPreview";
import { useManifestUpload } from "./hooks/useManifestUpload";

export default function Import() {
    const [isDragOver, setIsDragOver] = useState(false);

    // Hooks: preview and upload
    const {
        file,
        vesselInfo,
        vehiclesRaw,
        previewData,
        errors: previewErrors,
        handleFileSelect,
        clear: clearPreview,
        setErrors: setPreviewErrors,
    } = useManifestPreview();
    const {
        isUploading,
        uploadProgress,
        importStats,
        errors: uploadErrors,
        success,
        upload,
        reset: resetUpload,
    } = useManifestUpload();

    const allErrors = useMemo(() => [...(previewErrors || []), ...(uploadErrors || [])], [previewErrors, uploadErrors]);

    const startImport = useCallback(async () => {
        if (!file) return;
        const res = await upload(file, previewData.length);
        if (res.ok) setCurrentStep("complete");
    }, [file, previewData.length, upload]);

    const { currentStep, setCurrentStep, currentIndex, railPercent, stepState, handleStepClick } = useImportSteps({
        isUploading,
        uploadProgress,
        hasFile: Boolean(file),
        hasPreview: vehiclesRaw.length > 0,
        onStartImport: startImport,
    });

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

        const droppedFile = e.dataTransfer.files?.[0];
        if (!droppedFile) return;

        const isExcelMime = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
        ].includes(droppedFile.type);
        const isExcelExt = /\.(xlsx|xls)$/i.test(droppedFile.name);
        if (isExcelMime || isExcelExt) {
            resetUpload();
            setCurrentStep("upload");
            handleFileSelect(droppedFile);
        } else {
            setPreviewErrors(["Veuillez sélectionner un fichier Excel (.xlsx ou .xls)"]);
        }
    }, []);

    const handleValidationComplete = (result: { isValid: boolean }) => {
        if (result.isValid) {
            setCurrentStep("import");
            startImport();
        }
    };

    const handleProceedToImport = () => {
        setCurrentStep("import");
        startImport();
    };

    const handleRemoveFile = () => {
        clearPreview();
        resetUpload();
        setCurrentStep("upload");
    };

    const downloadTemplate = async () => {
        const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
        if (!base) {
            toast.info("Template indisponible: BACKEND_API_BASE_URL manquant");
            return;
        }
        const url = `${base}/Manifeste_Vehicules_SMMC(1).xlsx`;
        window.open(url, "_blank");
    };

    const resetImport = () => {
        clearPreview();
        resetUpload();
        setCurrentStep("upload");
    };

    // Stepper helpers
    // currentIndex, railPercent, stepState and handleStepClick are provided by useImportSteps

    return (
        <>
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
            <StepIndicator
                currentStep={currentStep}
                railPercent={railPercent}
                stepState={stepState}
                onStepClick={handleStepClick}
            />

            <div className="grid gap-6">
                {/* Zone de drop - visible seulement à l'étape 1 */}
                {currentStep === "upload" && (
                    <ImportDropzone
                        isDragOver={isDragOver}
                        file={file}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onFileSelect={handleFileSelect}
                        onRemove={handleRemoveFile}
                        onProceed={() => setCurrentStep("validation")}
                    />
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
                {allErrors.length > 0 && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {allErrors.map((error: string, index: number) => (
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

                {/* Prévisualisation des données - visible uniquement à l'étape Validation */}
                {vehiclesRaw.length > 0 && currentStep === "validation" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5 text-primary" />
                                Aperçu du manifeste ({vehiclesRaw.length} véhicules)
                            </CardTitle>
                            <CardDescription>
                                Vérifiez que vos données sont correctes avant l'import
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {vesselInfo && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <div className="text-muted-foreground">Navire</div>
                                        <div className="font-medium">{vesselInfo.nom_du_navire || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">IMO</div>
                                        <div className="font-medium">{String(vesselInfo.numero_imo ?? "—")}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">ETA</div>
                                        <div className="font-medium">{(vesselInfo.eta as string) || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Pavillon</div>
                                        <div className="font-medium">{vesselInfo.pavillon || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Agent</div>
                                        <div className="font-medium">{vesselInfo.agent_maritime || "—"}</div>
                                    </div>
                                    <div>
                                        <div className="text-muted-foreground">Provenance</div>
                                        <div className="font-medium">{vesselInfo.port_de_provenance || "—"}</div>
                                    </div>
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2 font-medium">VIN / Châssis</th>
                                            <th className="text-left p-2 font-medium">B/L</th>
                                            <th className="text-left p-2 font-medium">Marque</th>
                                            <th className="text-left p-2 font-medium">Modèle</th>
                                            <th className="text-left p-2 font-medium">Couleur</th>
                                            <th className="text-left p-2 font-medium">Année</th>
                                            <th className="text-left p-2 font-medium">Propriétaire</th>
                                            <th className="text-left p-2 font-medium">Pays</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {vehiclesRaw.slice(0, 200).map((r, index) => (
                                            <tr key={index} className="border-b hover:bg-muted/50">
                                                <td className="p-2">
                                                    <Badge variant="outline">{(r as any).vin || (r as any)["vin/chassis"] || (r as any).chassis || "—"}</Badge>
                                                </td>
                                                <td className="p-2">{(r as any).bill_of_lading || (r as any).connaissement || (r as any).connaissement_b_l || "—"}</td>
                                                <td className="p-2">{(r as any).marque || (r as any).make || "—"}</td>
                                                <td className="p-2">{(r as any).modele || (r as any).modèle || (r as any).model || "—"}</td>
                                                <td className="p-2">{(r as any).couleur || (r as any).color || "—"}</td>
                                                <td className="p-2">{(r as any).annee || (r as any).année || (r as any).year || "—"}</td>
                                                <td className="p-2">{(r as any).proprietaire_destinataire || (r as any).owner || (r as any).owner_name || (r as any).proprietaire || "—"}</td>
                                                <td className="p-2">{(r as any).pays_origine || (r as any).origin_country || (r as any).pays || (r as any).pays_origin || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informations sur le format attendu */}
                {currentStep === "upload" && <FormatInfo />}
            </div>
        </>
    );
}
