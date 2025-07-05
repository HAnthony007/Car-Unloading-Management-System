"use client";

import React from "react";
import { QueryProvider } from "./query/query-provider";
import { ThemeProvider } from "./theme/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}
