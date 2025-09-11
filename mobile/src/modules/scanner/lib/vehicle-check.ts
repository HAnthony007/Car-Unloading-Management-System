import { api } from "@/src/lib/axios-instance";
import { VehicleVinCheckResponse } from "@/src/types/domain";

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
