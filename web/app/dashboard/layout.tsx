"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "@/features/Home/app/header/app-header";
import { AppSidebar } from "@/features/Home/app/sidebar/app-sidebar";
import { HomeFooter } from "@/features/Home/page/home-footer";
import Loading from "@app/loading";
import { CSSProperties, useEffect, useState } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, [hasMounted]);

    if (!hasMounted) {
        return <Loading />;
    }
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as CSSProperties
            }
        >
            <AppSidebar variant="floating" />
            <SidebarInset>
                <AppHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}
                    </div>
                </div>
                <HomeFooter />
            </SidebarInset>
        </SidebarProvider>
    );
}
