import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Package,
    TrendingUp,
    XCircle
} from "lucide-react";

import { ImportStats } from "../types/manifest";

interface ManifestImportStatsProps {
    stats: ImportStats;
    showProgress?: boolean;
}

export function ManifestImportStats({
    stats,
    showProgress = true,
}: ManifestImportStatsProps) {
    const getStatusIcon = () => {
        switch (stats.status) {
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "processing":
                return <TrendingUp className="h-5 w-5 text-blue-500" />;
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "failed":
                return <XCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusText = () => {
        switch (stats.status) {
            case "pending":
                return "En attente";
            case "processing":
                return "En cours de traitement";
            case "completed":
                return "Terminé avec succès";
            case "failed":
                return "Échec de l'import";
            default:
                return "Inconnu";
        }
    };

    const getStatusColor = () => {
        switch (stats.status) {
            case "pending":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "processing":
                return "text-blue-600 bg-blue-50 border-blue-200";
            case "completed":
                return "text-green-600 bg-green-50 border-green-200";
            case "failed":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const progressPercentage =
        stats.totalRecords > 0
            ? (stats.processedRecords / stats.totalRecords) * 100
            : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Statut général */}
            <Card className="md:col-span-2 lg:col-span-4">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {getStatusIcon()}
                            <CardTitle className="text-lg">
                                Statut de l'import
                            </CardTitle>
                        </div>
                        <Badge className={getStatusColor()}>
                            {getStatusText()}
                        </Badge>
                    </div>
                    <CardDescription>
                        Progression de l'import du manifest Excel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {showProgress && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Progression</span>
                                <span>
                                    {stats.processedRecords} /{" "}
                                    {stats.totalRecords}
                                </span>
                            </div>
                            <Progress
                                value={progressPercentage}
                                className="h-2"
                            />
                            <div className="text-xs text-muted-foreground text-center">
                                {stats.processingTime > 0 &&
                                    `${stats.processingTime}s écoulées`}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Statistiques détaillées */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total des enregistrements
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.totalRecords}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Lignes dans le fichier Excel
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Traités avec succès
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {stats.successCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.totalRecords > 0
                            ? `${(
                                  (stats.successCount / stats.totalRecords) *
                                  100
                              ).toFixed(1)}%`
                            : "0%"}{" "}
                        de réussite
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Erreurs détectées
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        {stats.errorCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.totalRecords > 0
                            ? `${(
                                  (stats.errorCount / stats.totalRecords) *
                                  100
                              ).toFixed(1)}%`
                            : "0%"}{" "}
                        d'erreurs
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Avertissements
                    </CardTitle>
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">
                        {stats.warningCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.totalRecords > 0
                            ? `${(
                                  (stats.warningCount / stats.totalRecords) *
                                  100
                              ).toFixed(1)}%`
                            : "0%"}{" "}
                        d'avertissements
                    </p>
                </CardContent>
            </Card>

            {/* Répartition par type */}
            {/* <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg">
                        Répartition par type de données
                    </CardTitle>
                    <CardDescription>
                        Aperçu des différents types d'informations importées
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Ship className="h-8 w-8 text-blue-600" />
                            <div>
                                <div className="font-semibold text-blue-900">
                                    Navires
                                </div>
                                <div className="text-sm text-blue-700">
                                    {Math.ceil(stats.totalRecords * 0.3)}{" "}
                                    uniques
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                            <Truck className="h-8 w-8 text-green-600" />
                            <div>
                                <div className="font-semibold text-green-900">
                                    Véhicules
                                </div>
                                <div className="text-sm text-green-700">
                                    {Math.ceil(stats.totalRecords * 0.8)}{" "}
                                    uniques
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                            <User className="h-8 w-8 text-purple-600" />
                            <div>
                                <div className="font-semibold text-purple-900">
                                    Chauffeurs
                                </div>
                                <div className="text-sm text-purple-700">
                                    {Math.ceil(stats.totalRecords * 0.6)}{" "}
                                    uniques
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <Calendar className="h-8 w-8 text-orange-600" />
                            <div>
                                <div className="font-semibold text-orange-900">
                                    Périodes
                                </div>
                                <div className="text-sm text-orange-700">
                                    {Math.ceil(stats.totalRecords * 0.4)} plages
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    );
}
