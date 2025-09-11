import { Discharge, VehicleVinCheckResponse } from "@/src/types/domain";
import { useCallback } from "react";
import {
    buildDischargePayload,
    createDischarge,
    getDischarge,
} from "../lib/discharge";
import { useCheckVehicleInPortCall } from "./useCheckVehicleInPortCall";

interface UseProcessVinOptions {
    portCallId: string | null;
    setVinCheckResult?: (data: any) => void;
}

interface ProcessResult {
    check: VehicleVinCheckResponse;
    discharge?: Discharge | null;
    created?: boolean; // true si une discharge a été créée durant le process
}

export function useProcessVin({
    portCallId,
    setVinCheckResult,
}: UseProcessVinOptions) {
    const { checkVin } = useCheckVehicleInPortCall({ portCallId });

    const processVin = useCallback(
        async (vin: string): Promise<ProcessResult | null> => {
            if (!portCallId) {
                console.log(
                    "[VIN PROCESS] Port call non sélectionné - skip backend"
                );
                return null;
            }
            try {
                const resp = await checkVin(vin);
                setVinCheckResult?.(resp);

                let discharge: Discharge | null = null;
                let created = false;

                // Patterns logiques en fonction de la réponse
                if (resp.vehicle_exists && resp.discharge_id) {
                    try {
                        discharge = await getDischarge(resp.discharge_id);
                        console.log("[DISCHARGE][GET]", discharge);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][GET][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                } else if (resp.vehicle_exists && !resp.discharge_id) {
                    try {
                        const payload = await buildDischargePayload(
                            portCallId,
                            resp.vehicle_id
                        );
                        discharge = await createDischarge(payload);
                        created = true;
                        console.log("[DISCHARGE][CREATE]", discharge);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][CREATE][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                } else if (!resp.vehicle_exists) {
                    // fallback: create discharge record anyway using provided vehicle_id surrogate
                    try {
                        const payload = await buildDischargePayload(
                            portCallId,
                            resp.vehicle_id
                        );
                        discharge = await createDischarge(payload);
                        created = true;
                        console.log("[DISCHARGE][CREATE]", discharge);
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][CREATE][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                }

                return { check: resp, discharge, created };
            } catch (e: any) {
                console.log(
                    "[VIN PROCESS][ERROR]",
                    e?.response?.data || e.message
                );
                throw e;
            }
        },
        [portCallId, checkVin, setVinCheckResult]
    );

    return { processVin };
}
