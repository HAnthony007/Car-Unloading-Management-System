"use client";

import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useVehiclesContext } from "../context/vehicles-context";
import { vehicleStatuses, vehicleTypes } from "../data/schema";

export function VehiclesViewDialog() {
    const { selectedVehicle, viewDialogOpen, setViewDialogOpen } =
        useVehiclesContext();

    if (!selectedVehicle) return null;

    const vehicleStatus = vehicleStatuses.find(
        ({ value }) => value === selectedVehicle.status
    );
    const vehicleType = vehicleTypes.find(
        ({ value }) => value === selectedVehicle.type
    );

    const statusColors = {
        available: "bg-green-100 text-green-700 border-green-200",
        in_use: "bg-blue-100 text-blue-700 border-blue-200",
        maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
        out_of_service: "bg-red-100 text-red-700 border-red-200",
    };

    return (
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span className="font-mono text-xl">
                            {selectedVehicle.plateNumber}
                        </span>
                        <Badge
                            className={`${
                                statusColors[selectedVehicle.status]
                            } border-none`}
                        >
                            {vehicleStatus?.label}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Détails complets du véhicule
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Informations principales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Marque
                            </h4>
                            <p className="text-lg font-medium">
                                {selectedVehicle.brand}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Modèle
                            </h4>
                            <p className="text-lg font-medium">
                                {selectedVehicle.model}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Année
                            </h4>
                            <p className="text-lg font-medium">
                                {selectedVehicle.year}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Type
                            </h4>
                            <Badge
                                variant="outline"
                                className="text-base px-3 py-1"
                            >
                                {vehicleType?.label}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Capacité et chauffeur */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Capacité
                            </h4>
                            <p className="text-lg font-medium">
                                {selectedVehicle.capacity
                                    ? `${selectedVehicle.capacity.toLocaleString()} kg`
                                    : "Non spécifiée"}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                Chauffeur assigné
                            </h4>
                            <p className="text-lg font-medium">
                                {selectedVehicle.driver || "Non assigné"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Maintenance */}
                    <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                            Dernière maintenance
                        </h4>
                        <p className="text-lg font-medium">
                            {selectedVehicle.lastMaintenance
                                ? new Date(
                                      selectedVehicle.lastMaintenance
                                  ).toLocaleDateString("fr-FR")
                                : "Aucune maintenance enregistrée"}
                        </p>
                    </div>

                    {/* Notes */}
                    {selectedVehicle.notes && (
                        <>
                            <Separator />
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground mb-1">
                                    Notes
                                </h4>
                                <p className="text-base bg-muted/50 p-3 rounded-md">
                                    {selectedVehicle.notes}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
