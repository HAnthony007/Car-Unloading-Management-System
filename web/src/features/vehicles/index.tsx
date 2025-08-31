"use client";

import { Main } from "@/components/ui/main";
import { useMemo, useState } from "react";
import { VehiclesAddButtons } from "./components/vehicles-add-buttons";
import { VehiclesColumns } from "./components/vehicles-columns";
import { VehiclesDataTable } from "./components/vehicles-data-table";
import { VehiclesDialogs } from "./components/vehicles-dialogs";
import type { Vehicle } from "./data/schema";
import { useVehicles } from "./hooks/useVehicles";

export default function Vehicles() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [q, setQ] = useState("");

    const { data: queryData, isLoading } = useVehicles({ page, perPage, q });
    const data = useMemo<Vehicle[]>(() => queryData?.data ?? [], [queryData]);
    const meta = queryData?.meta;

    return (
        <>
            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Liste des véhicules
                        </h2>
                        <p className="text-muted-foreground">Gérez vos véhicules.</p>
                    </div>
                                          <VehiclesAddButtons />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                                <VehiclesDataTable
                        columns={VehiclesColumns}
                        data={data}
                        isLoading={isLoading}
                        serverMeta={meta}
                                    onServerPageChange={(p: number) => setPage(p)}
                                    onServerPageSizeChange={(size: number) => {
                            setPerPage(size);
                            setPage(1);
                        }}
                        query={q}
                                    onQueryChange={(value: string) => {
                            setQ(value);
                            setPage(1);
                        }}
                    />
                </div>
            </Main>
            <VehiclesDialogs />
        </>
    );
}
