import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { HomeFooter } from "@/features/Home/page/home-footer";
import { AppSidebar } from "@/features/Home/sidebar/app-sidebar";
import { CSSProperties } from "react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72",
                    "--header-height": "calc(var(--spacing) * 12",
                } as CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
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
