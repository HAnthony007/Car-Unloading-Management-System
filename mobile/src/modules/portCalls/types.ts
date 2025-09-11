export interface Vessel {
    vessel_id: number;
    imo_no: string;
    vessel_name: string;
    flag: string;
    created_at: string;
    updated_at: string;
}

export interface VehicleInPortCall {
    vehicle_id: number;
    vin: string;
    make: string;
    model: string;
    year: number;
    owner_name: string;
    color: string;
    type: string;
    weight: string;
    vehicle_condition: string; // Neuf | Occasion
    vehicle_observation: string;
    origin_country: string;
    ship_location: string;
    is_primed: boolean;
    created_at: string;
    updated_at: string;
}

export type PortCallStatus =
    | "pending"
    | "in_progress"
    | "completed"
    | "canceled";

export interface PortCall {
    port_call_id: number;
    vessel_agent: string;
    origin_port: string;
    estimated_arrival: string; // ETA
    arrival_date: string | null;
    estimated_departure: string | null; // ETD
    departure_date: string | null;
    vessel_id: number;
    dock_id: number | null;
    vehicles_number: number;
    status: PortCallStatus;
    vessel: Vessel;
    dock: any; // future detail
    created_at: string;
    updated_at: string;
    vehicles?: VehicleInPortCall[]; // attached list when viewing details
}

export interface PortCallStats {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
}
