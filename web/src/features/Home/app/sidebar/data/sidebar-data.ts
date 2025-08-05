import type { SidebarItem } from "../types/sidebar-data-type";

export const sidebarItems: SidebarItem[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: "overview",
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: "users",
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
