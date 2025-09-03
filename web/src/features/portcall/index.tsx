"use client";

import { Icons } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Main } from "@/components/ui/main";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PortCallFilters } from "./components/PortCallFilters";
import { PortCallList } from "./components/PortCallList";
import type { PortCall } from "./data/schema";
import { usePortCalls } from "./hooks/usePortCalls";

export default function PortCall() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(15);
    const [q, setQ] = useState("");
    const [status, setStatus] = useState<string>("all");
    const { data: queryData, isLoading } = usePortCalls({ page, perPage, q, status });
    const portCalls = useMemo<PortCall[]>(() => queryData?.data ?? [], [queryData]);
    const meta = queryData?.meta;

    const handleView = (id: number) => router.push(`/dashboard/port/portcall/${id}`);
    const handleEdit = (id: number) => console.log("edit", id);
    const handleDelete = (id: number) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer le Port Call #${id} ?`)) {
            console.log("delete", id);
        }
    };

    return (
        <Main>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gestion des Port Calls</h2>
                    <p className="text-muted-foreground">Suivi et gestion de tous les escales portuaires</p>
                </div>
                <div>
                    <Button className="flex items-center gap-2" onClick={() => console.log("Créer nouveau")}>
                        <Icons.plusCircled className="h-5 w-5" />Nouveau Port Call
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.area className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">{/* count could go here */}</p>
                                <p className="text-sm text-muted-foreground">Total Port Calls</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.calendar className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">&nbsp;</p>
                                <p className="text-sm text-muted-foreground">En cours</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.clock className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">&nbsp;</p>
                                <p className="text-sm text-muted-foreground">En attente</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.check className="h-6 w-6 text-gray-600" />
                            <div>
                                <p className="text-2xl font-bold">&nbsp;</p>
                                <p className="text-sm text-muted-foreground">Terminés</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <PortCallFilters
                        searchTerm={q}
                        onSearch={(value) => {
                            setQ(value);
                            setPage(1);
                        }}
                        statusFilter={status}
                        onStatusChange={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                        sortBy={"date"}
                        onSortChange={() => {}}
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Port Calls ({portCalls.length})</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icons.info className="h-4 w-4" />Cliquez sur une ligne pour plus de détails
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                        <Icons.spinner className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <PortCallList portCalls={portCalls} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                )}
            </div>
        </Main>
    );
}
