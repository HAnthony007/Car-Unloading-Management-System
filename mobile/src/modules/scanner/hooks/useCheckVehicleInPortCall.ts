import { useMutation } from "@tanstack/react-query";
import {
    checkVehicleInPortCall,
    VehicleVinCheckResponse,
} from "../lib/vehicle-check";

interface Options {
    portCallId: string | null;
}

export function useCheckVehicleInPortCall({ portCallId }: Options) {
    const mutation = useMutation<VehicleVinCheckResponse, any, string>({
        mutationFn: async (vin: string) => {
            if (!portCallId) throw new Error("PORT_CALL_NOT_SELECTED");
            return await checkVehicleInPortCall(portCallId, vin);
        },
    });

    return {
        checkVin: mutation.mutateAsync,
        isChecking: mutation.isPending,
        data: mutation.data,
        error: mutation.error,
        reset: mutation.reset,
    };
}
