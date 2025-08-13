"use client";
import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Interface pour un quai avec seulement l'attribut name
interface Dock {
    name: string;
}

// Données de test pour les quais
const docksData: Dock[] = [
    { name: "Quai 1" },
    { name: "Quai 2" },
    { name: "Quai 3" },
    { name: "Quai 4" },
    { name: "Quai 5" },
    { name: "Quai 6" },
];

export const DocksCardList = () => {
    const [hoveredDock, setHoveredDock] = useState<string | null>(null);
    const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
        {}
    );
    const [selectedDock, setSelectedDock] = useState<string | null>(null);

    const handleDockClick = (dockName: string) => {
        setSelectedDock(selectedDock === dockName ? null : dockName);
    };

    const handleActionClick = async (dockName: string, action: string) => {
        setLoadingStates((prev) => ({
            ...prev,
            [`${dockName}-${action}`]: true,
        }));

        // Simuler une action asynchrone
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setLoadingStates((prev) => ({
            ...prev,
            [`${dockName}-${action}`]: false,
        }));
    };

    const getDockStatus = (dockName: string) => {
        // Simuler différents statuts basés sur le nom du quai
        const statuses = ["Disponible", "Occupé", "Maintenance", "Réservé"];
        const index =
            dockName.charCodeAt(dockName.length - 1) % statuses.length;
        return statuses[index];
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Disponible":
                return "bg-green-500";
            case "Occupé":
                return "bg-orange-500";
            case "Maintenance":
                return "bg-red-500";
            case "Réservé":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* Header avec titre et actions */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Quais de déchargement
                        </h2>
                        <p className="text-muted-foreground">
                            Gérez vos quais et suivez leur disponibilité
                        </p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button className="flex items-center gap-2">
                                <Icons.plusCircled className="h-4 w-4" />
                                Ajouter un quai
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Créer un nouveau quai de déchargement</p>
                        </TooltipContent>
                    </Tooltip>
                </div>

                {/* Liste des cartes en pleine largeur */}
                <div className="space-y-3">
                    {docksData.map((dock, index) => {
                        const status = getDockStatus(dock.name);
                        const isSelected = selectedDock === dock.name;
                        const isHovered = hoveredDock === dock.name;
                        const isModifying =
                            loadingStates[`${dock.name}-modify`];
                        const isViewing = loadingStates[`${dock.name}-view`];

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Card
                                        className={cn(
                                            "group relative overflow-hidden transition-all duration-300",
                                            "hover:shadow-xl hover:scale-[1.01] hover:border-primary/20",
                                            "cursor-pointer border-2 hover:border-primary/30",
                                            "w-full",
                                            isSelected &&
                                                "ring-2 ring-primary ring-offset-2",
                                            isHovered && "shadow-lg"
                                        )}
                                        onClick={() =>
                                            handleDockClick(dock.name)
                                        }
                                        onMouseEnter={() =>
                                            setHoveredDock(dock.name)
                                        }
                                        onMouseLeave={() =>
                                            setHoveredDock(null)
                                        }
                                    >
                                        {/* Indicateur de statut */}
                                        <div className="absolute top-2 right-2">
                                            <div
                                                className={cn(
                                                    "w-2 h-2 rounded-full animate-pulse",
                                                    getStatusColor(status)
                                                )}
                                            />
                                        </div>

                                        {/* Gradient de fond subtil */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        <CardHeader className="pb-2 relative z-10">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Icons.dock className="h-5 w-5 text-primary" />
                                                    </div>
                                                    {dock.name}
                                                </CardTitle>
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs font-medium px-2 py-1"
                                                >
                                                    {status}
                                                </Badge>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="relative z-10 py-3">
                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                {/* Informations du quai */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Icons.calendar className="h-4 w-4" />
                                                        <span>
                                                            Dernière activité:
                                                            Aujourd&apos;hui
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Icons.vehicle className="h-4 w-4" />
                                                        <span>
                                                            Véhicules déchargés:
                                                            12
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Barre de progression */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">
                                                            Utilisation
                                                        </span>
                                                        <span className="font-bold text-base">
                                                            75%
                                                        </span>
                                                    </div>
                                                    <div className="w-full bg-secondary rounded-full h-2">
                                                        <div
                                                            className="bg-primary h-2 rounded-full transition-all duration-300"
                                                            style={{
                                                                width: "75%",
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-1">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1 h-9"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleActionClick(
                                                                        dock.name,
                                                                        "modify"
                                                                    );
                                                                }}
                                                                disabled={
                                                                    isModifying
                                                                }
                                                            >
                                                                {isModifying ? (
                                                                    <Icons.spinner className="h-3 w-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Icons.edit className="h-3 w-3 mr-1" />
                                                                )}
                                                                {isModifying
                                                                    ? "Modification..."
                                                                    : "Modifier"}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Modifier les
                                                                paramètres du
                                                                quai
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="flex-1 h-9"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    handleActionClick(
                                                                        dock.name,
                                                                        "view"
                                                                    );
                                                                }}
                                                                disabled={
                                                                    isViewing
                                                                }
                                                            >
                                                                {isViewing ? (
                                                                    <Icons.spinner className="h-3 w-3 mr-1 animate-spin" />
                                                                ) : (
                                                                    <Icons.eyeOff className="h-3 w-3 mr-1" />
                                                                )}
                                                                {isViewing
                                                                    ? "Chargement..."
                                                                    : "Détails"}
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>
                                                                Voir les détails
                                                                complets du quai
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </CardContent>

                                        {/* Overlay au survol */}
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Indicateur de sélection */}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/10 border-2 border-primary/50 rounded-lg" />
                                        )}
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cliquez pour sélectionner le quai</p>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>

                {/* Statistiques en bas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Icons.dock className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Total des quais
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {docksData.length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Icons.check className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Disponibles
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {
                                            docksData.filter(
                                                (dock) =>
                                                    getDockStatus(dock.name) ===
                                                    "Disponible"
                                            ).length
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <Icons.vehicle className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Véhicules traités
                                    </p>
                                    <p className="text-2xl font-bold">72</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Feedback de sélection */}
                {selectedDock && (
                    <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-bottom-2">
                        <p>Quai sélectionné : {selectedDock}</p>
                    </div>
                )}
            </div>
        </TooltipProvider>
    );
};
