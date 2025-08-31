import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { Parking } from "../data/schema";
import { useParkingVehicles } from "../hooks/useParkingVehicles";
import { ParkingsEditDialog } from "./parkings-edit-dialog";

type Status = "available" | "busy" | "full";
const getStatus = (occupied: number, capacity: number): Status => {
    if (capacity <= 0) return "available";
    const r = occupied / capacity;
    if (r >= 1) return "full";
    if (r >= 0.6) return "busy";
    return "available";
};
const getStatusColor = (status: Status) => {
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
const getStatusText = (status: Status) => {
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
const getStatusBadgeVariant = (status: Status) => {
    switch (status) {
        case "available":
            return "secondary" as const;
        case "busy":
            return "default" as const;
        case "full":
            return "destructive" as const;
        default:
            return "secondary" as const;
    }
};

interface ParkingsDetailSheetProps {
    parking: Parking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ParkingsDetailSheet = ({ parking, open, onOpenChange }: ParkingsDetailSheetProps) => {
    const [editOpen, setEditOpen] = useState(false);
    const parkingId = parking?.id ?? null;
    const { data, isLoading, isError } = useParkingVehicles(parkingId);

    if (!parking) return null;

    const capacity = parking.capacity || 0;
    const vehicles = data?.vehicles ?? [];
    const occupied = vehicles.length;
    const available = Math.max(0, capacity - occupied);
    const pct = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
    const status = getStatus(occupied, capacity);

    return (
        <>
                    <Sheet open={open} onOpenChange={onOpenChange}>
                        <SheetContent className="overflow-y-auto w-4xl" side="right">
                    <SheetHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <Icons.area className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <SheetTitle className="text-2xl font-bold">{parking.name}</SheetTitle>
                                <SheetDescription className="text-base">Détails complets du parking</SheetDescription>
                            </div>
                            <Badge variant={getStatusBadgeVariant(status)} className="text-sm font-medium px-3 py-1 mt-5">
                                {getStatusText(status)}
                            </Badge>
                        </div>
                    </SheetHeader>

                    <div className="space-y-6 px-4">
                        {/* Statut en temps réel */}
                        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                            <div className={cn("w-4 h-4 rounded-full animate-pulse", getStatusColor(status))} />
                            <span className="font-medium">Statut: {getStatusText(status)}</span>
                        </div>

                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Icons.search className="h-5 w-5" /> Localisation
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Zone:</span>
                                            <span>{parking.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                                        <Icons.vehicle className="h-5 w-5" /> Capacité
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span>Places totales:</span>
                                            <span className="font-medium">{capacity}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Places occupées:</span>
                                            <span className="font-medium text-orange-600">{occupied}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Places disponibles:</span>
                                            <span className="font-medium text-green-600">{available}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Statistiques détaillées */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icons.calendar className="h-5 w-5" /> Statistiques d&apos; occupation
                            </h3>

                            <div className="space-y-4">
                                {/* Barre de progression principale */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Taux d&apos;occupation</span>
                                        <span className="text-sm font-bold">{pct}%</span>
                                    </div>
                                    <Progress value={pct} className="h-3" />
                                </div>

                                {/* Statistiques visuelles */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">{capacity}</div>
                                        <div className="text-xs text-muted-foreground">Total</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">{occupied}</div>
                                        <div className="text-xs text-muted-foreground">Occupées</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">{available}</div>
                                        <div className="text-xs text-muted-foreground">Disponibles</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Liste des voitures */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Icons.vehicle className="h-5 w-5" /> Véhicules dans le parking ({isLoading ? "..." : vehicles.length})
                            </h3>

                            {isError ? (
                                <div className="text-destructive">Erreur lors du chargement des véhicules.</div>
                            ) : isLoading ? (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Icons.spinner className="h-4 w-4 animate-spin" /> Chargement des véhicules...
                                </div>
                            ) : vehicles.length > 0 ? (
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {vehicles.map((v) => (
                                        <div key={v.id} className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-lg">
                                                        <Icons.vehicle className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-sm">
                                                            {v.make} {v.model}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">{v.vin || ""}</div>
                                                    </div>
                                                </div>
                                                {v.parkingNumber ? (
                                                    <Badge variant="outline" className="text-xs">{v.parkingNumber}</Badge>
                                                ) : null}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Couleur:</span>
                                                        <span>{v.color}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Type:</span>
                                                        <span>{v.type}</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Pays origine:</span>
                                                        <span>{v.originCountry}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">Etat:</span>
                                                        <span>{v.condition}</span>
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
                            <Button variant="outline" onClick={() => onOpenChange(false)}>
                                <Icons.eyeOff className="h-4 w-4 mr-2" /> Fermer
                            </Button>
                            <Button onClick={() => setEditOpen(true)}>
                                <Icons.edit className="h-4 w-4 mr-2" /> Modifier le parking
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Dialogue d'édition */}
            <ParkingsEditDialog parking={parking} open={editOpen} onOpenChange={setEditOpen} />
        </>
    );
};
