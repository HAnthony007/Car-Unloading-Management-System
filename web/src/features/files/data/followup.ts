import { fetchWithCsrf } from "@/lib/http";
import { FollowupFile, FollowupFileFormData, WorkflowStep } from "./schema";

// --- Helpers ---
type UnknownRecord = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRecord {
    return typeof v === "object" && v !== null;
}

function mapStatusToUi(statusRaw: unknown): FollowupFile["status"] {
    const s = String(statusRaw ?? "").toUpperCase();
    switch (s) {
        case "PENDING":
        case "WAITING":
            return "En attente";
        case "COMPLETED":
        case "DONE":
        case "CLOSED":
            return "Fermé";
        case "IN_PROGRESS":
        default:
            return "Ouvert";
    }
}

// --- Workflow defaults ---
function makeDefaultWorkflowSteps(
    status: unknown,
    recordId?: string,
): WorkflowStep[] {
    const s = String(status ?? "Ouvert");
    const closed = s === "Fermé";
    const idPrefix = recordId ? `${recordId}-` : "";
    // Requested order:
    // 1. Manifeste importe
    // 2. Debarquement
    // 3. Inspection et expertise
    // 4. Dossier cloture
    const steps: WorkflowStep[] = [
        {
            id: `${idPrefix}s1`,
            name: "Manifeste importe",
            description: "Fichier manifeste importé dans le système",
            status: closed ? "Terminé" : "Terminé", // considéré terminé dès création du dossier
            order: 1,
            is_required: true,
        },
        {
            id: `${idPrefix}s2`,
            name: "Debarquement",
            description: "Véhicule débarqué du navire",
            status: closed ? "Terminé" : "En attente",
            order: 2,
            is_required: true,
        },
        {
            id: `${idPrefix}s3`,
            name: "Inspection et expertise",
            description: "Contrôle visuel et expertise du véhicule",
            status: closed ? "Terminé" : "En attente",
            order: 3,
            is_required: true,
        },
        {
            id: `${idPrefix}s4`,
            name: "Dossier cloture",
            description: "Clôture administrative du dossier",
            status: closed ? "Terminé" : "En attente",
            order: 4,
            is_required: true,
        },
    ];
    return steps;
}

// --- Business rules helpers ---
function stripAccents(input: string): string {
    try {
        return input.normalize("NFD").replace(/\p{M}/gu, "");
    } catch {
        return input;
    }
}

function hasNonEmpty(value: unknown): boolean {
    if (value == null) return false;
    const s = String(value).trim().toLowerCase();
    if (s === "" || s === "null" || s === "undefined" || s === "0") return false;
    return true;
}

function getDischargeValue(src: UnknownRecord): unknown {
    const vehicle = isRecord(src.vehicle) ? (src.vehicle as UnknownRecord) : undefined;
    return (
        (src as any).discharge_id ??
        (src as any).dischargeId ??
        (src as any).discharge ??
        (vehicle as any)?.discharge_id ??
        (vehicle as any)?.dischargeId ??
        (vehicle as any)?.discharge
    );
}

function surveyPassedFromRaw(src: UnknownRecord, normalizedInspections: unknown[]): boolean {
    // Direct flags on root
    const direct = (src as any).survey_result ?? (src as any).surveyResult ?? (src as any).survey?.result;
    if (hasNonEmpty(direct)) {
        const s = String(direct).toLowerCase();
        if (s.includes("pass")) return true; // pass / passed
        if (["ok", "valide", "valid", "approved", "approuve"].includes(s)) return true;
    }

    // Look into provided inspections from payload if any
    const rawInspections = Array.isArray((src as any)?.inspections) ? ((src as any).inspections as unknown[]) : [];
    const all = [...rawInspections, ...(Array.isArray(normalizedInspections) ? normalizedInspections : [])];
    for (const it of all) {
        const obj = isRecord(it) ? (it as UnknownRecord) : undefined;
        if (!obj) continue;
        const typeRaw = (obj.type as string) ?? (obj.name as string) ?? "";
        const type = String(typeRaw).toUpperCase();
        if (!type.includes("SURVEY")) continue;
        const resultRaw = (obj.results as string) ?? (obj.result as string) ?? (obj.outcome as string) ?? "";
        if (hasNonEmpty(resultRaw)) {
            const s = String(resultRaw).toLowerCase();
            if (s.includes("pass")) return true;
            if (["ok", "valide", "valid", "approved", "approuve"].includes(s)) return true;
        }
        const passedBool = (obj.passed as boolean) ?? (obj.success as boolean) ?? undefined;
        if (passedBool === true) return true;
    }
    return false;
}

