"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Calendar,
    Clock,
    Filter,
    Search,
    Ship,
    SortAsc,
    SortDesc,
} from "lucide-react";
import { useMemo, useState } from "react";

// Interface TypeScript pour les données de débarquement
interface Discharge {
    discharge_id: number;
    discharge_date: string;
    port_call_id: number;
    created_at: string;
    updated_at: string;
}

// Données de débarquement (à remplacer par un appel API)
const dischargeData: Discharge[] = [
    {
        discharge_id: 9,
        discharge_date: "2025-09-02T14:00:44+00:00",
        port_call_id: 9,
        created_at: "2025-09-01T19:24:25+00:00",
        updated_at: "2025-09-01T19:24:25+00:00",
    },
    {
        discharge_id: 2,
        discharge_date: "2025-09-02T08:31:49+00:00",
        port_call_id: 3,
        created_at: "2025-09-01T19:24:25+00:00",
        updated_at: "2025-09-01T19:24:25+00:00",
    },
];

export default function Discharge() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] =
        useState<keyof Discharge>("discharge_date");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Fonction pour obtenir le statut basé sur la date
    const getStatus = (dischargeDate: string) => {
        const dischargeDateObj = new Date(dischargeDate);
        const now = new Date();
        const diffTime = dischargeDateObj.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "completed";
        if (diffDays === 0) return "today";
        if (diffDays <= 7) return "upcoming";
        return "scheduled";
    };

    // Fonction pour obtenir la couleur du statut
    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "today":
                return "bg-blue-100 text-blue-800";
            case "upcoming":
                return "bg-yellow-100 text-yellow-800";
            case "scheduled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Fonction pour obtenir le texte du statut
    const getStatusText = (status: string) => {
        switch (status) {
            case "completed":
                return "Terminé";
            case "today":
                return "Aujourd'hui";
            case "upcoming":
                return "Prochain";
            case "scheduled":
                return "Programmé";
            default:
                return "Inconnu";
        }
    };

    // Filtrage et tri des données
    const filteredAndSortedData = useMemo(() => {
        let filtered = dischargeData.filter((discharge) => {
            const matchesSearch =
                discharge.discharge_id.toString().includes(searchTerm) ||
                discharge.port_call_id.toString().includes(searchTerm);

            const status = getStatus(discharge.discharge_date);
            const matchesFilter =
                filterStatus === "all" || status === filterStatus;

            return matchesSearch && matchesFilter;
        });

        // Tri
        filtered.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (
                sortField === "discharge_date" ||
                sortField === "created_at" ||
                sortField === "updated_at"
            ) {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (sortDirection === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        return filtered;
    }, [dischargeData, searchTerm, sortField, sortDirection, filterStatus]);

    // Fonction pour changer le tri
    const handleSort = (field: keyof Discharge) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Fonction pour obtenir l'icône de tri
    const getSortIcon = (field: keyof Discharge) => {
        if (sortField !== field) return null;
        return sortDirection === "asc" ? (
            <SortAsc className="w-4 h-4" />
        ) : (
            <SortDesc className="w-4 h-4" />
        );
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Gestion des Débarquements
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Suivi et gestion des opérations de débarquement des
                        véhicules
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                    <Ship className="w-4 h-4 mr-2" />
                    Nouveau Débarquement
                </Button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Débarquements
                        </CardTitle>
                        <Ship className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {dischargeData.length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Aujourd'hui
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                dischargeData.filter(
                                    (d) =>
                                        getStatus(d.discharge_date) === "today"
                                ).length
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Prochains
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                dischargeData.filter(
                                    (d) =>
                                        getStatus(d.discharge_date) ===
                                        "upcoming"
                                ).length
                            }
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Terminés
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {
                                dischargeData.filter(
                                    (d) =>
                                        getStatus(d.discharge_date) ===
                                        "completed"
                                ).length
                            }
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtres et recherche */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtres et Recherche
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Rechercher par ID de débarquement ou port call..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={filterStatus}
                            onValueChange={setFilterStatus}
                        >
                            <SelectTrigger className="w-full sm:w-48">
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Tous les statuts
                                </SelectItem>
                                <SelectItem value="completed">
                                    Terminés
                                </SelectItem>
                                <SelectItem value="today">
                                    Aujourd'hui
                                </SelectItem>
                                <SelectItem value="upcoming">
                                    Prochains
                                </SelectItem>
                                <SelectItem value="scheduled">
                                    Programmés
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des débarquements */}
            <Card>
                <CardHeader>
                    <CardTitle>Liste des Débarquements</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleSort("discharge_id")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            ID Débarquement
                                            {getSortIcon("discharge_id")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleSort("discharge_date")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            Date de Débarquement
                                            {getSortIcon("discharge_date")}
                                        </div>
                                    </TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() =>
                                            handleSort("port_call_id")
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            ID Port Call
                                            {getSortIcon("port_call_id")}
                                        </div>
                                    </TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead
                                        className="cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleSort("created_at")}
                                    >
                                        <div className="flex items-center gap-2">
                                            Créé le
                                            {getSortIcon("created_at")}
                                        </div>
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAndSortedData.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center py-8 text-gray-500"
                                        >
                                            Aucun débarquement trouvé
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredAndSortedData.map((discharge) => {
                                        const status = getStatus(
                                            discharge.discharge_date
                                        );
                                        return (
                                            <TableRow
                                                key={discharge.discharge_id}
                                                className="hover:bg-gray-50"
                                            >
                                                <TableCell className="font-medium">
                                                    #{discharge.discharge_id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        {formatDate(
                                                            discharge.discharge_date
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Ship className="w-4 h-4 text-gray-500" />
                                                        #
                                                        {discharge.port_call_id}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={getStatusColor(
                                                            status
                                                        )}
                                                    >
                                                        {getStatusText(status)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(
                                                            discharge.created_at
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Voir
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            Modifier
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
