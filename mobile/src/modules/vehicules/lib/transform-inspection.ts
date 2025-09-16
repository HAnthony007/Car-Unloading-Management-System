import { CategoryBlock } from "../types";

interface RemoteCheckpoint {
    checkpoint_id: number;
    title_checkpoint: string;
    description_checkpoint?: string | null;
    comment_checkpoint?: string | null;
    result_checkpoint?: string | null; // expected: ok | defaut | na | null
    order_checkpoint?: number | null;
}

interface RemoteSurvey {
    survey_id: number;
    survey_name: string;
    survey_description?: string | null;
    checkpoints: RemoteCheckpoint[];
}

/**
 * Transform backend surveys payload to internal CategoryBlock[] structure.
 */
export function mapRemoteSurveysToCategories(
    surveys: RemoteSurvey[]
): CategoryBlock[] {
    return surveys.map((s) => ({
        key: `survey-${s.survey_id}`,
        title: s.survey_name,
        description: s.survey_description || "",
        items: [...(s.checkpoints || [])]
            .sort(
                (a, b) => (a.order_checkpoint || 0) - (b.order_checkpoint || 0)
            )
            .map((c) => ({
                id: `checkpoint-${c.checkpoint_id}`,
                label: c.title_checkpoint,
                status: (c.result_checkpoint as any) || null,
                comment: c.comment_checkpoint || "",
                photos: [],
            })),
    }));
}

export type { RemoteCheckpoint, RemoteSurvey };