// --- Normalizers ---
export function normalizeFollowup(input: unknown): Partial<FollowupFile> & { id?: string } {
    const src = isRecord(input) ? input : ({} as UnknownRecord);
    const idRaw = (src.follow_up_file_id as string | number | undefined) ?? (src.id as string | number | undefined);
    const id = idRaw != null ? String(idRaw) : undefined;
    const reference = (src.bill_of_lading as string) ?? (src.reference_number as string) ?? "";
    const vehicleIdRaw =
        (src.vehicle_id as string | number | undefined) ??
        (isRecord(src.vehicle) ? ((src.vehicle as UnknownRecord).vehicle_id as string | number | undefined) : undefined);
    const portCallIdRaw =
        (src.port_call_id as string | number | undefined) ??
        (isRecord(src.port_call) ? ((src.port_call as UnknownRecord).port_call_id as string | number | undefined) : undefined);
    const createdAt = (src.created_at as string) ?? "";
    const updatedAt = (src.updated_at as string) ?? "";

    // vehicle_info from nested vehicle if available
    const vehicle = isRecord(src.vehicle) ? (src.vehicle as UnknownRecord) : undefined;
    const vehicle_info = vehicle
        ? {
                plate_number: (vehicle.vin as string) ?? "",
                brand: (vehicle.make as string) ?? "",
                model: (vehicle.model as string) ?? "",
                year: Number(vehicle.year ?? 0) || 0,
            }
        : undefined;

    const normalized: Partial<FollowupFile> & { id?: string } = {
        id,
        reference_number: reference,
        status: mapStatusToUi(src.status),
        vehicle_id: vehicleIdRaw != null ? String(vehicleIdRaw) : "",
        port_call_id: portCallIdRaw != null ? String(portCallIdRaw) : "",
        created_at: createdAt,
        updated_at: updatedAt,
        vehicle_info,
        documents: [],
        photos: [],
        workflow_steps: [],
        inspections: [],
        priority: "Moyenne",
    } as Partial<FollowupFile> & { id?: string };

    // If backend provided inspections, adopt them leniently (minimal fields)
    if (Array.isArray((src as any)?.inspections)) {
        const rawInspections = (src as any).inspections as unknown[];
        normalized.inspections = rawInspections
            .map((r, idx) => {
                if (!isRecord(r)) return null;
                const typeRaw = (r as any).type ?? (r as any).name ?? "";
                const typeUpper = String(typeRaw).toUpperCase();
                const type: any = typeUpper.includes("SURVEY")
                    ? "SURVEY"
                    : typeUpper.includes("DOC")
                        ? "Vérification documentaire"
                        : typeUpper.includes("QUAL")
                            ? "Contrôle qualité"
                            : "Inspection technique";
                return {
                    id: String((r as any).id ?? `${id ?? ""}-i${idx + 1}`),
                    type,
                    status: (String((r as any).status ?? "Planifiée") as any),
                    inspector: String((r as any).inspector ?? (r as any).inspector_name ?? ""),
                    scheduled_at: String((r as any).scheduled_at ?? (r as any).scheduledAt ?? (r as any).date ?? ""),
                    started_at: (r as any).started_at ?? (r as any).startedAt ?? undefined,
                    completed_at: (r as any).completed_at ?? (r as any).completedAt ?? undefined,
                    results: (r as any).results ?? (r as any).result ?? undefined,
                    findings: Array.isArray((r as any).findings) ? (r as any).findings : undefined,
                    recommendations: Array.isArray((r as any).recommendations) ? (r as any).recommendations : undefined,
                };
            })
            .filter(Boolean) as any;
    }

    // If backend provided workflow steps, try to adopt them (very lenient)
    if (Array.isArray((src as any)?.workflow_steps)) {
        const raw = (src as any).workflow_steps as unknown[];
        const steps: WorkflowStep[] = raw
            .map((r, idx): WorkflowStep | null => {
                if (!isRecord(r)) return null;
                const name = String((r as any).name ?? "").trim();
                const status = String((r as any).status ?? "En attente");
                const order = Number((r as any).order ?? idx + 1) || idx + 1;
                const idVal = String(((r as any).id ?? `${id ?? ""}-s${order}`) || `s${order}`);
                return {
                    id: idVal,
                    name: name || `Étape ${order}`,
                    description: String((r as any).description ?? ""),
                    status: (status as WorkflowStep["status"]) || "En attente",
                    order,
                    is_required: Boolean((r as any).is_required ?? true),
                };
            })
            .filter(Boolean) as WorkflowStep[];
        if (steps.length > 0) normalized.workflow_steps = steps;
    }

    // Fallback to default template if empty
    if (!normalized.workflow_steps || normalized.workflow_steps.length === 0) {
        normalized.workflow_steps = makeDefaultWorkflowSteps(normalized.status, id);
    }

    // Apply auto-status rules based on domain data
    try {
        const dischargeVal = getDischargeValue(src);
        const hasDischarge = hasNonEmpty(dischargeVal);
        const surveyPassed = surveyPassedFromRaw(src, normalized.inspections || []);

        if (Array.isArray(normalized.workflow_steps)) {
            normalized.workflow_steps = normalized.workflow_steps.map((step) => {
                const nameKey = stripAccents(String(step.name || "").toLowerCase());
                const isDebark = step.order === 2 || nameKey.includes("debarquement");
                const isSurvey = step.order === 3 || (nameKey.includes("inspection") && nameKey.includes("expertise"));
                if (isDebark && hasDischarge && step.status !== "Terminé") {
                    return { ...step, status: "Terminé" };
                }
                if (isSurvey && surveyPassed && step.status !== "Terminé") {
                    return { ...step, status: "Terminé" };
                }
                return step;
            });
        }
    } catch {
        // best-effort; ignore errors
    }

    return normalized;
}

