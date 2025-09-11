import { Discharge, VehicleVinCheckResponse } from "@/src/types/domain";
import { useCallback } from "react";
import {
    buildDischargePayload,
    createDischarge,
    getDischarge,
} from "../lib/discharge";
import { useScannerStore } from "../stores/scanner-store";
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
    const setVehicle = useScannerStore((s) => (s as any).setVehicle);
    // setter pour stocker l'objet discharge complet dans le store
    const setDischarge = useScannerStore(
        (s) => (s as any).setDischarge as (d: Discharge | null) => void
    );

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
                if (resp.vehicle) setVehicle(resp.vehicle);

                let discharge = null;
                let created = false;

                if (resp.vehicle_exists && resp.discharge_id) {
                    try {
                        discharge = await getDischarge(resp.discharge_id);
                        setDischarge(discharge); // on stocke l'objet complet
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
                        setDischarge(discharge); // plus de .data, la fonction retourne déjà l'objet
                    } catch (err: any) {
                        console.log(
                            "[DISCHARGE][CREATE][ERROR]",
                            err?.response?.data || err.message
                        );
                    }
                } else if (!resp.vehicle_exists) {
                    try {
                        const payload = await buildDischargePayload(
                            portCallId,
                            resp.vehicle_id
                        );
                        discharge = await createDischarge(payload);
                        created = true;
                        setDischarge(discharge);
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
        [portCallId, checkVin, setVinCheckResult, setVehicle, setDischarge]
    );

    return { processVin };
}
