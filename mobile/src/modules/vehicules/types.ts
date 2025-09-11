export type VehicleStatus =
    | "pending"
    | "unloaded"
    | "under_inspection"
    | "inspected"
    | "parked"
    | "completed"
    | "quarantined"
    | "rejected";
export type CustomsStatus = "pending" | "cleared" | "hold";

export type InspectionStatus =
    | "in_progress"
    | "conforme"
    | "non_conforme"
    | "critical"
    | "pending_review"
    | "approved"
    | "rejected";

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    chassisNumber: string;
    color: string;
    origin: string;
    shipowner: string;
    arrivalDate: string;
    zone: string;
    status: VehicleStatus;
    images?: string[];
    notes?: string;
    customsStatus?: CustomsStatus;
    estimatedDelivery?: string;
    inspectionProgress?: number;
    inspectionStatus?: InspectionStatus;
}

export type ItemStatus = "ok" | "defaut" | "na";

export interface ChecklistItem {
    id: string;
    label: string;
    status: ItemStatus;
    comment: string;
    photos: string[]; // URIs
}

export interface CategoryBlock {
    key: string;
    title: string;
    description: string;
    items: ChecklistItem[];
}
