"use client";

import { Icons } from "@/components/icon/icon";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface FollowupPaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}

export const FollowupPagination = ({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: FollowupPaginationProps) => {
    const pageSizeOptions = [10, 25, 50, 100];

    // Calculer les informations de pagination
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        if (totalPages <= maxVisiblePages) {
            // Afficher toutes les pages si il y en a peu
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Logique pour afficher un sous-ensemble intelligent des pages
            if (currentPage <= 4) {
                // Près du début
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Près de la fin
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Au milieu
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageSizeChange = (newPageSize: string) => {
        const newPageSizeNum = parseInt(newPageSize);
        onPageSizeChange(newPageSizeNum);

        // Recalculer la page actuelle pour éviter d'être sur une page inexistante
        const newTotalPages = Math.ceil(totalItems / newPageSizeNum);
        if (currentPage > newTotalPages) {
            onPageChange(newTotalPages);
        }
    };

    if (totalPages <= 1) {
        return (
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
                <div className="text-sm text-muted-foreground">
                    Affichage de {totalItems} dossier
                    {totalItems !== 1 ? "s" : ""}
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Afficher :
                    </span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                        par page
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
            {/* Informations de pagination */}
            <div className="text-sm text-muted-foreground">
                Affichage de {startItem} à {endItem} sur {totalItems} dossier
                {totalItems !== 1 ? "s" : ""}
            </div>

            {/* Contrôles de pagination */}
            <div className="flex items-center space-x-4">
                {/* Sélecteur de taille de page */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                        Afficher :
                    </span>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="w-20">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">
                        par page
                    </span>
                </div>

                <div className="w-px h-6 bg-border" />

                {/* Navigation des pages */}
                <div className="flex items-center space-x-2">
                    {/* Bouton première page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(1)}
                        disabled={!hasPreviousPage}
                        className="h-8 w-8 p-0"
                        title="Première page"
                    >
                        <Icons.doubleArrowLeft className="h-4 w-4" />
                    </Button>

                    {/* Bouton page précédente */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={!hasPreviousPage}
                        className="h-8 w-8 p-0"
                        title="Page précédente"
                    >
                        <Icons.doubleArrowLeft className="h-4 w-4" />
                    </Button>

                    {/* Numéros de page */}
                    <div className="flex items-center space-x-1">
                        {getPageNumbers().map((page, index) => (
                            <div key={index}>
                                {page === "..." ? (
                                    <span className="px-2 py-1 text-sm text-muted-foreground">
                                        ...
                                    </span>
                                ) : (
                                    <Button
                                        variant={
                                            currentPage === page
                                                ? "default"
                                                : "outline"
                                        }
                                        size="sm"
                                        onClick={() =>
                                            onPageChange(page as number)
                                        }
                                        className="h-8 w-8 p-0"
                                    >
                                        {page}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Bouton page suivante */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={!hasNextPage}
                        className="h-8 w-8 p-0"
                        title="Page suivante"
                    >
                        <Icons.doubleArrowRight className="h-4 w-4" />
                    </Button>

                    {/* Bouton dernière page */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(totalPages)}
                        disabled={!hasNextPage}
                        className="h-8 w-8 p-0"
                        title="Dernière page"
                    >
                        <Icons.doubleArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Informations de page */}
                <div className="text-sm text-muted-foreground">
                    Page {currentPage} sur {totalPages}
                </div>
            </div>
        </div>
    );
};
