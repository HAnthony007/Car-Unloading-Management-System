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
import { getPortCallById } from "@/features/portcall/lib/portcalls";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import type { PortCall } from "../data/schema";
import { getPortCallStatus, formatDate as libFormatDate } from "../lib/utils";

const InfoRow = ({
    icon: Icon,
    label,
    value,
    className,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string | number | null | undefined;
    className?: string;
}) => (
    <div className={cn("flex items-center gap-3 py-2", className)}>
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground min-w-[140px]">
            {label}:
        </span>
        <span className="text-sm font-semibold">{value ?? "—"}</span>
    </div>
);

export default function PortCallDetailClient({ id }: { id: number }) {
    const router = useRouter();
    const [portCall, setPortCall] = useState<PortCall | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getPortCallById(id)
            .then((pc) => {
                if (!mounted) return;
                setPortCall(pc as PortCall);
                setError(null);
            })
            .catch((err) => {
                if (!mounted) return;
                setError(err as Error);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <Icons.spinner className="h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <Icons.alertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Erreur</h3>
                        <p className="text-muted-foreground mb-4">
                            {error.message}
                        </p>
                        <Button
                            onClick={() =>
                                router.push("/dashboard/operation/port-call")
                            }
                        >
                            Retour à la liste
                        </Button>
                    </CardContent>
                </Card>
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
                        <Button
                            onClick={() =>
                                router.push("/dashboard/operation/port-call")
                            }
                        >
                            Retour à la liste
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const status = getPortCallStatus(portCall);
    const imo = (portCall as any).vessel?.imo_no ?? null;

    const formatDate = (d?: string | null) => (d ? libFormatDate(d) : "-");

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push("/dashboard/operation/port-call")
                        }
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
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            router.push(
                                `/dashboard/operation/port-call/${id}/edit`
                            )
                        }
                    >
                        <Icons.edit className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                    <Button size="sm">
                        <Icons.file className="h-4 w-4 mr-2" />
                        Générer rapport
                    </Button>
                </div>
            </div>

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
                                label="Vessel"
                                value={
                                    imo
                                        ? `IMO ${imo}`
                                        : `#${portCall.vessel_id}`
                                }
                            />
                            <InfoRow
                                icon={Icons.car}
                                label="Véhicules à débarquer"
                                value={portCall.vehicles_number ?? "-"}
                            />
                            <InfoRow
                                icon={Icons.area}
                                label="Dock"
                                value={portCall.dock_id}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icons.calendar className="h-5 w-5 text-green-600" />{" "}
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

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Icons.calendar className="h-5 w-5 text-red-600" />{" "}
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

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Actions rapides</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" size="sm">
                            <Icons.eye className="h-4 w-4 mr-2" /> Voir les
                            détails
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.file className="h-4 w-4 mr-2" /> Générer
                            rapport
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.calendar className="h-4 w-4 mr-2" />{" "}
                            Planifier
                        </Button>
                        <Button variant="outline" size="sm">
                            <Icons.users className="h-4 w-4 mr-2" /> Équipe
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
