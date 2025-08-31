import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/react-table";
import type { Vessel } from "../data/schema";
import { useVesselsStore } from "../store/vessels-store";

interface VesselsRowActionsProps {
  row: Row<Vessel>;
}

export const VesselsRowActions = ({ row }: VesselsRowActionsProps) => {
  const setOpen = useVesselsStore((s) => s.setOpen);
  const setCurrentRow = useVesselsStore((s) => s.setCurrentRow);
  const stop = (e: React.SyntheticEvent) => {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
