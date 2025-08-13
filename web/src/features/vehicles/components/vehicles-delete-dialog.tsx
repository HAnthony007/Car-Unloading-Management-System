"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useVehiclesContext } from "../context/vehicles-context";

export function VehiclesDeleteDialog() {
    const { selectedVehicle, deleteDialogOpen, setDeleteDialogOpen } =
        useVehiclesContext();

    const handleDelete = () => {
        if (selectedVehicle) {
            // Ici vous pouvez ajouter la logique pour supprimer le véhicule
            console.log("Supprimer le véhicule:", selectedVehicle.id);
            setDeleteDialogOpen(false);
        }
    };

    if (!selectedVehicle) return null;

    return (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogDescription>
                        Êtes-vous sûr de vouloir supprimer le véhicule{" "}
                        <span className="font-mono font-bold">
                            {selectedVehicle.plateNumber}
                        </span>{" "}
                        ?
                        <br />
                        <br />
                        <span className="text-red-600 font-medium">
                            Cette action est irréversible et supprimera
                            définitivement toutes les données associées à ce
                            véhicule.
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setDeleteDialogOpen(false)}
                    >
                        Annuler
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                        Supprimer définitivement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
