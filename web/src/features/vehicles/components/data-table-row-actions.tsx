"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useVehiclesContext } from "../context/vehicles-context";
import { Vehicle } from "../data/schema";

interface DataTableRowActionsProps {
    row: any;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const vehicle = row.original as Vehicle;
    const {
        setSelectedVehicle,
        setViewDialogOpen,
        setEditDialogOpen,
        setDeleteDialogOpen,
    } = useVehiclesContext();

    const handleView = () => {
        setSelectedVehicle(vehicle);
        setViewDialogOpen(true);
    };

    const handleEdit = () => {
        setSelectedVehicle(vehicle);
        setEditDialogOpen(true);
    };

    const handleDelete = () => {
        setSelectedVehicle(vehicle);
        setDeleteDialogOpen(true);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <Icons.moreHorizontal size={16} />
                    <span className="sr-only">Ouvrir le menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={handleView}>
                    <Icons.eye size={16} className="mr-2" />
                    Voir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                    <Icons.edit size={16} className="mr-2" />
                    Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-600"
                >
                    <Icons.trash size={16} className="mr-2" />
                    Supprimer
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
