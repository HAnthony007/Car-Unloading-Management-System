"use client";

import { Icons } from "@/components/icons/icon";
import { DataTablePagination } from "@/components/table/data-table-pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { VehiclesDataTableToolbar } from "@/features/vehicles/components/vehicles-data-table-toolbar";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useVehiclesStore } from "../store/vehicles-store";

interface VehiclesDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  serverMeta?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  onServerPageChange?: (page: number) => void; // 1-based
  onServerPageSizeChange?: (size: number) => void;
  // Server-driven filtering controls
  query?: string;
  onQueryChange?: (q: string) => void;
  onFiltersChange?: (filters: { ownerName?: string[]; color?: string[]; type?: string[] }) => void;
  onClearFilters?: () => void;
}

export function VehiclesDataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  serverMeta,
  onServerPageChange,
  onServerPageSizeChange,
  query,
  onQueryChange,
  onFiltersChange,
  onClearFilters,
}: VehiclesDataTableProps<TData, TValue>) {
  const isServer = Boolean(serverMeta);
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dense, setDense] = useState(false);

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      sorting,
      columnFilters,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onColumnFiltersChange: setColumnFilters,
  // propagate faceted column filters to parent for server-driven filtering
  // we'll watch columnFilters via effect below and call onFiltersChange
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // Disable client pagination when server-side pagination is used
    getPaginationRowModel: isServer ? undefined : undefined,
    manualPagination: isServer,
  });

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const visibleLeafColumnsCount = visibleLeafColumns.length;
  const columnIds = visibleLeafColumns.map((c) => c.id);
  const skeletonRowKeys = useMemo(
    () => Array.from({ length: 8 }, () => Math.random().toString(36).slice(2)),
    [],
  );

  // Keep table pageSize in sync with server perPage so visible rows match server
  useEffect(() => {
    if (!isServer || !serverMeta?.perPage) return;
    const currentSize = (table.getState().pagination as any)?.pageSize;
    if (currentSize !== serverMeta.perPage) {
      table.setPageSize(serverMeta.perPage);
    }
  }, [isServer, serverMeta?.perPage, table]);

  // Watch columnFilters and forward selected values for certain columns
  useEffect(() => {
    if (!onFiltersChange) return;
    const filters = table.getState().columnFilters;
    const out: { ownerName?: string[]; color?: string[]; type?: string[] } = {};
    for (const f of filters) {
      if (f.id === "ownerName") {
        out.ownerName = Array.isArray(f.value) ? f.value : [String(f.value)];
      }
      if (f.id === "color") {
        out.color = Array.isArray(f.value) ? f.value : [String(f.value)];
      }
      if (f.id === "type") {
        out.type = Array.isArray(f.value) ? f.value : [String(f.value)];
      }
    }
    onFiltersChange(out);
  }, [table.getState().columnFilters]);

  return (
    <div className="space-y-4">
      <VehiclesDataTableToolbar
        table={table}
        dense={dense}
        onToggleDensity={() => setDense((d) => !d)}
        query={query}
        onQueryChange={onQueryChange}
  onClearFilters={onClearFilters}
      />
      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={
                        "sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 " +
                        (dense ? "h-9 py-2" : "h-11 py-3") +
                        " " +
                        // @ts-expect-error allow meta className if provided
                        (header.column.columnDef?.meta?.className || "")
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              skeletonRowKeys.map((rowKey) => (
                <TableRow key={rowKey} className="animate-pulse">
                  {Array.from({ length: visibleLeafColumnsCount }).map(
                    (__, j) => (
                      <TableCell
                        key={`${rowKey}-${columnIds[j] ?? j}`}
                        className={dense ? "py-2" : "py-3"}
                      >
                        <div
                          className={
                            j === 0
                              ? "h-3 w-28 rounded bg-muted"
                              : "h-3 w-32 rounded bg-muted"
                          }
                        />
                      </TableCell>
                    ),
                  )}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    "transition-colors " +
                    (idx % 2 === 0 ? "bg-background" : "bg-muted/50") +
                    " hover:bg-primary/10 group cursor-pointer"
                  }
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    // Ignore clicks on interactive elements inside the row
                    if (
                      target.closest('button, a, [role="button"], [data-prevent-row-click], input, select, textarea')
                    ) {
                      return;
                    }
                    const setOpen = useVehiclesStore.getState().setOpen;
                    const setCurrentRow = useVehiclesStore.getState().setCurrentRow;
                    // @ts-expect-error generic table typing
                    setCurrentRow(row.original);
                    setOpen("view");
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        (dense ? "py-2" : "py-3") +
                        " " +
                        // @ts-expect-error allow meta className if provided
                        (cell.column.columnDef?.meta?.className || "")
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 py-8 opacity-70">
                    <Icons.file size={48} className="mb-2 text-muted-foreground" />
                    <span className="font-semibold text-lg">Aucun véhicule trouvé</span>
                    <span className="text-sm text-muted-foreground">Ajustez votre recherche.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        serverMeta={serverMeta}
        onPageChange={onServerPageChange}
        onPageSizeChange={onServerPageSizeChange}
      />
    </div>
  );
}
