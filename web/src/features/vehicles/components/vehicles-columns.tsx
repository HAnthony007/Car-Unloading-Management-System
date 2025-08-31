"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vehicle } from "../data/schema";
import { VehiclesRowActions } from "./vehicles-row-actions";

export const VehiclesColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "vin",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="VIN" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original.vin}</div>,
  },
  {
    accessorKey: "make",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Marque" />
    ),
    cell: ({ row }) => <div>{row.original.make}</div>,
  },
  {
    accessorKey: "model",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modèle" />
    ),
    cell: ({ row }) => <div>{row.original.model}</div>,
  },
  {
    accessorKey: "year",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Année" />
    ),
    cell: ({ row }) => <div>{row.original.year}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Propriétaire" />
    ),
    cell: ({ row }) => <div className="truncate max-w-[220px]">{row.original.ownerName}</div>,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.type}</div>,
  },
  {
    accessorKey: "color",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Couleur" />
    ),
    cell: ({ row }) => <div>{row.original.color}</div>,
  },
  {
    accessorKey: "condition",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="État" />
    ),
    cell: ({ row }) => <div>{row.original.condition}</div>,
  },
  {
    accessorKey: "actions",
    cell: VehiclesRowActions,
  },
];
