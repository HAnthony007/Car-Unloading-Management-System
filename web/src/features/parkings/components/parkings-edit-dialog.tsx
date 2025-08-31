import { Icons } from "@/components/icons/icon";
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
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Parking } from "../data/schema";
import { updateParking } from "../lib/parking-mutations";

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

export const ParkingsEditDialog = ({ parking, open, onOpenChange, onSave }: ParkingsEditDialogProps) => {
    const [formData, setFormData] = useState<Parking>({
        id: "",
        name: "",
        location: "",
        capacity: 0,
        number: "",
        createdAt: "",
        updatedAt: "",
    });

        const [status, setStatus] = useState<(typeof parkingStatuses)[number]["value"]>("available");
        const [zone, setZone] = useState("");
        const [occupiedPreview, setOccupiedPreview] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
        const queryClient = useQueryClient();

    // Initialiser le formulaire quand le parking change
    useEffect(() => {
        if (parking) {
            setFormData({
                id: parking.id,
                name: parking.name,
                location: parking.location,
                capacity: parking.capacity ?? 0,
                number: parking.number ?? "",
                createdAt: parking.createdAt ?? "",
                updatedAt: parking.updatedAt ?? "",
            });
            setZone(parking.location || "");
        setOccupiedPreview(0);
        }
    }, [parking]);

    const handleInputChange = (field: keyof Parking, value: string | number) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value as any,
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
            try {
                await updateParking(formData.id, {
        name: formData.name || "",
        location: formData.location || "",
        capacity: (formData.capacity ?? 0),
                    number: formData.number ?? null,
                });
                onSave?.(formData);
        // Invalidate queries to refresh UI
        queryClient.invalidateQueries({ queryKey: ["parkings"] });
        queryClient.invalidateQueries({ queryKey: ["parking-vehicles-count", formData.id] });
        queryClient.invalidateQueries({ queryKey: ["parking-vehicles", formData.id] });
            } catch (e) {
                console.error(e);
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
                                <Select value={status} onValueChange={setStatus}>
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

                            {/* Description non supportée par le modèle actuel */}
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
                                <Select value={zone} onValueChange={setZone}>
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
                                {/* Coordonnées non supportées par le modèle actuel */}
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
                                <Label htmlFor="totalPlaces">Places totales</Label>
                                <Input
                                    id="totalPlaces"
                                    type="number"
                                    value={formData.capacity ?? 0}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "capacity",
                                            parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="occupied">
                                    Places occupées (aperçu)
                                </Label>
                                <Input
                                    id="occupied"
                                    type="number"
                                    value={occupiedPreview}
                                    onChange={(e) => setOccupiedPreview(parseInt(e.target.value) || 0)}
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
                                    {(formData.capacity ?? 0) > 0
                                        ? Math.min(100, Math.max(0, Math.round((occupiedPreview / (formData.capacity ?? 0)) * 100)))
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(formData.capacity ?? 0) > 0 ? Math.min(100, Math.max(0, (occupiedPreview / (formData.capacity ?? 0)) * 100)) : 0}%`,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>{Math.max(0, occupiedPreview)} occupées</span>
                                <span>{Math.max(0, ((formData.capacity ?? 0)) - occupiedPreview)} disponibles</span>
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
