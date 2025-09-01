import type { SidebarItem } from "../types/sidebar-data-type";

export const sidebarItems: SidebarItem[] = [
    {
        title: "Tableau de Bord",
        url: "/dashboard",
        icon: "overview",
    },
    {
        title: "Dossiers de Suivi",
        url: "/dashboard/followup",
        icon: "folder",
        item: [
            {
                title: "Import Manifest",
                url: "/dashboard/followup/import",
            },
            {
                title: "Dossiers des vehicules",
                url: "/dashboard/followup/files",
            },
            {
                title: "Liste des vehicules",
                url: "/dashboard/followup/vehicles",
            },
        ],
    },
    {
        title: "Operations",
        url: "/dashboard/operation",
        icon: "manifest",
        item: [
            {
                title: "Escale",
                url: "/dashboard/operation/port-call",
            },
            {
                title: "Debarquement",
                url: "/dashboard/operation/discharge",
            },
        ],
    },
    {
        title: "Gestion Portuaire",
        url: "/dashboard/port",
        icon: "dock",
        item: [
            {
                title: "Liste des Parkings",
                url: "/dashboard/port/parkings",
            },
            {
                title: "Liste des Quais",
                url: "/dashboard/port/wharves",
            },
            {
                title: "Liste des Navires",
                url: "/dashboard/port/vessels",
            },
        ],
    },
    {
        title: "Utilisateurs",
        url: "/dashboard/users",
        icon: "users",
    },
    {
        title: "Settings",
        url: "/dashboard/settings",
        icon: "setting",
    },
];
