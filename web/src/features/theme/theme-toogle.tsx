"use client";

import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";
import { useTheme } from "next-themes";

export function ToggleTheme() {
  const { setTheme } = useTheme();
  return <ThemeSwitcher onChange={setTheme} defaultValue="system" />;
}
