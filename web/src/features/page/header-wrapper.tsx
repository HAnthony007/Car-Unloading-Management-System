"use client";

import { usePathname } from "next/navigation";
import { HomeHeader } from "./home-header";

export const HeaderWrapper = () => {
  const pathname = usePathname();

  const isDashboardPath = pathname.startsWith("/dashboard");
  return <>{isDashboardPath ? null : <HomeHeader />}</>;
};
