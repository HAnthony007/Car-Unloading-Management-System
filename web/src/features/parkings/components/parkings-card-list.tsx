"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import type { Parking } from "../data/schema";
import { useParkings } from "../hooks/useParkings";
import { useParkingTotals } from "../hooks/useParkingTotals";
import { ParkingsDetailSheet } from "./parkings-detail-dialog";
import { ParkingsEditDialog } from "./parkings-edit-dialog";

type UiParking = Parking & {
    occupied?: number; // from details when opened
};

const getStatus = (occupied: number, capacity: number): "available" | "busy" | "full" => {
    if (capacity <= 0) return "available";
    const rate = occupied / capacity;
    if (rate >= 1) return "full";
    if (rate >= 0.6) return "busy";
    return "available";
};

const getStatusColor = (status: "available" | "busy" | "full") => {
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

const getStatusText = (status: "available" | "busy" | "full") => {
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

const getStatusBadgeVariant = (status: "available" | "busy" | "full") => {
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

export const ParkingsCardList = () => {
    const { data, isLoading, isError, isFetching, refetch } = useParkings();
    const [selectedParking, setSelectedParking] = useState<UiParking | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingParking, setEditingParking] = useState<UiParking | null>(null);

    const list: UiParking[] = useMemo(() => {
        const items = data?.data ?? [];
        return items.map((p) => ({ ...p }));
    }, [data]);

    // Fetch totals per parking to display real occupancy on cards
    const parkingIds = useMemo(() => list.map((p) => p.id), [list]);
    const { totalsById, isLoading: isTotalsLoading } = useParkingTotals(parkingIds);

    const totalCapacity = list.reduce((sum, p) => sum + (p.capacity || 0), 0);
    const knownOccupied = list.reduce((sum, p) => sum + (p.occupied || 0), 0);
    const availableCount = list.filter((p) => getStatus(p.occupied || 0, p.capacity || 0) === "available").length;

    const handleOpenDetail = (parking: UiParking) => {
        setSelectedParking(parking);
        setDetailOpen(true);
    };

    const handleOpenEdit = (parking: UiParking) => {
        setEditingParking(parking);
        setEditOpen(true);
    };

    const handleSaveParking = (updated: UiParking) => {
        // no-op placeholder until edit endpoint exists
        console.log("Parking mis à jour:", updated);
        if (selectedParking?.id === updated.id) setSelectedParking(updated);
    };

    if (isLoading) {
        // Skeleton UI while initial list loads
        const skeletonCards = Array.from({ length: 6 });
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {skeletonCards.map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-9 w-9 rounded-lg" />
                                        <Skeleton className="h-5 w-40" />
                                    </div>
                                    <Skeleton className="h-5 w-16 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-4 w-4 rounded" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-3 w-20" />
                                            <Skeleton className="h-3 w-10" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-10" />
                                        </div>
                                        <Skeleton className="h-2 w-full" />
                                        <div className="flex items-center justify-between">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-8 w-full" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-lg" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-3 w-28" />
                                        <Skeleton className="h-6 w-16" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }
    if (isError) {
        return (
            <Card className="border-destructive/20">
                <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Icons.alertCircle className="h-5 w-5 text-destructive" />
                            <div>
                                <p className="font-medium">Erreur lors du chargement des parkings.</p>
                                <p className="text-sm text-muted-foreground">Vérifiez votre connexion puis réessayez.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => refetch()} disabled={isFetching}>
                                {isFetching ? (
                                    <>
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Réessayer
                                    </>
                                ) : (
                                    <>Réessayer</>
                                )}
                            </Button>
                            <Button variant="secondary" onClick={() => window.location.reload()}>
                                Rafraîchir la page
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Grille des cartes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                        {list.map((p) => {
                            const occupiedKnown = totalsById[p.id];
                            const occupied = occupiedKnown ?? 0;
                    const capacity = p.capacity || 0;
                    const pct = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
                    const status = getStatus(occupied, capacity);

                    return (
                        <Card
                            key={p.id}
                            className={cn(
                                "group relative overflow-hidden transition-all duration-300",
                                "hover:shadow-xl hover:scale-[1.02] hover:border-primary/20",
                                "cursor-pointer border-2 hover:border-primary/30",
                            )}
                        >
                            {/* Indicateur de statut */}
                            <div className="absolute top-3 right-3">
                                <div className={cn("w-3 h-3 rounded-full animate-pulse", getStatusColor(status))} />
                            </div>

                            {/* Gradient de fond subtil */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <CardHeader className="pb-3 relative z-10">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Icons.area className="h-5 w-5 text-primary" />
                                        </div>
                                        {p.name}
                                    </CardTitle>
                                    <Badge variant={getStatusBadgeVariant(status)} className="text-xs font-medium">
                                        {getStatusText(status)}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="relative z-10">
                                <div className="space-y-4">
                                    {/* Informations du parking */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Icons.search className="h-4 w-4" />
                                            <span>{p.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className="font-medium">Capacité:</span>
                                            <span>{capacity}</span>
                                        </div>
                                    </div>

                                    {/* Barre de progression */}
                                    <div className="space-y-2">
                                        {isTotalsLoading && occupiedKnown === undefined ? (
                                            <>
                                                <div className="flex items-center justify-between text-xs">
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-10" />
                                                </div>
                                                <Skeleton className="h-2 w-full" />
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <Skeleton className="h-3 w-24" />
                                                    <Skeleton className="h-3 w-12" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-muted-foreground">Occupation</span>
                                                    <span className="font-medium">{pct}%</span>
                                                </div>
                                                <Progress value={pct} className="h-2" />
                                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                    <span>Places occupées</span>
                                                    <span className="font-medium">{occupied}/{capacity}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenEdit(p);
                                            }}
                                        >
                                            <Icons.edit className="h-3 w-3 mr-1" /> Modifier
                                        </Button>
                                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenDetail(p)}>
                                            <Icons.eyeOff className="h-3 w-3 mr-1" /> Détails
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
                                <p className="text-sm text-muted-foreground">Total des parkings</p>
                                <p className="text-2xl font-bold">{list.length}</p>
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
                                <p className="text-sm text-muted-foreground">Disponibles</p>
                                <p className="text-2xl font-bold">{availableCount}</p>
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
                                <p className="text-sm text-muted-foreground">Capacité totale</p>
                                <p className="text-2xl font-bold">{totalCapacity}</p>
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
                                <p className="text-sm text-muted-foreground">Occupation connue</p>
                                <p className="text-2xl font-bold">{knownOccupied}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sheet de détail */}
            <ParkingsDetailSheet parking={selectedParking} open={detailOpen} onOpenChange={setDetailOpen} />

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
