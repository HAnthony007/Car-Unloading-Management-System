"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Vehicle, vehicleStatuses, vehicleTypes } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const VehiclesColumns: ColumnDef<Vehicle>[] = [
    {
        id: "plateNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Plaque" />
        ),
        cell: ({ row }) => (
            <div className="font-mono font-bold text-lg">
                {row.getValue("plateNumber")}
            </div>
        ),
        meta: {
            className: "sticky left-0 z-10 bg-background",
        },
        enableSorting: false,
        enableHiding: false,
        size: 120,
        minSize: 120,
        maxSize: 120,
    },
    {
        accessorKey: "brand",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Marque" />
        ),
        cell: ({ row }) => (
            <div className="font-semibold">{row.getValue("brand")}</div>
        ),
    },
    {
        accessorKey: "model",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Modèle" />
        ),
        cell: ({ row }) => (
            <div className="text-muted-foreground">{row.getValue("model")}</div>
        ),
    },
    {
        accessorKey: "year",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Année" />
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("year")}</div>
        ),
        size: 80,
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ row }) => {
            const { type } = row.original;
            const vehicleType = vehicleTypes.find(
                ({ value }) => value === type
            );
            if (!vehicleType) return null;
            return (
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="capitalize">
                        {vehicleType.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Statut" />
        ),
        cell: ({ row }) => {
            const { status } = row.original;
            const vehicleStatus = vehicleStatuses.find(
                ({ value }) => value === status
            );
            if (!vehicleStatus) return null;

            const statusColors = {
                available: "bg-green-100 text-green-700 border-green-200",
                in_use: "bg-blue-100 text-blue-700 border-blue-200",
                maintenance: "bg-yellow-100 text-yellow-700 border-yellow-200",
                out_of_service: "bg-red-100 text-red-700 border-red-200",
            };

            return (
                <div className="flex items-center space-x-2">
                    <Badge className={`${statusColors[status]} border-none`}>
                        {vehicleStatus.label}
                    </Badge>
                </div>
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "capacity",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Capacité (kg)" />
        ),
        cell: ({ row }) => {
            const capacity = row.getValue("capacity") as number;
            return capacity ? (
                <div className="text-center font-mono">
                    {capacity.toLocaleString()}
                </div>
            ) : (
                <div className="text-center text-muted-foreground">-</div>
            );
        },
        size: 100,
    },
    {
        accessorKey: "driver",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Chauffeur" />
        ),
        cell: ({ row }) => {
            const driver = row.getValue("driver") as string;
            return driver ? (
                <div className="font-medium">{driver}</div>
            ) : (
                <div className="text-muted-foreground italic">Non assigné</div>
            );
        },
    },
    {
        accessorKey: "lastMaintenance",
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Dernière maintenance"
            />
        ),
        cell: ({ row }) => {
            const lastMaintenance = row.getValue("lastMaintenance") as string;
            return lastMaintenance ? (
                <div className="text-sm text-muted-foreground">
                    {new Date(lastMaintenance).toLocaleDateString("fr-FR")}
                </div>
            ) : (
                <div className="text-muted-foreground">-</div>
            );
        },
        size: 140,
    },
    {
        accessorKey: "actions",
        cell: DataTableRowActions,
        size: 80,
    },
];
