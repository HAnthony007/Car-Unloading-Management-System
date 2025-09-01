"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PortCall {
    port_call_id: number;
    vessel_agent: string;
    origin_port: string;
    estimated_arrival: string;
    arrival_date: string;
    estimated_departure: string;
    departure_date: string;
    vessel_id: number;
    dock_id: number;
    created_at: string;
    updated_at: string;
}

// Données d'exemple avec plusieurs Port Calls
const samplePortCalls: PortCall[] = [
    {
        port_call_id: 5,
        vessel_agent: "Lesch and Sons",
        origin_port: "East Mohamed",
        estimated_arrival: "2025-08-22T01:27:32.000000Z",
        arrival_date: "2025-08-31T22:49:55.000000Z",
        estimated_departure: "2025-09-01T22:07:37.000000Z",
        departure_date: "2025-09-05T19:36:31.000000Z",
        vessel_id: 10,
        dock_id: 8,
        created_at: "2025-09-01T19:24:25.000000Z",
        updated_at: "2025-09-01T19:24:25.000000Z",
    },
    {
        port_call_id: 6,
        vessel_agent: "Maritime Solutions Ltd",
        origin_port: "Port of Rotterdam",
        estimated_arrival: "2025-09-10T08:00:00.000000Z",
        arrival_date: "2025-09-10T08:15:00.000000Z",
        estimated_departure: "2025-09-12T18:00:00.000000Z",
        departure_date: "2025-09-12T17:45:00.000000Z",
        vessel_id: 15,
        dock_id: 12,
        created_at: "2025-09-08T10:30:00.000000Z",
        updated_at: "2025-09-12T17:45:00.000000Z",
    },
    {
        port_call_id: 7,
        vessel_agent: "Global Shipping Co",
        origin_port: "Singapore Port",
        estimated_arrival: "2025-09-15T12:00:00.000000Z",
        arrival_date: "2025-09-15T11:45:00.000000Z",
        estimated_departure: "2025-09-18T06:00:00.000000Z",
        departure_date: "2025-09-18T06:30:00.000000Z",
        vessel_id: 22,
        dock_id: 5,
        created_at: "2025-09-12T14:20:00.000000Z",
        updated_at: "2025-09-18T06:30:00.000000Z",
    },
    {
        port_call_id: 8,
        vessel_agent: "Ocean Freight Services",
        origin_port: "Marseille Port",
        estimated_arrival: "2025-09-20T16:00:00.000000Z",
        arrival_date: "2025-09-20T16:30:00.000000Z",
        estimated_departure: "2025-09-22T10:00:00.000000Z",
        departure_date: "2025-09-22T10:15:00.000000Z",
        vessel_id: 18,
        dock_id: 9,
        created_at: "2025-09-18T09:15:00.000000Z",
        updated_at: "2025-09-22T10:15:00.000000Z",
    },
];

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Fonction pour calculer le statut du port call
const getPortCallStatus = (portCall: PortCall) => {
    const now = new Date();
    const arrival = new Date(portCall.arrival_date);
    const departure = new Date(portCall.departure_date);

    if (now < arrival)
        return {
            status: "En attente",
            variant: "secondary" as const,
            color: "text-blue-600",
        };
    if (now >= arrival && now <= departure)
        return {
            status: "En cours",
            variant: "default" as const,
            color: "text-green-600",
        };
    return {
        status: "Terminé",
        variant: "outline" as const,
        color: "text-gray-600",
    };
};

