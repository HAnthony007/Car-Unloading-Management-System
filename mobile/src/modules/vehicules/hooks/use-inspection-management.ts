import { api } from "@/src/lib/axios-instance";
import { useScannerStore } from "@/src/modules/scanner/stores/scanner-store";
import { useInspectionSync } from "@/src/modules/vehicules/stores/inspection-sync";
import { useFocusEffect } from "@react-navigation/native";
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

interface UseInspectionManagementResult {
    inspections: Inspection[];
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateCheckpointStatus: (
        checkpointId: string,
        status: "ok" | "defaut" | "na"
    ) => Promise<void>;
    updateCheckpointComment: (
        checkpointId: string,
        comment: string
    ) => Promise<void>;
    addCheckpointPhoto: (
        checkpointId: string,
        photoUri: string
    ) => Promise<void>;
    removeCheckpointPhoto: (
        checkpointId: string,
        photoIndex: number
    ) => Promise<void>;
    confirmInspection: (inspectionId: string) => Promise<void>;
    refetch: () => Promise<void>;
}

/**
 * Hook pour gérer les inspections et leurs checkpoints
 */
export function useInspectionManagement(): UseInspectionManagementResult {
    const dischargeId = useScannerStore(
        (s) => s.discharge?.discharge_id || null
    );
    const { bump } = useInspectionSync();
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pending local changes by checkpointId (staged until confirm)
    type CheckpointChange = {
        status?: "ok" | "defaut" | "na";
        comment?: string;
        // Photo staging placeholders (URIs). Full offline photo batching would
        // require integrating a real picker/camera and mapping to uploads.
        addPhotos?: string[];
        removePhotoIndices?: number[];
    };
    const [pending, setPending] = useState<Record<string, CheckpointChange>>(
        {}
    );

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

    const updateCheckpointStatus = useCallback(
        async (checkpointId: string, status: "ok" | "defaut" | "na") => {
            // Stage locally: update UI immediately, but don't hit API yet
            setInspections((prev) =>
                prev.map((inspection) => ({
                    ...inspection,
                    checkpoints: inspection.checkpoints.map((cp) =>
                        cp.id === checkpointId ? { ...cp, status } : cp
                    ),
                }))
            );
            setPending((p) => ({
                ...p,
                [checkpointId]: { ...(p[checkpointId] || {}), status },
            }));
        },
        []
    );

    const updateCheckpointComment = useCallback(
        async (checkpointId: string, comment: string) => {
            // Stage locally
            setInspections((prev) =>
                prev.map((inspection) => ({
                    ...inspection,
                    checkpoints: inspection.checkpoints.map((cp) =>
                        cp.id === checkpointId ? { ...cp, comment } : cp
                    ),
                }))
            );
            setPending((p) => ({
                ...p,
                [checkpointId]: { ...(p[checkpointId] || {}), comment },
            }));
        },
        []
    );

    const addCheckpointPhoto = useCallback(
        async (checkpointId: string, photoUri: string) => {
            // Stage locally only; upload will occur on confirm (if implemented)
            setInspections((prev) =>
                prev.map((inspection) => ({
                    ...inspection,
                    checkpoints: inspection.checkpoints.map((cp) =>
                        cp.id === checkpointId
                            ? {
                                  ...cp,
                                  photos: [...(cp.photos || []), photoUri],
                              }
                            : cp
                    ),
                }))
            );
            setPending((p) => ({
                ...p,
                [checkpointId]: {
                    ...(p[checkpointId] || {}),
                    addPhotos: [
                        ...((p[checkpointId]?.addPhotos as string[]) || []),
                        photoUri,
                    ],
                },
            }));
        },
        []
    );

    const removeCheckpointPhoto = useCallback(
        async (checkpointId: string, photoIndex: number) => {
            // Stage locally only
            setInspections((prev) =>
                prev.map((inspection) => ({
                    ...inspection,
                    checkpoints: inspection.checkpoints.map((cp) => {
                        if (cp.id !== checkpointId) return cp;
                        const photos = [...(cp.photos || [])];
                        photos.splice(photoIndex, 1);
                        return { ...cp, photos };
                    }),
                }))
            );
            setPending((p) => ({
                ...p,
                [checkpointId]: {
                    ...(p[checkpointId] || {}),
                    removePhotoIndices: [
                        ...((p[checkpointId]?.removePhotoIndices as number[]) ||
                            []),
                        photoIndex,
                    ],
                },
            }));
        },
        []
    );

    const confirmInspection = useCallback(
        async (inspectionId: string) => {
            setUpdating(true);
            setError(null);
            try {
                // Collect staged changes for checkpoints in this inspection
                const inspection = inspections.find(
                    (i) => i.id === inspectionId
                );
                const checkpointIds =
                    inspection?.checkpoints.map((c) => c.id) || [];
                const work: Promise<any>[] = [];

                for (const cpId of checkpointIds) {
                    const change = pending[cpId];
                    if (!change) continue;

                    if (typeof change.status !== "undefined") {
                        work.push(
                            api.put(`/inspection-checkpoints/${cpId}/status`, {
                                status: change.status,
                            })
                        );
                    }
                    if (typeof change.comment !== "undefined") {
                        work.push(
                            api.put(`/inspection-checkpoints/${cpId}/comment`, {
                                comment: change.comment,
                            })
                        );
                    }
                    // Photos batching is not finalized here due to server index mapping and picker integration needs.
                    // TODO: if using real local URIs, upload added photos here, remove by server index if applicable.
                }

                // Execute all updates; fail fast if any error
                await Promise.all(work);

                // Mark the survey as COMPLETED
                await api.put(`/surveys/${inspectionId}`, {
                    overall_status: "COMPLETED",
                });

                // Clear pending entries for this inspection's checkpoints
                setPending((p) => {
                    const clone = { ...p } as Record<string, CheckpointChange>;
                    for (const cpId of checkpointIds) delete clone[cpId];
                    return clone;
                });

                // Update local status and refetch to sync with backend
                setInspections((prev) =>
                    prev.map((ins) =>
                        ins.id === inspectionId
                            ? { ...ins, overall_status: "COMPLETED" as const }
                            : ins
                    )
                );
                await fetchInspections();

                // Notify other screens (like vehicle index) that inspections changed
                bump();
            } catch (e: any) {
                const msg =
                    e?.response?.data?.message ||
                    e?.message ||
                    "Erreur lors de la confirmation";
                setError(msg);
                throw new Error(msg);
            } finally {
                setUpdating(false);
            }
        },
        [inspections, pending, fetchInspections, bump]
    );

    useEffect(() => {
        if (dischargeId) fetchInspections();
    }, [dischargeId, fetchInspections]);

    // Also refetch when the screen regains focus (e.g., after starting an inspection elsewhere)
    useFocusEffect(
        useCallback(() => {
            if (dischargeId) {
                fetchInspections();
            }
        }, [dischargeId, fetchInspections])
    );

    return {
        inspections,
        loading,
        error,
        updating,
        updateCheckpointStatus,
        updateCheckpointComment,
        addCheckpointPhoto,
        removeCheckpointPhoto,
        confirmInspection,
        refetch: fetchInspections,
    };
}
