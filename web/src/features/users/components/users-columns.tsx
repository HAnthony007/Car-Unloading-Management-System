"use client";

import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { userRoles } from "../data/data";
import type { User } from "../data/schema";
import { useTemporaryAvatar } from "../hooks/useTemporaryAvatar";
import { DataTableRowActions } from "./data-table-row-actions";

function UserAvatarCell({ user }: { user: User }) {
  const { data: tempUrl } = useTemporaryAvatar(user.id, true);
  const buildInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
  };
  const initials = buildInitials(user.fullName || user.email);
  return (
    <div className="flex items-center justify-center">
      <Avatar className="h-8 w-8 ring-1 ring-border">
        <AvatarImage src={tempUrl || user.avatarUrl || undefined} alt={user.fullName} />
        <AvatarFallback className="bg-primary/20 text-primary font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

export const UsersColumns: ColumnDef<User>[] = [
  {
    id: "avatar",
    header: () => <span className="sr-only">Avatar</span>,
  cell: ({ row }) => <UserAvatarCell user={row.original} />,
    meta: {
      className:
        "sticky left-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[inset_-1px_0_0_0_hsl(var(--border))]",
    },
    enableSorting: false,
    enableHiding: false,
    size: 60,
    minSize: 60,
    maxSize: 60,
  },
  {
    accessorKey: "matriculationNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Matricule" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.original.matriculationNumber}</div>
    ),
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nom complet" />
    ),
    cell: ({ row }) => (
      <div className="truncate max-w-[220px]">{row.original.fullName}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap text-muted-foreground">
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Téléphone" />
    ),
    cell: ({ row }) => (
      <div className="w-fit text-nowrap">{row.original.phone}</div>
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
            <userRole.icon size={16} className="text-muted-foreground" />
          )}
          <Badge
            className={
              role === "admin"
                ? "bg-destructive/10 text-destructive border-none"
                : "bg-primary/10 text-primary border-none"
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
