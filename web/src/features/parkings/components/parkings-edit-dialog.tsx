import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// Interface pour un parking
interface Parking {
    name: string;
    location: string;
    coordinates: string;
    occupiedPlaces: number;
    totalPlaces: number;
    status: "available" | "busy" | "full";
    description?: string;
    capacity?: number;
    zone?: string;
}

interface ParkingsEditDialogProps {
    parking: Parking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (parking: Parking) => void;
}

const parkingStatuses = [
    { value: "available", label: "Disponible", color: "bg-green-500" },
    { value: "busy", label: "Occupé", color: "bg-orange-500" },
    { value: "full", label: "Complet", color: "bg-red-500" },
];

const parkingZones = [
    "Zone A - Entrée principale",
    "Zone B - Côté ouest",
    "Zone C - Secteur privé",
    "Zone D - Zone industrielle",
    "Zone E - Zone événementielle",
    "Zone F - Zone surveillée",
];

export const ParkingsEditDialog = ({
    parking,
    open,
    onOpenChange,
    onSave,
}: ParkingsEditDialogProps) => {
    const [formData, setFormData] = useState<Parking>({
        name: "",
        location: "",
        coordinates: "",
        occupiedPlaces: 0,
        totalPlaces: 0,
        status: "available",
        description: "",
        capacity: 0,
        zone: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    // Initialiser le formulaire quand le parking change
    useEffect(() => {
        if (parking) {
            setFormData({
                name: parking.name,
                location: parking.location,
                coordinates: parking.coordinates,
                occupiedPlaces: parking.occupiedPlaces,
                totalPlaces: parking.totalPlaces,
                status: parking.status,
                description: parking.description || "",
                capacity: parking.capacity || parking.totalPlaces,
                zone: parking.zone || parking.location,
            });
        }
    }, [parking]);

    const handleInputChange = (
        field: keyof Parking,
        value: string | number
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);

        // Simuler une sauvegarde
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (onSave) {
            onSave(formData);
        }

        setIsLoading(false);
        onOpenChange(false);
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    if (!parking) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                            <Icons.edit className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold">
                                Modifier le parking
                            </DialogTitle>
                            <DialogDescription>
                                Modifiez les informations du parking{" "}
                                {parking.name}
                            </DialogDescription>
                        </div>
                        <Badge
                            variant="outline"
                            className="text-xs font-medium"
                        >
                            Édition
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations de base */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Icons.area className="h-5 w-5" />
                            Informations générales
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom du parking</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nom du parking"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Statut</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) =>
                                        handleInputChange(
                                            "status",
                                            value as Parking["status"]
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parkingStatuses.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={cn(
                                                            "w-2 h-2 rounded-full",
                                                            status.color
                                                        )}
                                                    />
                                                    {status.label}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                    handleInputChange(
                                        "description",
                                        e.target.value
                                    )
                                }
                                placeholder="Description du parking..."
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Localisation */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Icons.search className="h-5 w-5" />
                            Localisation
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="zone">Zone</Label>
                                <Select
                                    value={formData.zone}
                                    onValueChange={(value) =>
                                        handleInputChange("zone", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une zone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {parkingZones.map((zone) => (
                                            <SelectItem key={zone} value={zone}>
                                                {zone}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coordinates">
                                    Coordonnées GPS
                                </Label>
                                <Input
                                    id="coordinates"
                                    value={formData.coordinates}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "coordinates",
                                            e.target.value
                                        )
                                    }
                                    placeholder="48.8566° N, 2.3522° E"
                                />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Capacité */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Icons.vehicle className="h-5 w-5" />
                            Capacité et occupation
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="totalPlaces">
                                    Places totales
                                </Label>
                                <Input
                                    id="totalPlaces"
                                    type="number"
                                    value={formData.totalPlaces}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "totalPlaces",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupiedPlaces">
                                    Places occupées
                                </Label>
                                <Input
                                    id="occupiedPlaces"
                                    type="number"
                                    value={formData.occupiedPlaces}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "occupiedPlaces",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="capacity">
                                    Capacité (tonnes)
                                </Label>
                                <Input
                                    id="capacity"
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "capacity",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Aperçu de l'occupation */}
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">
                                    Taux d&apos;occupation
                                </span>
                                <span className="text-sm font-bold">
                                    {formData.totalPlaces > 0
                                        ? Math.round(
                                              (formData.occupiedPlaces /
                                                  formData.totalPlaces) *
                                                  100
                                          )
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${
                                            formData.totalPlaces > 0
                                                ? (formData.occupiedPlaces /
                                                      formData.totalPlaces) *
                                                  100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{formData.occupiedPlaces} occupées</span>
                                <span>
                                    {formData.totalPlaces -
                                        formData.occupiedPlaces}{" "}
                                    disponibles
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isLoading}
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Icons.spinner className="h-4 w-4 animate-spin" />
                                Sauvegarde...
                            </>
                        ) : (
                            <>
                                <Icons.check className="h-4 w-4" />
                                Sauvegarder
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
