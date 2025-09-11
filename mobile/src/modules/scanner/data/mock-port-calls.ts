import { PortCallItem } from "../components/portcall-selector";

export const mockPortCalls: PortCallItem[] = [
    {
        id: "pc-2025-001",
        vessel: "MV Atlantic Trader",
        eta: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        terminal: "Terminal Nord",
        reference: "AT-TRD-8891",
    },
    {
        id: "pc-2025-002",
        vessel: "SS Dakar Spirit",
        eta: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        terminal: "Quai 3",
        reference: "DK-SPR-4421",
    },
    {
        id: "pc-2025-003",
        vessel: "MV Ocean Breeze",
        eta: new Date(Date.now() + 1000 * 60 * 60 * 72).toISOString(),
        terminal: "Terminal Sud",
        reference: "OC-BRZ-1204",
    },
];
