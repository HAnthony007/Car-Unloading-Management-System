"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbsItem = {
  title: string;
  url: string;
};

const routeMapping: Record<string, BreadcrumbsItem[]> = {
  "/dashboard": [
    {
      title: "Dashboard",
      url: "/dashboard",
    },
  ],
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join("/")}`;

      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        url: path,
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
