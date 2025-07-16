import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/features/users/data/schema";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";

interface DataTableRowActionsProps {
    row: Row<User>;
}

export const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
    // const { setOpen, setCurrentRow } = useUsers();
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted h-8 w-8 p-0"
                    >
                        <Icons.moreH className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() =>
                            toast.success(`Edit user ${row.original}`)
                        }
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <Icons.edit className="h-4 w-4" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() =>
                            toast.success(`Delete user ${row.original}`)
                        }
                        className="text-red-500!"
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <Icons.trash size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
