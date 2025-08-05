"use client";

import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ParkingsDetailSheet } from "./parkings-detail-dialog";
import { ParkingsEditDialog } from "./parkings-edit-dialog";

// Interface pour un parking
interface Parking {
    name: string;
    location: string;
    coordinates: string;
    occupiedPlaces: number;
    totalPlaces: number;
    status: "available" | "busy" | "full";
}

// Données de test pour les parkings
const parkingsData: Parking[] = [
    {
        name: "Parking Principal",
        location: "Zone A - Entrée principale",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 24,
        totalPlaces: 200,
        status: "busy",
    },
    {
        name: "Parking Secondaire",
        location: "Zone B - Côté ouest",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 8,
        totalPlaces: 50,
        status: "available",
    },
    {
        name: "Parking VIP",
        location: "Zone C - Secteur privé",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 15,
        totalPlaces: 20,
        status: "busy",
    },
    {
        name: "Parking Camions",
        location: "Zone D - Zone industrielle",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 12,
        totalPlaces: 30,
        status: "available",
    },
    {
        name: "Parking Temporaire",
        location: "Zone E - Zone événementielle",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 45,
        totalPlaces: 100,
        status: "busy",
    },
    {
        name: "Parking Sécurisé",
        location: "Zone F - Zone surveillée",
        coordinates: "48.8566° N, 2.3522° E",
        occupiedPlaces: 18,
        totalPlaces: 25,
        status: "available",
    },
];

const getStatusColor = (status: Parking["status"]) => {
    switch (status) {
        case "available":
            return "bg-green-500";
        case "busy":
            return "bg-orange-500";
        case "full":
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
};

const getStatusText = (status: Parking["status"]) => {
    switch (status) {
        case "available":
            return "Disponible";
        case "busy":
            return "Occupé";
        case "full":
            return "Complet";
        default:
            return "Inconnu";
    }
};

const getStatusBadgeVariant = (status: Parking["status"]) => {
    switch (status) {
        case "available":
            return "secondary";
        case "busy":
            return "default";
        case "full":
            return "destructive";
        default:
            return "secondary";
    }
};

export const ParkingsCardList = () => {
    const [selectedParking, setSelectedParking] = useState<Parking | null>(
        null
    );
    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingParking, setEditingParking] = useState<Parking | null>(null);

    const totalPlaces = parkingsData.reduce(
        (sum, parking) => sum + parking.totalPlaces,
        0
    );
    const totalOccupied = parkingsData.reduce(
        (sum, parking) => sum + parking.occupiedPlaces,
        0
    );
    const availableParkings = parkingsData.filter(
        (p) => p.status === "available"
    ).length;

    const handleOpenDetail = (parking: Parking) => {
        setSelectedParking(parking);
        setDetailOpen(true);
    };

    const handleOpenEdit = (parking: Parking) => {
        setEditingParking(parking);
        setEditOpen(true);
    };

    const handleSaveParking = (updatedParking: Parking) => {
        // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
        console.log("Parking mis à jour:", updatedParking);
        // Optionnel : fermer le dialogue de détail si c'est le même parking
        if (selectedParking?.name === updatedParking.name) {
            setSelectedParking(updatedParking);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header avec titre et actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Zones de parking
                    </h2>
                    <p className="text-muted-foreground">
                        Gérez vos zones de parking et suivez leur occupation
                    </p>
                </div>
                <Button className="flex items-center gap-2">
                    <Icons.plusCircled className="h-4 w-4" />
                    Ajouter un parking
                </Button>
            </div>

            {/* Grille des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {parkingsData.map((parking, index) => {
                    const occupationPercentage = Math.round(
                        (parking.occupiedPlaces / parking.totalPlaces) * 100
                    );

                    return (
                        <Card
                            key={index}
                            className={cn(
                                "group relative overflow-hidden transition-all duration-300",
                                "hover:shadow-xl hover:scale-[1.02] hover:border-primary/20",
                                "cursor-pointer border-2 hover:border-primary/30"
                            )}
                        >
                            {/* Indicateur de statut */}
                            <div className="absolute top-3 right-3">
                                <div
                                    className={cn(
                                        "w-3 h-3 rounded-full animate-pulse",
                                        getStatusColor(parking.status)
                                    )}
                                />
                            </div>

                            {/* Gradient de fond subtil */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardHeader className="pb-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icons.area className="h-5 w-5 text-primary" />
                                        </div>
                                        {parking.name}
                                    </CardTitle>
                                    <Badge
                                        variant={getStatusBadgeVariant(
                                            parking.status
                                        )}
                                        className="text-xs font-medium"
                                    >
                                        {getStatusText(parking.status)}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-10">
                                <div className="space-y-4">
                                    {/* Informations du parking */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Icons.search className="h-4 w-4" />
                                            <span>{parking.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Icons.calendar className="h-4 w-4" />
                                            <span>{parking.coordinates}</span>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground">
                                                Occupation
                                            </span>
                                            <span className="font-medium">
                                                {occupationPercentage}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={occupationPercentage}
                                            className="h-2"
                                        />
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Places occupées</span>
                                            <span className="font-medium">
                                                {parking.occupiedPlaces}/
                                                {parking.totalPlaces}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(parking);
                                            }}
                                        >
                                            <Icons.edit className="h-3 w-3 mr-1" />
                                            Modifier
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() =>
                                                handleOpenDetail(parking)
                                            }
                                        >
                                            <Icons.eyeOff className="h-3 w-3 mr-1" />
                                            Détails
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>

                            {/* Overlay au survol */}
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Card>
                    );
                })}
            </div>

            {/* Statistiques en bas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                <Icons.area className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total des parkings
                                </p>
                                <p className="text-2xl font-bold">
                                    {parkingsData.length}
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
                                    {availableParkings}
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
                                    Places totales
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalPlaces}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Icons.inbox className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Occupation globale
                                </p>
                                <p className="text-2xl font-bold">
                                    {Math.round(
                                        (totalOccupied / totalPlaces) * 100
                                    )}
                                    %
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sheet de détail */}
            <ParkingsDetailSheet
                parking={selectedParking}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />

            {/* Dialogue d'édition */}
            <ParkingsEditDialog
                parking={editingParking}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={handleSaveParking}
            />
        </div>
    );
};
