import React from "react";
import { QueryClientProviders } from "./query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <QueryClientProviders>{children}</QueryClientProviders>;
}