export function parseFollowupFiles(payload: unknown): FollowupFile[] {
    const list: unknown[] = Array.isArray((payload as any)?.data)
        ? (payload as any).data
        : Array.isArray(payload)
            ? (payload as unknown[])
            : [];
    const normalized = list.map(normalizeFollowup);
    return normalized
        .filter((it) => it.id && it.reference_number)
        .map((it) => ({
            id: it.id!,
            reference_number: it.reference_number || "",
            status: (it.status as FollowupFile["status"]) || "Ouvert",
            vehicle_id: it.vehicle_id || "",
            port_call_id: it.port_call_id || "",
            created_at: it.created_at || "",
            updated_at: it.updated_at || "",
            vehicle_info: it.vehicle_info,
            documents: it.documents || [],
            photos: it.photos || [],
            workflow_steps: it.workflow_steps || [],
            inspections: it.inspections || [],
            assigned_inspector: it.assigned_inspector,
            notes: it.notes,
            priority: it.priority || "Moyenne",
            estimated_completion_date: it.estimated_completion_date,
            actual_completion_date: it.actual_completion_date,
        }));
}

// --- Public API ---
export type FollowupMeta = {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from?: number;
    to?: number;
    path?: string;
};

export type FollowupFilesResponse = { data: FollowupFile[]; meta: FollowupMeta };

