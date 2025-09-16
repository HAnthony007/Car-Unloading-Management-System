import { api } from "@/src/lib/axios-instance";
import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { useCallback, useEffect, useState } from "react";
import {
    mapRemoteSurveysToCategories,
    RemoteSurvey,
} from "../lib/transform-inspection";
import { useInspection } from "./use-inspection";

interface UseDischargeInspectionResult {
    hasInspection: boolean | null;
    loading: boolean;
    starting: boolean;
    error: string | null;
    start: (force?: boolean) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Encapsule la logique de récupération / initialisation d'une inspection de discharge.
 */
export function useDischargeInspection(): UseDischargeInspectionResult {
    const dischargeId = useScannerStore(
        (s) => s.discharge?.discharge_id || null
    );
    const { setCategories } = useInspection();
    const [hasInspection, setHasInspection] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(false);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInspection = useCallback(async () => {
        if (!dischargeId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/discharges/${dischargeId}/inspection`);
            const data: RemoteSurvey[] = res.data?.data || [];
            setCategories(mapRemoteSurveysToCategories(data));
            setHasInspection(true);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setHasInspection(false);
            } else {
                setError(e.message || "Erreur de chargement");
            }
        } finally {
            setLoading(false);
        }
    }, [dischargeId, setCategories]);

    const start = useCallback(
        async (force = false) => {
            if (!dischargeId) return;
            setStarting(true);
            try {
                await api.post(`/inspections/start`, {
                    discharge_id: dischargeId,
                    force,
                });
                await fetchInspection();
            } catch (e: any) {
                setError(
                    e.response?.data?.message ||
                        e.message ||
                        "Impossible de démarrer l'inspection"
                );
            } finally {
                setStarting(false);
            }
        },
        [dischargeId, fetchInspection]
    );

    useEffect(() => {
        if (dischargeId) fetchInspection();
    }, [dischargeId, fetchInspection]);

    return {
        hasInspection,
        loading,
        starting,
        error,
        start,
        refetch: fetchInspection,
    };
}
