"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../data/schema";

export const UsersColumns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
];
