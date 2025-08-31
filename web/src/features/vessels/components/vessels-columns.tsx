"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vessel } from "../data/schema";
import { VesselsRowActions } from "./vessels-row-actions";

export const VesselsColumns: ColumnDef<Vessel>[] = [
  {
    accessorKey: "imoNo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IMO" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.imoNo}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom du navire" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[260px]">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "flag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pavillon" />
    ),
    cell: ({ row }) => <div className="w-fit">{row.original.flag}</div>,
    filterFn: (row, id, value) => {
      // value is string[] from DataTableFacetedFilter
      return (value as string[]).includes(String(row.getValue(id)));
    },
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <VesselsRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
];
