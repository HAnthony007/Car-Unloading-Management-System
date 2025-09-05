"use client";

import { Main } from "@/components/ui/main";
import { useMemo } from "react";
import { UsersAddButtons } from "./components/users-add-buttons";
import { UsersColumns } from "./components/users-columns";
import { UsersDataTable } from "./components/users-data-table";
import { UsersDialogs } from "./components/users-dialogs";
// Zustand store replaces React context provider
import type { User } from "./data/schema";
import { useUsers } from "./hooks/useUsers";
import { useUsersStore } from "./store/users-store";

export default function Users() {
  // Global list state kept in feature store: src/features/users/store
  const page = useUsersStore((s) => s.page);
  const setPage = useUsersStore((s) => s.setPage);
  const perPage = useUsersStore((s) => s.perPage);
  const setPerPage = useUsersStore((s) => s.setPerPage);
  const q = useUsersStore((s) => s.q);
  const setQ = useUsersStore((s) => s.setQ);
  const roles = useUsersStore((s) => s.roles);
  const setRoles = useUsersStore((s) => s.setRoles);

  // Data fetching with TanStack Query: src/features/users/hooks/useUsers
  const { data: queryData, isLoading } = useUsers({ page, perPage, q, roles });
  const data = useMemo<User[]>(() => queryData?.data ?? [], [queryData]);
  const meta = queryData?.meta;

  return (
    <>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Liste des utilisateurs
            </h2>
            <p className="text-muted-foreground">
              Gérez vos utilisateurs et leurs rôles.
            </p>
          </div>
          <UsersAddButtons />
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <UsersDataTable
            columns={UsersColumns}
            data={data}
            isLoading={isLoading}
            serverMeta={meta}
            onServerPageChange={(p) => setPage(p)}
            onServerPageSizeChange={(size) => {
              setPerPage(size);
              setPage(1);
            }}
            query={q}
            onQueryChange={(value) => {
              setQ(value);
              setPage(1);
            }}
            onRolesChange={(r) => {
              setRoles(r);
              setPage(1);
            }}
          />
        </div>
      </Main>
      <UsersDialogs />
    </>
  );
}
