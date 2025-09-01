"use client";

import { Icons } from "@/components/icons/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMemo } from "react";

interface FollowupViewOptionsProps {
    onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
    onViewModeChange: (viewMode: "grid" | "list" | "table") => void;
    currentSort: { field: string; order: "asc" | "desc" };
    currentViewMode: "grid" | "list" | "table";
}

export const FollowupViewOptions = ({
    onSortChange,
    onViewModeChange,
    currentSort,
    currentViewMode,
}: FollowupViewOptionsProps) => {
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

    const SortOrderIcon = useMemo(
        () => (currentSort.order === "asc" ? Icons.arrowUp : Icons.arrowDown),
        [currentSort.order]
    );

    return (
        <div className="space-y-4 rounded-xl border bg-gradient-to-br from-white to-muted/30 p-4 shadow-sm">
            {/* Options principales */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Mode d'affichage */}
                    <div className="flex items-center gap-1">
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

                    <div className="h-6 w-px bg-border" />

                    {/* Tri principal */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Trier par :
                        </span>
                        <Select
                            value={currentSort.field}
                            onValueChange={(value) =>
                                onSortChange(value, currentSort.order)
                            }
                        >
                            <SelectTrigger className="h-9 w-56">
                                <SelectValue placeholder="Champ de tri" />
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
                            <SortOrderIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                {/* Right-side cleared as requested (no page-size, no extra Options button) */}
                <div className="flex items-center gap-2" />
            </div>
                {/* Tri rapide */}
                <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSortChange("created_at", "desc")}
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
                            onSortChange("estimated_completion_date", "asc")
                        }
                        className="text-xs"
                    >
                        Échéance proche
                    </Button>
                </div>
        </div>
    );
};
