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
import { VesselsDataTableToolbar } from "@/features/vessels/components/vessels-data-table-toolbar";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

interface VesselsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  // client-side only for now
  query?: string;
  onQueryChange?: (q: string) => void;
}

export function VesselsDataTable<TData extends Record<string, any>, TValue>({
  columns,
  data,
  isLoading = false,
  query,
  onQueryChange,
}: VesselsDataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [dense, setDense] = useState(false);

  const filteredData = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    if (!q) return data as TData[];
    return (data as TData[]).filter((row: any) => {
      const hay = `${row.imoNo || ""} ${row.name || ""} ${row.flag || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [data, query]);

  const table = useReactTable({
    data: filteredData,
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
    getFilteredRowModel: getFilteredRowModel(),

    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  getPaginationRowModel: getPaginationRowModel(),
  });

  const visibleLeafColumns = table.getVisibleLeafColumns();
  const visibleLeafColumnsCount = visibleLeafColumns.length;
  const columnIds = visibleLeafColumns.map((c) => c.id);
  const skeletonRowKeys = useMemo(
    () => Array.from({ length: 8 }, () => Math.random().toString(36).slice(2)),
    [],
  );

  return (
    <div className="space-y-4">
      <VesselsDataTableToolbar
        table={table}
        dense={dense}
        onToggleDensity={() => setDense((d) => !d)}
        query={query}
        onQueryChange={onQueryChange}
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
                        <div className="h-3 w-32 rounded bg-muted" />
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
                    " hover:bg-primary/10 group"
                  }
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
                    <span className="font-semibold text-lg">Aucun navire trouvé</span>
                    <span className="text-sm text-muted-foreground">Ajustez votre recherche.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
