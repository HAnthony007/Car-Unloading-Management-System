"use client";

import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { FollowupFile } from "../data/schema";

interface FollowupToolbarProps {
    data: FollowupFile[];
    onFilterChange: (filteredData: FollowupFile[]) => void;
}

interface FilterState {
    search: string;
    status: string;
    priority: string;
    assignedInspector: string;
    dateRange: string;
}

export const FollowupToolbar = ({
    data,
    onFilterChange,
}: FollowupToolbarProps) => {
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        status: "all",
        priority: "all",
        assignedInspector: "all",
        dateRange: "all",
    });

    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Statistiques des filtres actifs
    const activeFiltersCount = Object.values(filters).filter(
        (value) => value !== "all" && value !== ""
    ).length;

    // Données filtrées
    const filteredData = useMemo(() => {
        let result = [...data];

        // Recherche textuelle
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter(
                (file) =>
                    file.reference_number.toLowerCase().includes(searchLower) ||
                    file.vehicle_id.toLowerCase().includes(searchLower) ||
                    file.port_call_id.toLowerCase().includes(searchLower) ||
                    file.vehicle_info?.brand
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    file.vehicle_info?.model
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    file.assigned_inspector
                        ?.toLowerCase()
                        .includes(searchLower) ||
                    file.notes?.toLowerCase().includes(searchLower)
            );
        }

        // Filtre par statut
        if (filters.status !== "all") {
            result = result.filter((file) => file.status === filters.status);
        }

        // Filtre par priorité
        if (filters.priority !== "all") {
            result = result.filter(
                (file) => file.priority === filters.priority
            );
        }

        // Filtre par inspecteur assigné
        if (filters.assignedInspector !== "all") {
            result = result.filter(
                (file) => file.assigned_inspector === filters.assignedInspector
            );
        }

        // Filtre par date
        if (filters.dateRange !== "all") {
            const now = new Date();
            const today = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate()
            );

            switch (filters.dateRange) {
                case "today":
                    result = result.filter((file) => {
                        const fileDate = new Date(file.created_at);
                        return fileDate >= today;
                    });
                    break;
                case "week":
                    const weekAgo = new Date(
                        today.getTime() - 7 * 24 * 60 * 60 * 1000
                    );
                    result = result.filter((file) => {
                        const fileDate = new Date(file.created_at);
                        return fileDate >= weekAgo;
                    });
                    break;
                case "month":
                    const monthAgo = new Date(
                        today.getTime() - 30 * 24 * 60 * 60 * 1000
                    );
                    result = result.filter((file) => {
                        const fileDate = new Date(file.created_at);
                        return fileDate >= monthAgo;
                    });
                    break;
                case "overdue":
                    result = result.filter((file) => {
                        if (!file.estimated_completion_date) return false;
                        const estimatedDate = new Date(
                            file.estimated_completion_date
                        );
                        return estimatedDate < today && file.status !== "Fermé";
                    });
                    break;
            }
        }

        return result;
    }, [data, filters]);

    // Appliquer les filtres
    useMemo(() => {
        onFilterChange(filteredData);
    }, [filteredData, onFilterChange]);

    // Réinitialiser tous les filtres
    const resetFilters = () => {
        setFilters({
            search: "",
            status: "all",
            priority: "all",
            assignedInspector: "all",
            dateRange: "all",
        });
    };

    // Obtenir les valeurs uniques pour les filtres
    const uniqueInspectors = useMemo(() => {
        const inspectors = data
            .map((file) => file.assigned_inspector)
            .filter((inspector) => inspector && inspector.trim() !== "");
        return [...new Set(inspectors)];
    }, [data]);

    return (
        <div className="space-y-4 p-4 bg-white border rounded-lg shadow-sm">
            {/* Barre de recherche principale */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                    <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher par référence, véhicule, inspecteur..."
                        value={filters.search}
                        onChange={(e) =>
                            setFilters((prev) => ({
                                ...prev,
                                search: e.target.value,
                            }))
                        }
                        className="pl-10"
                    />
                </div>

                <Button
                    variant="outline"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="flex items-center space-x-2"
                >
                    <Icons.filter className="h-4 w-4" />
                    <span>Filtres</span>
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>

                {activeFiltersCount > 0 && (
                    <Button
                        variant="ghost"
                        onClick={resetFilters}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Icons.x className="h-4 w-4 mr-2" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            {/* Filtres avancés */}
            {showAdvancedFilters && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Filtre par statut */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Statut
                            </label>
                            <Select
                                value={filters.status}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tous les statuts" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les statuts
                                    </SelectItem>
                                    <SelectItem value="Ouvert">
                                        Ouvert
                                    </SelectItem>
                                    <SelectItem value="En attente">
                                        En attente
                                    </SelectItem>
                                    <SelectItem value="Fermé">Fermé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtre par priorité */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Priorité
                            </label>
                            <Select
                                value={filters.priority}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        priority: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Toutes les priorités" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les priorités
                                    </SelectItem>
                                    <SelectItem value="Faible">
                                        Faible
                                    </SelectItem>
                                    <SelectItem value="Moyenne">
                                        Moyenne
                                    </SelectItem>
                                    <SelectItem value="Élevée">
                                        Élevée
                                    </SelectItem>
                                    <SelectItem value="Urgente">
                                        Urgente
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtre par inspecteur */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Inspecteur
                            </label>
                            <Select
                                value={filters.assignedInspector}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        assignedInspector: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Tous les inspecteurs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les inspecteurs
                                    </SelectItem>
                                    {uniqueInspectors.map((inspector) => (
                                        <SelectItem
                                            key={inspector}
                                            value={inspector}
                                        >
                                            {inspector}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtre par date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Période
                            </label>
                            <Select
                                value={filters.dateRange}
                                onValueChange={(value) =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        dateRange: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Toutes les périodes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Toutes les périodes
                                    </SelectItem>
                                    <SelectItem value="today">
                                        Aujourd&apos;hui
                                    </SelectItem>
                                    <SelectItem value="week">
                                        Cette semaine
                                    </SelectItem>
                                    <SelectItem value="month">
                                        Ce mois
                                    </SelectItem>
                                    <SelectItem value="overdue">
                                        En retard
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Résumé des filtres actifs */}
                    {activeFiltersCount > 0 && (
                        <div className="flex items-center space-x-2 pt-2">
                            <span className="text-sm text-muted-foreground">
                                Filtres actifs :
                            </span>
                            {filters.search && (
                                <Badge variant="outline" className="text-xs">
                                    Recherche: &quot;{filters.search}&quot;
                                </Badge>
                            )}
                            {filters.status !== "all" && (
                                <Badge variant="outline" className="text-xs">
                                    Statut: {filters.status}
                                </Badge>
                            )}
                            {filters.priority !== "all" && (
                                <Badge variant="outline" className="text-xs">
                                    Priorité: {filters.priority}
                                </Badge>
                            )}
                            {filters.assignedInspector !== "all" && (
                                <Badge variant="outline" className="text-xs">
                                    Inspecteur: {filters.assignedInspector}
                                </Badge>
                            )}
                            {filters.dateRange !== "all" && (
                                <Badge variant="outline" className="text-xs">
                                    Période:{" "}
                                    {filters.dateRange === "today"
                                        ? "Aujourd'hui"
                                        : filters.dateRange === "week"
                                        ? "Cette semaine"
                                        : filters.dateRange === "month"
                                        ? "Ce mois"
                                        : "En retard"}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Statistiques des résultats */}
            <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                    {filteredData.length} dossier
                    {filteredData.length !== 1 ? "s" : ""} trouvé
                    {filteredData.length !== 1 ? "s" : ""}
                    {filteredData.length !== data.length &&
                        ` sur ${data.length} total`}
                </div>

                {filteredData.length !== data.length && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetFilters}
                        className="text-xs"
                    >
                        Voir tous les dossiers
                    </Button>
                )}
            </div>
        </div>
    );
};
