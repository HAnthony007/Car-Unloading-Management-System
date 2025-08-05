import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ParkingsEditDialog } from "./parkings-edit-dialog";

// Interface pour une voiture
interface Vehicle {
    id: string;
    plateNumber: string;
    brand: string;
    model: string;
    color: string;
    entryTime: string;
    parkingSpot: string;
    status: "parked" | "loading" | "unloading";
}

// Interface pour un parking
interface Parking {
    name: string;
    location: string;
    coordinates: string;
    occupiedPlaces: number;
    totalPlaces: number;
    status: "available" | "busy" | "full";
    vehicles?: Vehicle[];
}

interface ParkingsDetailSheetProps {
    parking: Parking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

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

// Données de test pour les voitures
const generateVehiclesForParking = (
    parkingName: string,
    count: number
): Vehicle[] => {
    const brands = [
        "Renault",
        "Peugeot",
        "Citroën",
        "Volkswagen",
        "BMW",
        "Mercedes",
        "Audi",
        "Toyota",
    ];
    const models = [
        "Clio",
        "208",
        "C3",
        "Golf",
        "X3",
        "Classe A",
        "A3",
        "Corolla",
    ];
    const colors = ["Blanc", "Noir", "Gris", "Rouge", "Bleu", "Vert", "Jaune"];
    const statuses: Vehicle["status"][] = ["parked", "loading", "unloading"];

    return Array.from({ length: count }, (_, index) => ({
        id: `vehicle-${parkingName}-${index + 1}`,
        plateNumber: `${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
        )}-${Math.floor(Math.random() * 999)
            .toString()
            .padStart(3, "0")}-${String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
        )}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        model: models[Math.floor(Math.random() * models.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        entryTime: `${Math.floor(Math.random() * 24)
            .toString()
            .padStart(2, "0")}:${Math.floor(Math.random() * 60)
            .toString()
            .padStart(2, "0")}`,
        parkingSpot: `A${Math.floor(Math.random() * 20) + 1}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
};

const getVehicleStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
        case "parked":
            return "bg-blue-500";
        case "loading":
            return "bg-orange-500";
        case "unloading":
            return "bg-green-500";
        default:
            return "bg-gray-500";
    }
};

const getVehicleStatusText = (status: Vehicle["status"]) => {
    switch (status) {
        case "parked":
            return "Stationné";
        case "loading":
            return "Chargement";
        case "unloading":
            return "Déchargement";
        default:
            return "Inconnu";
    }
};

export const ParkingsDetailSheet = ({
    parking,
    open,
    onOpenChange,
}: ParkingsDetailSheetProps) => {
    const [editOpen, setEditOpen] = useState(false);

    if (!parking) return null;

    const occupationPercentage = Math.round(
        (parking.occupiedPlaces / parking.totalPlaces) * 100
    );
    const availablePlaces = parking.totalPlaces - parking.occupiedPlaces;

    // Générer des voitures pour ce parking
    const vehicles =
        parking.vehicles ||
        generateVehiclesForParking(parking.name, parking.occupiedPlaces);

    const handleSaveParking = (updatedParking: Parking) => {
        // Ici vous pouvez ajouter la logique pour sauvegarder les modifications
        console.log("Parking mis à jour:", updatedParking);
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    className="overflow-y-auto w-4xl"
                    side="right"
                    size="wide"
                >
                    <SheetHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Icons.area className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <SheetTitle className="text-2xl font-bold">
                                    {parking.name}
                                </SheetTitle>
                                <SheetDescription className="text-base">
                                    Détails complets du parking
                                </SheetDescription>
                            </div>
                            <Badge
                                variant={getStatusBadgeVariant(parking.status)}
                                className="text-sm font-medium px-3 py-1 mt-5"
                            >
                                {getStatusText(parking.status)}
                            </Badge>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6 px-4">
                        {/* Statut en temps réel */}
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <div
                                className={cn(
                                    "w-4 h-4 rounded-full animate-pulse",
                                    getStatusColor(parking.status)
                                )}
                            />
                            <span className="font-medium">
                                Statut: {getStatusText(parking.status)}
                            </span>
                        </div>

                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Icons.search className="h-5 w-5" />
                                        Localisation
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Zone:
                                            </span>
                                            <span>{parking.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                Coordonnées:
                                            </span>
                                            <span className="font-mono text-xs">
                                                {parking.coordinates}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Icons.vehicle className="h-5 w-5" />
                                        Capacité
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span>Places totales:</span>
                                            <span className="font-medium">
                                                {parking.totalPlaces}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Places occupées:</span>
                                            <span className="font-medium text-orange-600">
                                                {parking.occupiedPlaces}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Places disponibles:</span>
                                            <span className="font-medium text-green-600">
                                                {availablePlaces}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Statistiques détaillées */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icons.calendar className="h-5 w-5" />
                                Statistiques d&apos; occupation
                            </h3>

                            <div className="space-y-4">
                                {/* Barre de progression principale */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Taux d&apos;occupation
                                        </span>
                                        <span className="text-sm font-bold">
                                            {occupationPercentage}%
                                        </span>
                                    </div>
                                    <Progress
                                        value={occupationPercentage}
                                        className="h-3"
                                    />
                                </div>

                                {/* Statistiques visuelles */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {parking.totalPlaces}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Total
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {parking.occupiedPlaces}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Occupées
                                        </div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {availablePlaces}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Disponibles
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Liste des voitures */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icons.vehicle className="h-5 w-5" />
                                Véhicules dans le parking ({vehicles.length})
                            </h3>

                            {vehicles.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {vehicles.map((vehicle) => (
                                        <div
                                            key={vehicle.id}
                                            className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Icons.vehicle className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {vehicle.brand}{" "}
                                                            {vehicle.model}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                vehicle.plateNumber
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {getVehicleStatusText(
                                                        vehicle.status
                                                    )}
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            Couleur:
                                                        </span>
                                                        <span>
                                                            {vehicle.color}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            Place:
                                                        </span>
                                                        <span className="font-mono">
                                                            {
                                                                vehicle.parkingSpot
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            Entrée:
                                                        </span>
                                                        <span>
                                                            {vehicle.entryTime}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">
                                                            Statut:
                                                        </span>
                                                        <div
                                                            className={cn(
                                                                "w-2 h-2 rounded-full",
                                                                getVehicleStatusColor(
                                                                    vehicle.status
                                                                )
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Icons.vehicle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p>Aucun véhicule dans ce parking</p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                <Icons.eyeOff className="h-4 w-4 mr-2" />
                                Fermer
                            </Button>
                            <Button onClick={() => setEditOpen(true)}>
                                <Icons.edit className="h-4 w-4 mr-2" />
                                Modifier le parking
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Dialogue d'édition */}
            <ParkingsEditDialog
                parking={parking}
                open={editOpen}
                onOpenChange={setEditOpen}
                onSave={handleSaveParking}
            />
        </>
    );
};
