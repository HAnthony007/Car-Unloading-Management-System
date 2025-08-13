"use client";

import { VehiclesAddDialog } from "./vehicles-add-dialog";
import { VehiclesDeleteDialog } from "./vehicles-delete-dialog";
import { VehiclesEditDialog } from "./vehicles-edit-dialog";
import { VehiclesViewDialog } from "./vehicles-view-dialog";

export function VehiclesDialogs() {
    return (
        <>
            <VehiclesViewDialog />
            <VehiclesEditDialog />
            <VehiclesDeleteDialog />
            <VehiclesAddDialog />
        </>
    );
}
