import { Icons } from "@/components/icons/icon";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Table } from "@tanstack/react-table";

interface VehiclesDataTableToolbarProps<TData> {
  table: Table<TData>;
  dense?: boolean;
  onToggleDensity?: () => void;
  query?: string;
  onQueryChange?: (q: string) => void;
  onClearFilters?: () => void;
}

export const VehiclesDataTableToolbar = <TData,>({
  table,
  dense = false,
  onToggleDensity,
  query,
  onQueryChange,
  onClearFilters,
}: VehiclesDataTableToolbarProps<TData>) => {
  const hasQuery = Boolean((query ?? "").trim() !== "");

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Rechercher..."
          value={typeof query === "string" ? query : ""}
          onChange={(event) => {
            const v = event.target.value;
            onQueryChange?.(v);
          }}
          className="h-8 w-[150px] lg:w-auto"
        />

        <div className="flex gap-x-2">
          {table.getColumn("ownerName") && (
            <DataTableFacetedFilter
              column={table.getColumn("ownerName")}
              title="Propriétaire"
              options={[]}
            />
          )}
          {table.getColumn("color") && (
            <DataTableFacetedFilter
              column={table.getColumn("color")}
              title="Couleur"
              options={[]}
            />
          )}
          {table.getColumn("type") && (
            <DataTableFacetedFilter
              column={table.getColumn("type")}
              title="Type"
              options={[]}
            />
          )}
        </div>

        {(hasQuery || table.getState().columnFilters.length > 0) && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters();
              onQueryChange?.("");
              if (onClearFilters) onClearFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            Réinitialiser
            <Icons.x className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={onToggleDensity}
        >
          <Icons.arrowUpDown className="mr-2 h-4 w-4" />
          {dense ? "Compact" : "Confort"}
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
};
