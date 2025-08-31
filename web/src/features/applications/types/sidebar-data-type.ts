import type { Icons } from "@/components/icons/icon";

export interface SidebarItem {
  title: string;
  url: string;
  icon?: keyof typeof Icons;
  item?: SidebarItem[];
}
