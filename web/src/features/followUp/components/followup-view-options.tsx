"use client";

import { Icons } from "@/components/icon/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface FollowupViewOptionsProps {
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    onViewModeChange: (viewMode: "grid" | "list" | "table") => void;
    onPageSizeChange: (pageSize: number) => void;
    currentSort: { field: string; order: "asc" | "desc" };
    currentViewMode: "grid" | "list" | "table";
    currentPageSize: number;
}

export const FollowupViewOptions = ({
    onSortChange,
    onViewModeChange,
    onPageSizeChange,
    currentSort,
    currentViewMode,
    currentPageSize,
}: FollowupViewOptionsProps) => {
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

    const sortOptions = [
        { value: "created_at", label: "Date de création" },
        { value: "updated_at", label: "Dernière mise à jour" },
        { value: "reference_number", label: "Numéro de référence" },
        { value: "status", label: "Statut" },
        { value: "priority", label: "Priorité" },
        { value: "estimated_completion_date", label: "Date d'échéance" },
        { value: "assigned_inspector", label: "Inspecteur assigné" },
    ];

    const viewModes = [
        { value: "grid", label: "Grille", icon: Icons.grid },
        { value: "list", label: "Liste", icon: Icons.list },
        { value: "table", label: "Tableau", icon: Icons.table },
    ];

    const pageSizeOptions = [10, 25, 50, 100];

    const getSortIcon = (field: string) => {
        if (currentSort.field !== field) return Icons.arrowUpDown;
        return currentSort.order === "asc" ? Icons.arrowUp : Icons.arrowDown;
    };

    const toggleSort = (field: string) => {
        const newOrder =
            currentSort.field === field && currentSort.order === "asc"
                ? "desc"
                : "asc";
        onSortChange(field, newOrder);
    };

    return (
        <div className="space-y-4 p-4 bg-white border rounded-lg shadow-sm">
            {/* Options principales */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Mode d'affichage */}
                    <div className="flex items-center space-x-1">
                        {viewModes.map((mode) => (
                            <Button
                                key={mode.value}
                                variant={
                                    currentViewMode === mode.value
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                    onViewModeChange(
                                        mode.value as "grid" | "list" | "table"
                                    )
                                }
                                className="h-8 w-8 p-0"
                                title={mode.label}
                            >
                                <mode.icon className="h-4 w-4" />
                            </Button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-border" />

                    {/* Tri principal */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                            Trier par :
                        </span>
                        <Select
                            value={currentSort.field}
                            onValueChange={(value) =>
                                onSortChange(value, currentSort.order)
                            }
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span>{option.label}</span>
                                            {currentSort.field ===
                                                option.value && (
                                                <Badge
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {currentSort.order === "asc"
                                                        ? "↑"
                                                        : "↓"}
                                                </Badge>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSort(currentSort.field)}
                            className="h-8 w-8 p-0"
                            title={`Trier ${
                                currentSort.order === "asc"
                                    ? "décroissant"
                                    : "croissant"
                            }`}
                        >
                            <Icons.arrowUpDown className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    {/* Taille de page */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                            Afficher :
                        </span>
                        <Select
                            value={currentPageSize.toString()}
                            onValueChange={(value) =>
                                onPageSizeChange(parseInt(value))
                            }
                        >
                            <SelectTrigger className="w-20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {pageSizeOptions.map((size) => (
                                    <SelectItem
                                        key={size}
                                        value={size.toString()}
                                    >
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">
                            par page
                        </span>
                    </div>

                    {/* Bouton options avancées */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setShowAdvancedOptions(!showAdvancedOptions)
                        }
                        className="flex items-center space-x-2"
                    >
                        <Icons.setting className="h-4 w-4" />
                        <span>Options</span>
                    </Button>
                </div>
            </div>

            {/* Options avancées */}
            {showAdvancedOptions && (
                <div className="space-y-4 pt-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tri personnalisé */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Tri secondaire
                            </label>
                            <Select
                                value={currentSort.field}
                                onValueChange={(value) =>
                                    onSortChange(value, currentSort.order)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un champ" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sortOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ordre de tri */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Ordre de tri
                            </label>
                            <div className="flex space-x-2">
                                <Button
                                    variant={
                                        currentSort.order === "asc"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        onSortChange(currentSort.field, "asc")
                                    }
                                    className="flex-1"
                                >
                                    <Icons.arrowUp className="h-4 w-4 mr-2" />
                                    Croissant
                                </Button>
                                <Button
                                    variant={
                                        currentSort.order === "desc"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() =>
                                        onSortChange(currentSort.field, "desc")
                                    }
                                    className="flex-1"
                                >
                                    <Icons.arrowDown className="h-4 w-4 mr-2" />
                                    Décroissant
                                </Button>
                            </div>
                        </div>

                        {/* Informations de tri */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-muted-foreground">
                                Tri actuel
                            </label>
                            <div className="p-2 bg-muted rounded text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="text-muted-foreground">
                                        Champ :
                                    </span>
                                    <Badge variant="outline">
                                        {
                                            sortOptions.find(
                                                (opt) =>
                                                    opt.value ===
                                                    currentSort.field
                                            )?.label
                                        }
                                    </Badge>
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-muted-foreground">
                                        Ordre :
                                    </span>
                                    <Badge variant="outline">
                                        {currentSort.order === "asc"
                                            ? "Croissant ↑"
                                            : "Décroissant ↓"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Raccourcis de tri rapide */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Tri rapide
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onSortChange("created_at", "desc")
                                }
                                className="text-xs"
                            >
                                Plus récents
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSortChange("priority", "desc")}
                                className="text-xs"
                            >
                                Priorité élevée
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onSortChange("status", "asc")}
                                className="text-xs"
                            >
                                Par statut
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    onSortChange(
                                        "estimated_completion_date",
                                        "asc"
                                    )
                                }
                                className="text-xs"
                            >
                                Échéance proche
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
