"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { userRoles } from "../data/data";
import { User } from "../data/schema";
import { DataTableRowActions } from "./data-table-row-actions";

export const UsersColumns: ColumnDef<User>[] = [
    {
        id: "avatar",
        header: () => <span className="sr-only">Avatar</span>,
        cell: ({ row }) => {
            const email = row.original.email;
            const initials = email
                .split("@")[0]
                .split(/[.\-_]/)
                .map((part) => part[0]?.toUpperCase() || "")
                .join("")
                .slice(0, 2);
            return (
                <div className="flex items-center justify-center">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-base">
                        {initials}
                    </span>
                </div>
            );
        },
        meta: {
            className: "sticky left-0 z-10 bg-background",
        },
        enableSorting: false,
        enableHiding: false,
        size: 60,
        minSize: 60,
        maxSize: 60,
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
                            className="text-muted-foreground"
                        />
                    )}
                    <Badge
                        className={
                            role === "admin"
                                ? "bg-red-100 text-red-700 border-none"
                                : "bg-blue-100 text-blue-700 border-none"
                        }
                    >
                        {role}
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
        accessorKey: "actions",
        cell: DataTableRowActions,
    },
];
