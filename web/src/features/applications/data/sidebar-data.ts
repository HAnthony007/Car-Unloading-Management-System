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
        url: "/dashboard/followup/vehicules",
      },
    ]
  },
  {
    title: "Operations",
    url: "/dashboard/operations",
    icon: "manifest",
    item: [
      {
        title: "Escale",
        url: "/dashboard/operations/escale",
      },
      {
        title: "Debarquement",
        url: "/dashboard/operations/debarquement",
      },
    ]
  },
  {
    title: "Gestion Portuaire",
    url: "/dashboard/port",
    icon: "users",
    item: [
      {
        title: "Liste des Navires",
        url: "/dashboard/port/ships",
      },
      {
        title: "Liste des Quais",
        url: "/dashboard/port/wharves",
      },
    ]
  },
  {
    title: "Vehicles",
    url: "/dashboard/vehicles",
    icon: "vehicle",
  },
  {
    title: "Parkings",
    url: "/dashboard/parkings",
    icon: "area",
  },
  {
    title: "Docks",
    url: "/dashboard/docks",
    icon: "dock",
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: "setting",
  },
];
