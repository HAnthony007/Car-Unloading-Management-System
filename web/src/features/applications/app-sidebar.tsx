"use client";
import { Icons } from "@/components/icons/icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { sidebarItems } from "./data/sidebar-data";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  // normalizedPathname removes a trailing numeric id segment so
  // routes like `/foo/bar/8` can match `/foo/bar` menu items.
  const normalizedPathname = pathname?.replace(/\/\d+$/, "") ?? pathname;
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <Icons.overview className="!size-5" />
                <span className="text-base font-semibold">
                  Vehicle Unloading Tracking
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const Icon = item.icon ? Icons[item.icon] : Icons.overview;
                // mark top-level item active only on exact match.
                // Sub-items handle their own startsWith logic below.
                const itemActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={!!itemActive}>
                      <Link href={item.url as any}>
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.item?.length ? (
                      <SidebarMenuSub>
                        {item.item.map((subItem) => {
                          const subActive =
                            pathname === subItem.url ||
                            pathname?.startsWith(`${subItem.url}/`) ||
                            normalizedPathname === subItem.url ||
                            normalizedPathname?.startsWith(`${subItem.url}/`);
                          return (
                            <SidebarMenuItem key={subItem.title}>
                              <SidebarMenuButton asChild isActive={!!subActive}>
                                <Link href={subItem.url as any}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
