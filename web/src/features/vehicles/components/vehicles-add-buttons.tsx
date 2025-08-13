"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import { useVehiclesContext } from "../context/vehicles-context";

export function VehiclesAddButtons() {
    const { setAddDialogOpen } = useVehiclesContext();

    return (
        <div className="flex items-center space-x-2">
            <Button onClick={() => setAddDialogOpen(true)}>
                <Icons.plus size={16} className="mr-2" />
                Ajouter un véhicule
            </Button>
        </div>
    );
}
