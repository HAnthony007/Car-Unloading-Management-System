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
    const [ownerName, setOwnerName] = useState("");
    const [color, setColor] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [originCountry, setOriginCountry] = useState("");

    const { data: queryData, isLoading } = useVehicles({ page, perPage, q, ownerName, color, type: typeFilter, originCountry });
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
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <input
                            placeholder="Pays d'origine"
                            value={originCountry}
                            onChange={(e) => {
                                setOriginCountry(e.target.value);
                                setPage(1);
                            }}
                            className="input input-sm mr-2 rounded border px-2 py-1"
                        />
                    </div>
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
                        onFiltersChange={({ ownerName: o, color: c, type: t }) => {
                            // take first selected value for each filter if present
                            setOwnerName(o && o.length ? o[0] : "");
                            setColor(c && c.length ? c[0] : "");
                            setTypeFilter(t && t.length ? t[0] : "");
                            setPage(1);
                        }}
                        onClearFilters={() => {
                            setOwnerName("");
                            setColor("");
                            setTypeFilter("");
                            setQ("");
                            setPage(1);
                        }}
                    />
                </div>
            </Main>
            <VehiclesDialogs />
        </>
    );
}
