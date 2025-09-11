import { RecentScanItem } from "../type";

export const mockRecentScans: RecentScanItem[] = [
    {
        id: 1,
        data: "VH001234567",
        time: "10:30",
        type: "QR Code",
        vehicle: "Toyota RAV4",
    },
    {
        id: 2,
        data: "VH009876543",
        time: "09:15",
        type: "Code-barres",
        vehicle: "BMW X3",
    },
];
