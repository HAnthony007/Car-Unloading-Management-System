import type { SidebarItem } from "../types/sidebar-data-type";

export const sidebarItems: SidebarItem[] = [
    {
        title: "Home",
        url: "/dashboard",
        icon: "overview",
    },
    {
        title: "Vehicles",
        url: "/dashboard/vehicles",
        icon: "vehicle",
    },
    {
        title: "Storage areas",
        url: "/dashboard/areas",
        icon: "area",
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: "users",
    },
    {
        title: "Settings",
        url: "#",
        icon: "setting",
    },
];
