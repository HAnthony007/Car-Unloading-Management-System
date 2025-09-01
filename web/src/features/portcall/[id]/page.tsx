"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

// Données d'exemple (en production, cela viendrait de votre API)
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
        month: "long",
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

// Composant pour afficher une information avec icône
const InfoRow = ({
    icon: Icon,
    label,
    value,
    className,
}: {
    icon: any;
    label: string;
    value: string | number;
    className?: string;
}) => (
    <div className={cn("flex items-center gap-3 py-2", className)}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground min-w-[140px]">
            {label}:
        </span>
        <span className="text-sm font-semibold">{value}</span>
    </div>
);

export default function PortCallDetail() {
    const params = useParams();
    const router = useRouter();
    const [portCall, setPortCall] = useState<PortCall | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = parseInt(params.id as string);
        const foundPortCall = samplePortCalls.find(
            (pc) => pc.port_call_id === id
        );

        if (foundPortCall) {
            setPortCall(foundPortCall);
        }
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <Icons.spinner className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (!portCall) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Icons.alertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            Port Call non trouvé
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Le Port Call demandé n'existe pas ou a été supprimé.
                        </p>
                        <Button onClick={() => router.push("/portcall")}>
                            Retour à la liste
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const status = getPortCallStatus(portCall);

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* En-tête avec navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/portcall")}
                        className="flex items-center gap-2"
                    >
                        <Icons.arrowLeft className="h-4 w-4" />
                        Retour
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Port Call #{portCall.port_call_id}
                        </h1>
                        <p className="text-muted-foreground">
                            Détails complets de l'escale portuaire
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        <Icons.edit className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                    <Button size="sm">
                        <Icons.file className="h-4 w-4 mr-2" />
                        Générer rapport
                    </Button>
                </div>
            </div>

            {/* Statut principal */}
            <Card className="border-l-4 border-l-primary">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl">
                                Statut de l'escale
                            </CardTitle>
                            <CardDescription>
                                Informations générales sur le port call
                            </CardDescription>
                        </div>
                        <Badge
                            variant={status.variant}
                            className="text-sm px-3 py-1"
                        >
                            {status.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <InfoRow
                                icon={Icons.users}
                                label="Agent du navire"
                                value={portCall.vessel_agent}
                            />
                            <InfoRow
                                icon={Icons.file}
                                label="Port d'origine"
                                value={portCall.origin_port}
                            />
                            <InfoRow
                                icon={Icons.calendar}
                                label="Vessel ID"
                                value={portCall.vessel_id}
                            />
                            <InfoRow
                                icon={Icons.area}
                                label="Dock ID"
                                value={portCall.dock_id}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Planning des dates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Arrivée */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icons.calendar className="h-5 w-5 text-green-600" />
                            Arrivée
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Arrivée estimée:
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {formatDate(portCall.estimated_arrival)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Arrivée effective:
                                </span>
                                <Badge variant="default" className="text-xs">
                                    {formatDate(portCall.arrival_date)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Départ */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icons.calendar className="h-5 w-5 text-red-600" />
                            Départ
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Départ estimé:
                                </span>
                                <Badge variant="outline" className="text-xs">
                                    {formatDate(portCall.estimated_departure)}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Départ effectif:
                                </span>
                                <Badge variant="default" className="text-xs">
                                    {formatDate(portCall.departure_date)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Informations système */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Informations système
                    </CardTitle>
                    <CardDescription>
                        Métadonnées et informations techniques
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <InfoRow
                                icon={Icons.clock}
                                label="Créé le"
                                value={formatDate(portCall.created_at)}
                            />
                            <InfoRow
                                icon={Icons.clock}
                                label="Modifié le"
                                value={formatDate(portCall.updated_at)}
                            />
                        </div>
                        <div className="space-y-3">
                            <InfoRow
                                icon={Icons.file}
                                label="ID unique"
                                value={portCall.port_call_id}
                            />
                            <div className="flex items-center gap-3 py-2">
                                <Icons.alertCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium text-muted-foreground min-w-[140px]">
                                    Version:
                                </span>
                                <span className="text-sm font-semibold">
                                    1.0
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                            <Icons.eye className="h-4 w-4 mr-2" />
                            Voir les détails
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.file className="h-4 w-4 mr-2" />
                            Générer rapport
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.calendar className="h-4 w-4 mr-2" />
                            Planifier
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.users className="h-4 w-4 mr-2" />
                            Équipe
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