// Composant pour afficher une ligne de Port Call
const PortCallRow = ({
    portCall,
    onView,
    onEdit,
    onDelete,
}: {
    portCall: PortCall;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}) => {
    const status = getPortCallStatus(portCall);

    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                <Icons.area className="h-5 w-5 text-primary" />
                                <h3 className="font-semibold text-lg">
                                    Port Call #{portCall.port_call_id}
                                </h3>
                                <Badge
                                    variant={status.variant}
                                    className={cn("text-xs", status.color)}
                                >
                                    {status.status}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icons.users className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        {portCall.vessel_agent}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icons.file className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Port: {portCall.origin_port}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icons.calendar className="h-4 w-4 text-green-600" />
                                    <span className="text-muted-foreground">
                                        Arrivée:{" "}
                                        {formatDate(portCall.arrival_date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icons.calendar className="h-4 w-4 text-red-600" />
                                    <span className="text-muted-foreground">
                                        Départ:{" "}
                                        {formatDate(portCall.departure_date)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Icons.car className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Vessel: #{portCall.vessel_id}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icons.area className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">
                                        Dock: #{portCall.dock_id}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(portCall.port_call_id)}
                            className="w-full"
                        >
                            <Icons.eye className="h-4 w-4 mr-2" />
                            Voir
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(portCall.port_call_id)}
                            className="w-full"
                        >
                            <Icons.edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(portCall.port_call_id)}
                            className="w-full text-red-600 hover:text-red-700"
                        >
                            <Icons.trash className="h-4 w-4 mr-2" />
                            Supprimer
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default function PortCall() {
    const router = useRouter();
    const [portCalls, setPortCalls] = useState<PortCall[]>(samplePortCalls);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("date");

    // Filtrage et tri des Port Calls
    const filteredPortCalls = portCalls
        .filter((portCall) => {
            const matchesSearch =
                portCall.vessel_agent
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                portCall.origin_port
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                portCall.port_call_id.toString().includes(searchTerm);

            if (statusFilter === "all") return matchesSearch;

            const status = getPortCallStatus(portCall);
            return (
                matchesSearch &&
                status.status.toLowerCase().includes(statusFilter.toLowerCase())
            );
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "date":
                    return (
                        new Date(b.arrival_date).getTime() -
                        new Date(a.arrival_date).getTime()
                    );
                case "id":
                    return b.port_call_id - a.port_call_id;
                case "agent":
                    return a.vessel_agent.localeCompare(b.vessel_agent);
                default:
                    return 0;
            }
        });

    // Actions
    const handleView = (id: number) => {
        router.push(`/dashboard/port/portcall/${id}` as any);
    };

    const handleEdit = (id: number) => {
        console.log(`Modifier Port Call #${id}`);
        // Ici vous pouvez naviguer vers la page d'édition ou ouvrir un formulaire
    };

    const handleDelete = (id: number) => {
        if (
            confirm(`Êtes-vous sûr de vouloir supprimer le Port Call #${id} ?`)
        ) {
            setPortCalls(portCalls.filter((pc) => pc.port_call_id !== id));
        }
    };

    const handleNewPortCall = () => {
        console.log("Créer un nouveau Port Call");
        // Ici vous pouvez naviguer vers la page de création
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* En-tête avec titre et actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Gestion des Port Calls
                    </h1>
                    <p className="text-muted-foreground">
                        Suivi et gestion de tous les escales portuaires
                    </p>
                </div>
                <Button
                    onClick={handleNewPortCall}
                    className="flex items-center gap-2"
                >
                    <Icons.plusCircled className="h-5 w-5" />
                    Nouveau Port Call
                </Button>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.area className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {portCalls.length}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Total Port Calls
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.calendar className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {
                                        portCalls.filter(
                                            (pc) =>
                                                getPortCallStatus(pc).status ===
                                                "En cours"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    En cours
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.clock className="h-6 w-6 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {
                                        portCalls.filter(
                                            (pc) =>
                                                getPortCallStatus(pc).status ===
                                                "En attente"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    En attente
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Icons.check className="h-6 w-6 text-gray-600" />
                            <div>
                                <p className="text-2xl font-bold">
                                    {
                                        portCalls.filter(
                                            (pc) =>
                                                getPortCallStatus(pc).status ===
                                                "Terminé"
                                        ).length
                                    }
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Terminés
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Rechercher par agent, port ou ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tous les statuts
                                </SelectItem>
                                <SelectItem value="En attente">
                                    En attente
                                </SelectItem>
                                <SelectItem value="En cours">
                                    En cours
                                </SelectItem>
                                <SelectItem value="Terminé">Terminé</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Trier par" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">
                                    Date d'arrivée
                                </SelectItem>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="agent">Agent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Liste des Port Calls */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        Port Calls ({filteredPortCalls.length})
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icons.alertCircle className="h-4 w-4" />
                        Cliquez sur une ligne pour plus de détails
                    </div>
                </div>

                {filteredPortCalls.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Icons.area className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">
                                Aucun Port Call trouvé
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                Aucun Port Call ne correspond à vos critères de
                                recherche.
                            </p>
                            <Button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                }}
                            >
                                Effacer les filtres
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPortCalls.map((portCall) => (
                        <PortCallRow
                            key={portCall.port_call_id}
                            portCall={portCall}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
