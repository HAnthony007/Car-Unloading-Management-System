"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { userRoles } from "../data/data";
import { User } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const UsersColumns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
        cell: ({ row }) => <div>{row.getValue("id")}</div>,
        meta: {
            className: cn(
                "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
                "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                "sticky left-6 md:table-cell"
            ),
        },
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ row }) => (
            <div className="w-fit text-nowrap">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const { role } = row.original;
            const userRole = userRoles.find(({ value }) => value === role);
            if (!userRole) return null;
            return (
                <div className="flex items-center space-x-2">
                    {userRole.icon && (
                        <userRole.icon
                            size={16}
                            className="texm-muted-foreground"
                        />
                    )}
                    <span className="text-sm capitalize">
                        {row.getValue("role")}
                    </span>
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
        accessorKey: "actions",
        cell: DataTableRowActions,
    },
];
