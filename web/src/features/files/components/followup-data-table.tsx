"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FollowupFile } from "../data/schema";
import {
    useFollowupOpenEditDialog,
    useFollowupOpenViewDialog,
} from "../store/followup-store";

interface FollowupDataTableProps {
    data: FollowupFile[];
}

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

const getProgressPercentage = (
    workflowSteps: FollowupFile["workflow_steps"]
) => {
    if (workflowSteps.length === 0) return 0;
    const completed = workflowSteps.filter(
        (step) => step.status === "Terminé"
    ).length;
    return Math.round((completed / workflowSteps.length) * 100);
};

export const FollowupDataTable = ({ data }: FollowupDataTableProps) => {
    const openViewDialog = useFollowupOpenViewDialog();
    const openEditDialog = useFollowupOpenEditDialog();

    if (data.length === 0) {
        return (
            <div className="text-center py-12">
                <Icons.file className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Aucun dossier de suivi
                </h3>
                <p className="text-muted-foreground">
                    Commencez par créer votre premier dossier de suivi.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((file) => (
                <Card
                    key={file.id}
                    className="hover:shadow-lg transition-shadow duration-200"
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-lg font-semibold">
                                    {file.reference_number}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                    {file.vehicle_info ? (
                                        <span>
                                            {file.vehicle_info.brand}{" "}
                                            {file.vehicle_info.model} (
                                            {file.vehicle_info.year})
                                        </span>
                                    ) : (
                                        <span>Véhicule {file.vehicle_id}</span>
                                    )}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <Badge className={getStatusColor(file.status)}>
                                    {file.status}
                                </Badge>
                                <Badge
                                    className={getPriorityColor(file.priority)}
                                    variant="outline"
                                >
                                    {file.priority}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Informations du véhicule */}
                        {file.vehicle_info && (
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Icons.car className="h-4 w-4" />
                                <span>{file.vehicle_info.plate_number}</span>
                            </div>
                        )}

                        {/* Progression du workflow */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Progression
                                </span>
                                <span className="font-medium">
                                    {getProgressPercentage(file.workflow_steps)}
                                    %
                                </span>
                            </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full bg-gradient-to-r from-gray-300 via-cyan-500 to-emerald-500 transition-all duration-300"
                                    style={{
                                        width: `${getProgressPercentage(
                                            file.workflow_steps
                                        )}%`,
                                    }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {
                                    file.workflow_steps.filter(
                                        (step) => step.status === "Terminé"
                                    ).length
                                }{" "}
                                / {file.workflow_steps.length} étapes
                            </p>
                        </div>

                        {/* Statistiques */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-gray-50 rounded p-2">
                                <div className="font-semibold text-foreground">
                                    {file.documents.length}
                                </div>
                                <div className="text-muted-foreground">
                                    Documents
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <div className="font-semibold text-foreground">
                                    {file.photos.length}
                                </div>
                                <div className="text-muted-foreground">
                                    Photos
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded p-2">
                                <div className="font-semibold text-foreground">
                                    {file.inspections.length}
                                </div>
                                <div className="text-muted-foreground">
                                    Inspections
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-2">
                                <Icons.calendar className="h-3 w-3" />
                                <span>
                                    Créé le{" "}
                                    {format(
                                        new Date(file.created_at),
                                        "dd/MM/yyyy",
                                        { locale: fr }
                                    )}
                                </span>
                            </div>
                            {file.estimated_completion_date && (
                                <div className="flex items-center space-x-2">
                                    <Icons.clock className="h-3 w-3" />
                                    <span>
                                        Échéance:{" "}
                                        {format(
                                            new Date(
                                                file.estimated_completion_date
                                            ),
                                            "dd/MM/yyyy",
                                            { locale: fr }
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openViewDialog(file)}
                            >
                                <Icons.eye className="h-4 w-4 mr-2" />
                                Voir
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => openEditDialog(file)}
                                disabled={file.status === "Fermé"}
                            >
                                <Icons.edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
