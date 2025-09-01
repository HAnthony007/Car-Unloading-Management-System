"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    useFollowupCloseDialog,
    useFollowupSelectedFile,
} from "../store/followup-store";

export const FollowupViewDialog = () => {
    const selectedFile = useFollowupSelectedFile();
    const closeDialog = useFollowupCloseDialog();

    if (!selectedFile) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ouvert":
                return "bg-green-100 text-green-800 border-green-200";
            case "En attente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Fermé":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Urgente":
                return "bg-red-100 text-red-800 border-red-200";
            case "Élevée":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "Moyenne":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Faible":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStepStatusColor = (status: string) => {
        switch (status) {
            case "Terminé":
                return "bg-green-100 text-green-800 border-green-200";
            case "En cours":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "En attente":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Bloqué":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <Dialog open={true} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[900px] p-0 max-h-[85vh] flex flex-col overflow-hidden">
                <DialogHeader className="px-6 pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {selectedFile.reference_number}
                            </DialogTitle>
                            <DialogDescription className="text-base">
                                Dossier de suivi -{" "}
                                {selectedFile.vehicle_info
                                    ? `${selectedFile.vehicle_info.brand} ${selectedFile.vehicle_info.model}`
                                    : `Véhicule ${selectedFile.vehicle_id}`}
                            </DialogDescription>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <Badge
                                className={getStatusColor(selectedFile.status)}
                            >
                                {selectedFile.status}
                            </Badge>
                            <Badge
                                className={getPriorityColor(
                                    selectedFile.priority
                                )}
                                variant="outline"
                            >
                                {selectedFile.priority}
                            </Badge>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 px-6 pb-6 flex-1 overflow-y-auto">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Icons.info className="h-5 w-5" />
                                <span>Informations générales</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Véhicule ID
                                    </Label>
                                    <p className="text-sm">
                                        {selectedFile.vehicle_id}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Port Call ID
                                    </Label>
                                    <p className="text-sm">
                                        {selectedFile.port_call_id}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Date de création
                                    </Label>
                                    <p className="text-sm">
                                        {format(
                                            new Date(selectedFile.created_at),
                                            "dd/MM/yyyy HH:mm",
                                            { locale: fr }
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Dernière mise à jour
                                    </Label>
                                    <p className="text-sm">
                                        {format(
                                            new Date(selectedFile.updated_at),
                                            "dd/MM/yyyy HH:mm",
                                            { locale: fr }
                                        )}
                                    </p>
                                </div>
                            </div>

                            {selectedFile.vehicle_info && (
                                <div className="border-t pt-4">
                                    <h4 className="font-medium mb-2">
                                        Détails du véhicule
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">
                                                Plaque:
                                            </span>
                                            <p className="font-medium">
                                                {
                                                    selectedFile.vehicle_info
                                                        .plate_number
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">
                                                Marque:
                                            </span>
                                            <p className="font-medium">
                                                {
                                                    selectedFile.vehicle_info
                                                        .brand
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">
                                                Modèle:
                                            </span>
                                            <p className="font-medium">
                                                {
                                                    selectedFile.vehicle_info
                                                        .model
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedFile.assigned_inspector && (
                                <div className="border-t pt-4">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Inspecteur assigné
                                    </Label>
                                    <p className="text-sm">
                                        {selectedFile.assigned_inspector}
                                    </p>
                                </div>
                            )}

                            {selectedFile.notes && (
                                <div className="border-t pt-4">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                        Notes
                                    </Label>
                                    <p className="text-sm">
                                        {selectedFile.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Workflow Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Icons.workflow className="h-5 w-5" />
                                <span>Étapes du workflow</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {selectedFile.workflow_steps.map(
                                    (step, index) => (
                                        <div
                                            key={step.id}
                                            className="flex items-center space-x-3 p-3 border rounded-lg"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                                {step.order}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-medium">
                                                        {step.name}
                                                    </h4>
                                                    <Badge
                                                        className={getStepStatusColor(
                                                            step.status
                                                        )}
                                                    >
                                                        {step.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {step.description}
                                                </p>
                                                {step.assigned_to && (
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        Assigné à:{" "}
                                                        {step.assigned_to}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inspections */}
                    {selectedFile.inspections.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Icons.inspection className="h-5 w-5" />
                                    <span>Inspections</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {selectedFile.inspections.map(
                                        (inspection) => (
                                            <div
                                                key={inspection.id}
                                                className="p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-medium">
                                                        {inspection.type}
                                                    </h4>
                                                    <Badge variant="outline">
                                                        {inspection.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    Inspecteur:{" "}
                                                    {inspection.inspector}
                                                </p>
                                                {inspection.results && (
                                                    <p className="text-sm mb-2">
                                                        <span className="font-medium">
                                                            Résultats:
                                                        </span>{" "}
                                                        {inspection.results}
                                                    </p>
                                                )}
                                                {inspection.findings &&
                                                    inspection.findings.length >
                                                        0 && (
                                                        <div className="mb-2">
                                                            <span className="text-sm font-medium">
                                                                Observations:
                                                            </span>
                                                            <ul className="text-sm text-muted-foreground ml-4 list-disc">
                                                                {inspection.findings.map(
                                                                    (
                                                                        finding,
                                                                        idx
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                idx
                                                                            }
                                                                        >
                                                                            {
                                                                                finding
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </div>
                                                    )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Documents et Photos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Icons.file className="h-5 w-5" />
                                    <span>
                                        Documents (
                                        {selectedFile.documents.length})
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedFile.documents.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedFile.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="flex items-center justify-between p-2 border rounded"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Icons.file className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {doc.name}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {doc.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Aucun document
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Icons.photo className="h-5 w-5" />
                                    <span>
                                        Photos ({selectedFile.photos.length})
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedFile.photos.length > 0 ? (
                                    <div className="space-y-2">
                                        {selectedFile.photos.map((photo) => (
                                            <div
                                                key={photo.id}
                                                className="p-2 border rounded"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <Icons.photo className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {photo.description}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {format(
                                                        new Date(
                                                            photo.taken_at
                                                        ),
                                                        "dd/MM/yyyy",
                                                        { locale: fr }
                                                    )}{" "}
                                                    - {photo.taken_by}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Aucune photo
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end px-6 pb-6 border-t pt-4">
                    <Button variant="outline" onClick={closeDialog}>
                        Fermer
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const Label = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => <label className={`block ${className}`}>{children}</label>;
