import { api } from "@/src/lib/axios-instance";
import { VehicleVinCheckResponse } from "@/src/types/domain";

function normalizeVinCheckResponse(raw: any): VehicleVinCheckResponse {
    const vehicle_exists = raw.vehicle_exists ?? raw.vehicle_found ?? false;
    return {
        vehicle_exists,
        belongs_to_port_call: raw.belongs_to_port_call ?? false,
        normalized_vin: raw.normalized_vin ?? raw.vin ?? "",
        port_call_id: raw.port_call_id ?? raw.portCallId ?? 0,
        vehicle_id: raw.vehicle_id ?? null,
        discharge_id: raw.discharge_id ?? raw.dischargeId ?? null,
        vehicle: raw.vehicle ?? null,
        discharge: raw.discharge ?? null,
        message: raw.message,
    };
}

/**
 * Vérifie si un véhicule (VIN) existe et appartient au port call donné.
 * Ne lève pas d’erreur pour 404 logique métier : c’est le contrôleur qui formate déjà un JSON.
 */
export async function checkVehicleInPortCall(
    portCallId: string | number,
    vin: string
): Promise<VehicleVinCheckResponse> {
    const { data } = await api.get<any>(
        `/port-calls/${portCallId}/vehicles/check`,
        {
            params: { vin },
        }
    );
    return normalizeVinCheckResponse(data);
}
