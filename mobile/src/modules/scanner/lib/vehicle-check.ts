import { api } from "@/src/lib/axios-instance";

// Type retourné par le backend (structure prévue par le contrôleur checkVehicleByVin)
// On reste souple sur les champs optionnels (vehicle, discharge, message…)
export interface VehicleVinCheckResponse {
    vehicle_found: boolean;
    belongs_to_port_call: boolean;
    normalized_vin: string;
    port_call_id: number;
    vehicle?: any; // Affinable si vous ajoutez un type Vehicle partagé
    discharge?: any;
    message?: string;
    [k: string]: any; // tolérer extensions futures
}

/**
 * Vérifie si un véhicule (VIN) existe et appartient au port call donné.
 * Ne lève pas d’erreur pour 404 logique métier : c’est le contrôleur qui formate déjà un JSON.
 */
export async function checkVehicleInPortCall(
    portCallId: string | number,
    vin: string
): Promise<VehicleVinCheckResponse> {
    const { data } = await api.get<VehicleVinCheckResponse>(
        `/port-calls/${portCallId}/vehicles/check`,
        {
            params: { vin },
        }
    );
    return data;
}
