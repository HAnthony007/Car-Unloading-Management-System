import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api";

export function QueryClientProviders({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
