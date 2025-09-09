import { ColorSchemeProvider } from "./colorscheme";
import { QueryClientProviders } from "./query-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ColorSchemeProvider>
            <QueryClientProviders>{children}</QueryClientProviders>
        </ColorSchemeProvider>
    );
}
