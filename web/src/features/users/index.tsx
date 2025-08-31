"use client";

import { Main } from "@/components/ui/main";
import { useMemo, useState } from "react";
import { UsersAddButtons } from "./components/users-add-buttons";
import { UsersColumns } from "./components/users-columns";
import { UsersDataTable } from "./components/users-data-table";
import { UsersDialogs } from "./components/users-dialogs";
// Zustand store replaces React context provider
import type { User } from "./data/schema";
import { useUsers } from "./hooks/useUsers";

export default function Users() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [q, setQ] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
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
