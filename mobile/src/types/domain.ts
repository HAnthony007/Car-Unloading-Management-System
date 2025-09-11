// Domain types inferred from backend resources:
// - api/app/Presentation/Http/Resources/VehicleResource.php
// - api/app/Presentation/Http/Resources/DischargeResource.php

export interface Vehicle {
    vehicle_id: number | null; // backend may return null if not persisted
    vin: string;
    make: string | null;
    model: string | null;
    year: number | null;
    owner_name: string | null;
    color: string | null;
    type: string | null;
    weight: number | string | null; // uncertain numeric format
    vehicle_condition: string | null;
    vehicle_observation: string | null;
    origin_country: string | null;
    ship_location: string | null;
    is_primed: boolean | null;
    created_at?: string | null; // ISO date
    updated_at?: string | null; // ISO date
}

export interface Discharge {
    discharge_id: number | null;
    discharge_date: string | null; // ISO
    port_call_id: number | null;
    vehicle_id: number | null;
    agent_id: number | null;
    port_call?: {
        port_call_id: number;
        origin_port?: string | null;
        arrival_date?: string | null; // ISO
        departure_date?: string | null; // ISO
        status?: string | null;
        // relations
        vessel?: {
            vessel_id: number;
            vessel_name: string;
            imo_no?: string;
            flag?: string | null;
        } | null;
        dock?: { dock_id?: number; name?: string } | null;
    } | null;
    vehicle: Vehicle | null;
    agent?: {
        user_id?: number | string;
        matriculation_no: string;
        full_name: string;
        email: string;
        phone?: string;
    } | null;
    created_at?: string | null;
    updated_at?: string | null;
}

// Response of VIN check endpoint (consolidated from usage + expected backend semantics)
export interface VehicleVinCheckResponse {
    vehicle_exists: boolean; // whether vehicle record exists
    belongs_to_port_call: boolean; // whether associated with selected port call
    normalized_vin: string; // uppercase sanitized vin
    port_call_id: number; // target port call id
    vehicle_id: number | null; // id if exists / or provisional mapping
    discharge_id?: number | null; // id of discharge if one already exists
    vehicle?: Vehicle | null;
    discharge?: Discharge | null;
    message?: string;
}
