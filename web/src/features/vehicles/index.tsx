"use client";

import { Main } from "@/components/layout/main";
import { useEffect, useState } from "react";
import { VehiclesAddButtons } from "./components/vehicles-add-buttons";
import { VehiclesColumns } from "./components/vehicles-columns";
import { VehiclesDataTable } from "./components/vehicles-data-table";
import { VehiclesDialogs } from "./components/vehicles-dialogs";
import VehiclesContextProvider from "./context/vehicles-context";
import { Vehicle } from "./data/schema";
import { FetchVehicles } from "./data/vehicles";

export default function Vehicles() {
    const [data, setData] = useState<Vehicle[]>([]);

    useEffect(() => {
        FetchVehicles().then(setData);
    }, []);

    return (
        <VehiclesContextProvider>
            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Liste des véhicules
                        </h2>
                        <p className="text-muted-foreground">
                            Gérez votre flotte de véhicules ici.
                        </p>
                    </div>
                    <VehiclesAddButtons />
                </div>
                <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
                    <VehiclesDataTable columns={VehiclesColumns} data={data} />
                </div>
            </Main>
            <VehiclesDialogs />
        </VehiclesContextProvider>
    );
}
