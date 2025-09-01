"use client";

import { useEffect, useMemo, useState } from "react";
import { FollowupAddButtons } from "./components/followup-add-buttons";
import { FollowupDataTable } from "./components/followup-data-table";
import { FollowupDialogs } from "./components/followup-dialogs";
import { FollowupListView } from "./components/followup-list-view";
import { FollowupPagination } from "./components/followup-pagination";
import { FollowupToolbar } from "./components/followup-toolbar";
import { FollowupViewOptions } from "./components/followup-view-options";
import { FollowupFile } from "./data/schema";

type Props = {
    initialData: FollowupFile[];
};

export default function FollowupFilesClient({ initialData }: Props) {
    const [data, setData] = useState<FollowupFile[]>(initialData);
    const [filteredData, setFilteredData] = useState<FollowupFile[]>(initialData);
    const [loading] = useState(false);

    // État pour le tri
    const [sortConfig, setSortConfig] = useState({
        field: "created_at",
        order: "desc" as "asc" | "desc",
    });

    // État pour l'affichage
    const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

    // État pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);

    // Si les données initiales changent (navigation, revalidation), synchroniser l'état
    useEffect(() => {
        setData(initialData);
        setFilteredData(initialData);
    }, [initialData]);

    // Fonction de tri
    const sortData = (dataToSort: FollowupFile[]) => {
        return [...dataToSort].sort((a, b) => {
            let aValue: string | number | Date = a[
                sortConfig.field as keyof FollowupFile
            ] as string | number | Date;
            let bValue: string | number | Date = b[
                sortConfig.field as keyof FollowupFile
            ] as string | number | Date;

            if (aValue === null || aValue === undefined) aValue = "";
            if (bValue === null || bValue === undefined) bValue = "";

            if (
                sortConfig.field === "created_at" ||
                sortConfig.field === "updated_at" ||
                sortConfig.field === "estimated_completion_date"
            ) {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (typeof aValue === "string" && typeof bValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            const aNum = typeof aValue === "string" ? aValue.charCodeAt(0) : aValue;
            const bNum = typeof bValue === "string" ? bValue.charCodeAt(0) : bValue;

            if (sortConfig.order === "asc") {
                return aNum < bNum ? -1 : aNum > bNum ? 1 : 0;
            } else {
                return aNum > bNum ? -1 : aNum < bNum ? 1 : 0;
            }
        });
    };

    // Données triées
    const sortedData = useMemo(() => {
        return sortData(filteredData);
    }, [filteredData, sortConfig]);

    // Données paginées
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize]);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(sortedData.length / pageSize);

    // Réinitialiser la page courante si elle dépasse le nombre total de pages
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Gestionnaires d'événements
    const handleFilterChange = (newFilteredData: FollowupFile[]) => {
        setFilteredData(newFilteredData);
        setCurrentPage(1);
    };

    const handleSortChange = (field: string, order: "asc" | "desc") => {
        setSortConfig({ field, order });
        setCurrentPage(1);
    };

    const handleViewModeChange = (mode: "grid" | "list" | "table") => {
        setViewMode(mode);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* En-tête avec statistiques */}
            <div className="mb-6 flex flex-wrap items-center justify-between space-y-2">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Gestion des Dossiers de Suivi
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Centralisez et suivez tous les véhicules débarqués au
                        port
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span>
                                Ouvert:{" "}
                                {data.filter((f) => f.status === "Ouvert").length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            <span>
                                En attente:{" "}
                                {data.filter((f) => f.status === "En attente").length}
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span>
                                Fermé:{" "}
                                {data.filter((f) => f.status === "Fermé").length}
                            </span>
                        </div>
                    </div>
                </div>
                <FollowupAddButtons />
            </div>

            {/* Barre d'outils avec filtres et recherche */}
            <FollowupToolbar data={data} onFilterChange={handleFilterChange} />

            {/* Options d'affichage et de tri */}
            <FollowupViewOptions
                onSortChange={handleSortChange}
                onViewModeChange={handleViewModeChange}
                currentSort={sortConfig}
                currentViewMode={viewMode}
            />

            {/* Contenu principal */}
            <div className="space-y-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Chargement des dossiers...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Message si aucun résultat */}
                        {filteredData.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucun dossier trouvé</h3>
                                <p className="text-muted-foreground">Essayez de modifier vos critères de recherche ou de filtrage.</p>
                            </div>
                        ) : (
                            <>
                                {/* Affichage selon le mode */}
                                {viewMode === "list" ? (
                                    <FollowupListView data={paginatedData} />
                                ) : (
                                    <FollowupDataTable data={paginatedData} />
                                )}

                                {/* Pagination */}
                                <FollowupPagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={sortedData.length}
                                    pageSize={pageSize}
                                    onPageChange={handlePageChange}
                                    onPageSizeChange={handlePageSizeChange}
                                />
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Dialogues */}
            <FollowupDialogs />
        </div>
    );
}
