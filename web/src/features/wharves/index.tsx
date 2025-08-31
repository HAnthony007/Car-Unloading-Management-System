"use client";

import { Icons } from "@/components/icons/icon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Main } from "@/components/ui/main";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo, useState } from "react";
import { useDocks } from "./hooks/useDocks";
import type { Dock } from "./types";

export default function Wharves() {
  const { data, isLoading, isError, error, refetch, isFetching } = useDocks();
  const [q, setQ] = useState("");

  const docks = useMemo(() => data?.data ?? [], [data]);
  const filtered = useMemo(() => {
    if (!q) return docks;
    const s = q.toLowerCase();
    return docks.filter(
      (d) =>
        d.dock_name.toLowerCase().includes(s) ||
        (d.location || "").toLowerCase().includes(s),
    );
  }, [docks, q]);

  return (
    <Main>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Liste des quais</h2>
          <p className="text-muted-foreground">Parcourez et recherchez vos quais.</p>
        </div>
        <div className="w-full max-w-xs">
          <Input
            placeholder="Rechercher un quai…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      {isError && (
        <Alert variant="destructive" className="mb-4">
          <Icons.alertCircle />
          <AlertTitle>Erreur lors du chargement</AlertTitle>
          <AlertDescription>
            {(error as Error)?.message || "Une erreur est survenue."}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-0">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-2 h-4 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onRetry={() => refetch()} isLoading={isFetching} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((dock) => (
            <DockCard key={dock.dock_id} dock={dock} />
          ))}
        </div>
      )}
    </Main>
  );
}

function DockCard({ dock }: { dock: Dock }) {
  return (
    <Card className="group relative overflow-hidden transition hover:shadow-md">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 transition group-hover:opacity-100" />
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icons.dock className="size-4" />
          </span>
          Quai {dock.dock_name}
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            {dock.location}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-sm text-muted-foreground">
          ID: <span className="text-foreground">{dock.dock_id}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onRetry, isLoading }: { onRetry: () => void; isLoading?: boolean }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border bg-card p-8 text-center">
      <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
        <Icons.search className="size-5 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">Aucun quai trouvé</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Essayez d’ajuster votre recherche ou rechargez la liste.
      </p>
      <button
        className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm shadow-xs hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        onClick={onRetry}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Icons.spinner className="size-4 animate-spin" /> Actualisation…
          </>
        ) : (
          "Recharger"
        )}
      </button>
    </div>
  );
}
