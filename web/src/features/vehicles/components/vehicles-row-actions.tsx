import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/react-table";
import type { Vehicle } from "../data/schema";
import { useVehiclesStore } from "../store/vehicles-store";

interface VehiclesRowActionsProps {
  row: Row<Vehicle>;
}

export const VehiclesRowActions = ({ row }: VehiclesRowActionsProps) => {
  const setOpen = useVehiclesStore((s) => s.setOpen);
  const setCurrentRow = useVehiclesStore((s) => s.setCurrentRow);
  const stop = (e: React.SyntheticEvent) => {
    // Stop bubbling to the row, but don't prevent default so the menu can open
    e.stopPropagation();
  };
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="data-[state=open]:bg-muted h-8 w-8 p-0"
          data-prevent-row-click
          onClick={stop}
          onMouseDown={stop}
          onPointerDown={stop}
          onKeyDown={stop}
        >
          <Icons.moreH className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[160px]"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setCurrentRow(row.original);
            setOpen("edit");
          }}
        >
          Edit
          <DropdownMenuShortcut>
            <Icons.edit className="h-4 w-4" />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            setCurrentRow(row.original);
            setOpen("delete");
          }}
          variant="destructive"
        >
          Delete
          <DropdownMenuShortcut>
            <Icons.trash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
