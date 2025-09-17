import { api } from "@/src/lib/axios-instance";
import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { useInspectionSync } from "@/src/modules/vehicules/stores/inspection-sync";
import { useCallback, useEffect, useState } from "react";

interface InspectionCheckpoint {
    id: string;
    title_checkpoint: string;
    description_checkpoint: string;
    order_checkpoint: number;
    status?: "ok" | "defaut" | "na";
    comment?: string;
    photos?: string[];
}

interface Inspection {
    id: string;
    survey_name: string;
    survey_description: string;
    overall_status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    checkpoints: InspectionCheckpoint[];
    created_at: string;
    updated_at: string;
}

interface UseInspectionsAccordionResult {
    inspections: Inspection[];
    loading: boolean;
    error: string | null;
    validateInspection: (inspectionId: string) => Promise<void>;
    startInspection: (inspectionId: string) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Hook pour gérer les inspections dans l'accordéon des inspections
 */
export function useInspectionsAccordion(): UseInspectionsAccordionResult {
    const dischargeId = useScannerStore(
        (s) => s.discharge?.discharge_id || null
    );
    const { bump } = useInspectionSync();
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInspections = useCallback(async () => {
        if (!dischargeId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await api.get(`/discharges/${dischargeId}/inspection`);
            const raw = res.data?.data || [];
            const normalized: Inspection[] = raw.map((s: any) => ({
                id: String(s.survey_id ?? s.id ?? ""),
                survey_name: s.survey_name,
                survey_description: s.survey_description,
                overall_status: s.overall_status,
                checkpoints: (s.checkpoints || []).map((cp: any) => ({
                    id: String(cp.checkpoint_id ?? cp.id ?? ""),
                    title_checkpoint: cp.title_checkpoint,
                    description_checkpoint: cp.description_checkpoint,
                    order_checkpoint: cp.order_checkpoint,
                    status: cp.result_checkpoint ?? cp.status,
                    comment: cp.comment_checkpoint ?? cp.comment,
                    photos: cp.photos || [],
                })),
                created_at:
                    s.created_at || s.survey_date || new Date().toISOString(),
                updated_at:
                    s.updated_at || s.survey_date || new Date().toISOString(),
            }));
            setInspections(normalized);
        } catch (e: any) {
            if (e.response?.status === 404) {
                setInspections([]);
            } else {
                setError(e.message || "Erreur de chargement des inspections");
            }
        } finally {
            setLoading(false);
        }
    }, [dischargeId]);

    const validateInspection = useCallback(
        async (inspectionId: string) => {
            try {
                await api.put(`/surveys/${inspectionId}`, {
                    overall_status: "COMPLETED",
                });
                await fetchInspections();
                bump();
            } catch (e: any) {
                setError(e.message || "Erreur lors de la validation");
                throw e;
            }
        },
        [fetchInspections, bump]
    );

    const startInspection = useCallback(
        async (inspectionId: string) => {
            try {
                // Only the "Nouvelle inspection" button should initialize inspections
                if (inspectionId === "new") {
                    if (!dischargeId) {
                        throw new Error(
                            "Aucun discharge sélectionné pour démarrer l'inspection"
                        );
                    }

                    await api.post("/inspections/start", {
                        discharge_id: dischargeId,
                    });

                    // Refresh inspections list for this discharge
                    await fetchInspections();
                    bump();
                    return;
                }

                // Existing inspection: mark as IN_PROGRESS on the server
                await api.put(`/surveys/${inspectionId}`, {
                    overall_status: "IN_PROGRESS",
                });
                await fetchInspections();
                bump();
            } catch (e: any) {
                const message =
                    e?.response?.data?.error ||
                    e?.response?.data?.message ||
                    e?.message ||
                    "Erreur lors du démarrage";
                setError(message);
                throw new Error(message);
            }
        },
        [dischargeId, fetchInspections, bump]
    );

    useEffect(() => {
        if (dischargeId) fetchInspections();
    }, [dischargeId, fetchInspections]);

    return {
        inspections,
        loading,
        error,
        validateInspection,
        startInspection,
        refetch: fetchInspections,
    };
}