export async function fetchFollowupFilesResponse(): Promise<FollowupFilesResponse> {
    const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
    if (!base) throw new Error("Backend base URL not configured");
    // Backend (Laravel) route: /api/follow-up-files
    const url = new URL(`${base}/follow-up-files`);

    const res = await fetchWithCsrf(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
    });
    if (!res.ok) {
        let message = `Failed to fetch follow-up files (HTTP ${res.status})`;
        try {
            const body = await res.clone().text();
            if (body) message += `: ${body.slice(0, 240)}`;
        } catch {}
        throw new Error(message);
    }
    const raw = await res.json();

    const data = parseFollowupFiles(raw);
        const meta: FollowupMeta = {
        current_page: Number(raw?.meta?.current_page ?? 1),
        last_page: Number(raw?.meta?.last_page ?? 1),
            per_page: Number((raw?.meta?.per_page ?? data.length) || 10),
        total: Number(raw?.meta?.total ?? data.length),
        from: raw?.meta?.from != null ? Number(raw.meta.from) : undefined,
        to: raw?.meta?.to != null ? Number(raw.meta.to) : undefined,
        path: typeof raw?.meta?.path === "string" ? raw.meta.path : undefined,
    };
    return { data, meta };
}

export const fetchFollowupFiles = async (): Promise<FollowupFile[]> => {
    const { data } = await fetchFollowupFilesResponse();
    return data;
};

// CamelCase meta response, aligned with Users feature
export type FollowupsMeta = {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
};

export type FollowupsResponse = { data: FollowupFile[]; meta: FollowupsMeta };

export function parseFollowupsResponse(payload: unknown): FollowupsResponse {
    const data = parseFollowupFiles(payload);
    let meta: FollowupsMeta = {
        currentPage: 1,
        lastPage: 1,
        perPage: data.length,
        total: data.length,
    };
    if (typeof payload === "object" && payload !== null && typeof (payload as any).meta === "object") {
        const m = (payload as any).meta as Record<string, unknown>;
        const current = Number(m.current_page ?? 1);
        const last = Number(m.last_page ?? 1);
        const per = Number(((m.per_page as number | string | undefined) ?? data.length) || 10);
        const total = Number(m.total ?? data.length);
        meta = {
            currentPage: Number.isFinite(current) ? current : 1,
            lastPage: Number.isFinite(last) ? last : 1,
            perPage: Number.isFinite(per) ? per : data.length || 10,
            total: Number.isFinite(total) ? total : data.length,
        };
    }
    return { data, meta };
}

export const createFollowupFile = async (
    data: FollowupFileFormData
): Promise<FollowupFile> => {
    // TODO: Wire to backend POST /follow-up-files when API is ready
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newId = Date.now().toString();
    const status: FollowupFile["status"] = "Ouvert";
    return {
        id: newId,
        reference_number: data.reference_number,
        status,
        vehicle_id: data.vehicle_id,
        port_call_id: data.port_call_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        documents: [],
        photos: [],
        workflow_steps: makeDefaultWorkflowSteps(status, newId),
        inspections: [],
        assigned_inspector: data.assigned_inspector,
        notes: data.notes,
        priority: data.priority,
        estimated_completion_date: data.estimated_completion_date,
    };
};

export const updateFollowupFile = async (
    id: string,
    data: Partial<FollowupFile>
): Promise<FollowupFile> => {
    // TODO: Wire to backend PUT /follow-up-files/{id} when API is ready
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
        id,
        reference_number: data.reference_number || "",
        status: (data.status as FollowupFile["status"]) || "Ouvert",
        vehicle_id: data.vehicle_id || "",
        port_call_id: data.port_call_id || "",
        created_at: data.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vehicle_info: data.vehicle_info,
        documents: data.documents || [],
        photos: data.photos || [],
        workflow_steps: (data.workflow_steps && data.workflow_steps.length > 0)
            ? data.workflow_steps
            : makeDefaultWorkflowSteps(data.status ?? "Ouvert", id),
        inspections: data.inspections || [],
        assigned_inspector: data.assigned_inspector,
        notes: data.notes,
        priority: data.priority || "Moyenne",
        estimated_completion_date: data.estimated_completion_date,
        actual_completion_date: data.actual_completion_date,
    };
};

export const deleteFollowupFile = async (id: string): Promise<void> => {
    // TODO: Wire to backend DELETE /follow-up-files/{id} when API is ready
    await new Promise((resolve) => setTimeout(resolve, 200));
};
