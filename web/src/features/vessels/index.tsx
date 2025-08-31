"use client";

import { Main } from "@/components/ui/main";
import { useMemo, useState } from "react";
import { VesselsAddButtons } from "./components/vessels-add-buttons";
import { VesselsColumns } from "./components/vessels-columns";
import { VesselsDataTable } from "./components/vessels-data-table";
import { VesselsDialogs } from "./components/vessels-dialogs";
import type { Vessel } from "./data/schema";
import { useVessels } from "./hooks/useVessels";

export default function Vessels() {
    // Client-side pagination & filters (no meta provided by API yet)
    const [q, setQ] = useState("");
        const { data: queryData, isLoading } = useVessels({ q });
        const data = useMemo<Vessel[]>(() => queryData?.data ?? [], [queryData]);

    return (
        <>
            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Liste des navires</h2>
                        <p className="text-muted-foreground">Gérez vos navires (vessels).</p>
                    </div>
            <VesselsAddButtons />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <VesselsDataTable
                        columns={VesselsColumns}
                        data={data}
                        isLoading={isLoading}
                        // Client-side pagination only for now
                        query={q}
                        onQueryChange={(value) => {
                            setQ(value);
                        }}
                    />
                </div>
        <VesselsDialogs />
            </Main>
        </>
    );
}
