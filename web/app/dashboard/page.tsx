"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLogout, useMe } from "@/features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Types pour les données du tableau de bord
interface Vessel {
    id: string;
    name: string;
    status: "en_cours" | "termine" | "en_retard";
    arrivalDate: string;
    departureDate?: string;
    vehicleCount: number;
    inspectionStatus: "en_attente" | "en_cours" | "termine";
    documentsStatus: "incomplet" | "complet";
}

interface Alert {
    id: string;
    type: "warning" | "error" | "info";
    title: string;
    description: string;
    timestamp: string;
    priority: "low" | "medium" | "high";
}

interface DashboardStats {
    totalVessels: number;
    activeVessels: number;
    totalVehicles: number;
    pendingInspections: number;
    incompleteDocuments: number;
    criticalAlerts: number;
}

export default function DashboardPage() {
    const { data: user } = useMe();
    const { mutate: logout } = useLogout();
    const router = useRouter();

    // États pour les données du tableau de bord
    const [stats, setStats] = useState<DashboardStats>({
        totalVessels: 0,
        activeVessels: 0,
        totalVehicles: 0,
        pendingInspections: 0,
        incompleteDocuments: 0,
        criticalAlerts: 0,
    });

    const [vessels, setVessels] = useState<Vessel[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Données simulées pour la démonstration
    useEffect(() => {
        const mockVessels: Vessel[] = [
            {
                id: "1",
                name: "MSC OSCAR",
                status: "en_cours",
                arrivalDate: "2024-01-15",
                vehicleCount: 1250,
                inspectionStatus: "en_cours",
                documentsStatus: "complet",
            },
            {
                id: "2",
                name: "EVER GIVEN",
                status: "en_cours",
                arrivalDate: "2024-01-14",
                vehicleCount: 890,
                inspectionStatus: "en_attente",
                documentsStatus: "incomplet",
            },
            {
                id: "3",
                name: "CMA CGM MARCO POLO",
                status: "en_retard",
                arrivalDate: "2024-01-12",
                vehicleCount: 2100,
                inspectionStatus: "en_attente",
                documentsStatus: "incomplet",
            },
            {
                id: "4",
                name: "MAERSK SEVILLE",
                status: "termine",
                arrivalDate: "2024-01-10",
                departureDate: "2024-01-13",
                vehicleCount: 1560,
                inspectionStatus: "termine",
                documentsStatus: "complet",
            },
        ];

        const mockAlerts: Alert[] = [
            {
                id: "1",
                type: "error",
                title: "Navire en retard critique",
                description:
                    "MSC OSCAR a dépassé la durée d'escale autorisée de 48h",
                timestamp: "2024-01-15 14:30",
                priority: "high",
            },
            {
                id: "2",
                type: "warning",
                title: "Documents incomplets",
                description: "EVER GIVEN - Manifeste des véhicules incomplet",
                timestamp: "2024-01-15 12:15",
                priority: "medium",
            },
            {
                id: "3",
                type: "info",
                title: "Nouvelle inspection programmée",
                description: "CMA CGM MARCO POLO - Inspection prévue à 16:00",
                timestamp: "2024-01-15 10:00",
                priority: "low",
            },
        ];

        setVessels(mockVessels);
        setAlerts(mockAlerts);

        // Calcul des statistiques
        setStats({
            totalVessels: mockVessels.length,
            activeVessels: mockVessels.filter((v) => v.status === "en_cours")
                .length,
            totalVehicles: mockVessels.reduce(
                (sum, v) => sum + v.vehicleCount,
                0
            ),
            pendingInspections: mockVessels.filter(
                (v) => v.inspectionStatus === "en_attente"
            ).length,
            incompleteDocuments: mockVessels.filter(
                (v) => v.documentsStatus === "incomplet"
            ).length,
            criticalAlerts: mockAlerts.filter((a) => a.priority === "high")
                .length,
        });
    }, []);

    const handleLogout = () => {
        logout(undefined, {
            onSuccess: () => {
                toast.success("Déconnexion réussie !");
                router.replace("/login");
            },
            onError: (error) => {
                toast.error((error as Error).message);
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "en_cours":
                return "bg-green-100 text-green-800";
            case "termine":
                return "bg-blue-100 text-blue-800";
            case "en_retard":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-blue-500";
            default:
                return "bg-gray-500";
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case "error":
                return "🚨";
            case "warning":
                return "⚠️";
            case "info":
                return "ℹ️";
            default:
                return "📢";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Tableau de Bord - Débarquement Véhicules
                            </h1>
                            <p className="text-gray-600">
                                Bienvenue, {user?.name || "Utilisateur"}
                            </p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Navires Actifs
                            </CardTitle>
                            <span className="text-2xl">🚢</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.activeVessels}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                sur {stats.totalVessels} navires
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Véhicules
                            </CardTitle>
                            <span className="text-2xl">🚗</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.totalVehicles.toLocaleString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                véhicules en cours de débarquement
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inspections en Attente
                            </CardTitle>
                            <span className="text-2xl">🔍</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.pendingInspections}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                inspections à effectuer
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Alertes Critiques
                            </CardTitle>
                            <span className="text-2xl">🚨</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.criticalAlerts}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                nécessitent une attention immédiate
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Vue globale des navires */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-xl">
                                        🚢 Vue Globale des Navires
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    État actuel de tous les navires et leur
                                    progression
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {vessels.map((vessel) => (
                                        <div
                                            key={vessel.id}
                                            className="border rounded-lg p-4 hover:bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {vessel.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge
                                                            className={getStatusColor(
                                                                vessel.status
                                                            )}
                                                        >
                                                            {vessel.status ===
                                                                "en_cours" &&
                                                                "En cours"}
                                                            {vessel.status ===
                                                                "termine" &&
                                                                "Terminé"}
                                                            {vessel.status ===
                                                                "en_retard" &&
                                                                "En retard"}
                                                        </Badge>
                                                        <span className="text-sm text-gray-600">
                                                            {vessel.vehicleCount.toLocaleString()}{" "}
                                                            véhicules
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-600">
                                                        Arrivée:{" "}
                                                        {new Date(
                                                            vessel.arrivalDate
                                                        ).toLocaleDateString(
                                                            "fr-FR"
                                                        )}
                                                    </div>
                                                    {vessel.departureDate && (
                                                        <div className="text-sm text-gray-600">
                                                            Départ:{" "}
                                                            {new Date(
                                                                vessel.departureDate
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium">
                                                            Inspection
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                vessel.inspectionStatus ===
                                                                "termine"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {vessel.inspectionStatus ===
                                                                "en_attente" &&
                                                                "En attente"}
                                                            {vessel.inspectionStatus ===
                                                                "en_cours" &&
                                                                "En cours"}
                                                            {vessel.inspectionStatus ===
                                                                "termine" &&
                                                                "Terminé"}
                                                        </Badge>
                                                    </div>
                                                    <Progress
                                                        value={
                                                            vessel.inspectionStatus ===
                                                            "termine"
                                                                ? 100
                                                                : vessel.inspectionStatus ===
                                                                  "en_cours"
                                                                ? 50
                                                                : 0
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>

                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-sm font-medium">
                                                            Documents
                                                        </span>
                                                        <Badge
                                                            variant={
                                                                vessel.documentsStatus ===
                                                                "complet"
                                                                    ? "default"
                                                                    : "destructive"
                                                            }
                                                        >
                                                            {vessel.documentsStatus ===
                                                            "complet"
                                                                ? "Complet"
                                                                : "Incomplet"}
                                                        </Badge>
                                                    </div>
                                                    <Progress
                                                        value={
                                                            vessel.documentsStatus ===
                                                            "complet"
                                                                ? 100
                                                                : 30
                                                        }
                                                        className="h-2"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Alertes et notifications */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-xl">
                                        🚨 Alertes & Notifications
                                    </span>
                                </CardTitle>
                                <CardDescription>
                                    Suivi des alertes et événements critiques
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {alerts.map((alert) => (
                                        <Alert
                                            key={alert.id}
                                            className="border-l-4 border-l-red-500"
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className="text-xl">
                                                    {getAlertIcon(alert.type)}
                                                </span>
                                                <div className="flex-1">
                                                    <AlertTitle className="text-sm font-semibold">
                                                        {alert.title}
                                                    </AlertTitle>
                                                    <AlertDescription className="text-xs text-gray-600 mt-1">
                                                        {alert.description}
                                                    </AlertDescription>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {alert.timestamp}
                                                        </span>
                                                        <div
                                                            className={`w-3 h-3 rounded-full ${getPriorityColor(
                                                                alert.priority
                                                            )}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </Alert>
                                    ))}

                                    {alerts.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <span className="text-4xl">✅</span>
                                            <p className="mt-2 text-sm">
                                                Aucune alerte active
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions rapides */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Actions Rapides
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📋 Nouvelle Inspection
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📄 Vérifier Documents
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        🚗 Suivi Véhicules
                                    </Button>
                                    <Button
                                        className="w-full justify-start"
                                        variant="outline"
                                    >
                                        📊 Rapports
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Progression globale */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>📊 Progression Globale du Port</CardTitle>
                        <CardDescription>
                            Vue d'ensemble de l'efficacité des opérations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Navires traités
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {
                                            vessels.filter(
                                                (v) => v.status === "termine"
                                            ).length
                                        }
                                        /{vessels.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (vessels.filter(
                                            (v) => v.status === "termine"
                                        ).length /
                                            vessels.length) *
                                        100
                                    }
                                    className="h-3"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Inspections terminées
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {
                                            vessels.filter(
                                                (v) =>
                                                    v.inspectionStatus ===
                                                    "termine"
                                            ).length
                                        }
                                        /{vessels.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (vessels.filter(
                                            (v) =>
                                                v.inspectionStatus === "termine"
                                        ).length /
                                            vessels.length) *
                                        100
                                    }
                                    className="h-3"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        Documents complets
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        {
                                            vessels.filter(
                                                (v) =>
                                                    v.documentsStatus ===
                                                    "complet"
                                            ).length
                                        }
                                        /{vessels.length}
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        (vessels.filter(
                                            (v) =>
                                                v.documentsStatus === "complet"
                                        ).length /
                                            vessels.length) *
                                        100
                                    }
                                    className="h-3"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
