import {
    Discharge,
    Vehicle,
    VehicleVinCheckResponse,
} from "@/src/types/domain";
import { create } from "zustand";

const uid = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

interface InspectionData {
    condition: string;
    notes: string;
}

export interface MovementRecord {
    id: string;
    from: string;
    to: string;
    reason: string;
    at: string; // ISO date
    title?: string;
    description?: string;
    coordsFrom?: { lat: number; lng: number };
    coordsTo?: { lat: number; lng: number };
    // Optional parking slot numbers (e.g., for special zones like Mahasarika)
    parkingNumberFrom?: string;
    parkingNumberTo?: string;
}

export interface VehicleIdentification {
    vin?: string; // duplicate for convenience when persisting
    make?: string;
    model?: string;
    year?: string;
    color?: string;
}

export interface VehicleSpecs {
    engine?: string;
    transmission?: string;
    fuel?: string;
    doors?: string;
    seats?: string;
    weight?: string;
}

export interface ArrivalInfo {
    port?: string;
    vessel?: string;
    arrivalDate?: string; // ISO
    agent?: string;
    origin?: string;
}

export interface VehicleMetadata {
    identification: VehicleIdentification;
    specs: VehicleSpecs;
    arrival: ArrivalInfo;
}

export interface DocumentItem {
    id: string;
    name: string;
    type: string;
    uploadedAt: string; // ISO
}

export interface AgentNote {
    id: string;
    title: string;
    content: string;
    createdAt: string; // ISO
}

interface VehicleWorkflowState {
    vin: string | null;
    inspection: InspectionData | null;
    movements: MovementRecord[];
    metadata: VehicleMetadata | null;
    documents: DocumentItem[];
    notes: AgentNote[];
    selectedPortCall: string | null;
    vinCheckResult?: VehicleVinCheckResponse | null;
    vehicle?: Vehicle | null;
    discharge?: Discharge | null;
    setVin: (vin: string | null) => void;
    setInspection: (data: InspectionData) => void;
    addMovement: (mv: Omit<MovementRecord, "id" | "at">) => void;
    setMetadata: (metadata: Partial<VehicleMetadata>) => void;
    addDocument: (doc: Omit<DocumentItem, "id" | "uploadedAt">) => void;
    addNote: (note: Omit<AgentNote, "id" | "createdAt">) => void;
    setSelectedPortCall: (portCall: string | null) => void;
    setVinCheckResult: (res: VehicleVinCheckResponse | null) => void;
    setVehicle: (v: Vehicle | null) => void;
    setDischarge: (d: Discharge | null) => void;
    resetWorkflow: () => void;
}
export const useScannerStore = create<VehicleWorkflowState>((set, get) => ({
    vin: null,
    inspection: null,
    movements: [],
    metadata: null,
    documents: [],
    notes: [],
    selectedPortCall: null,
    vinCheckResult: null,
    vehicle: null,
    discharge: null,
    setVin: (vin) =>
        set({
            vin,
            inspection: vin ? get().inspection : null,
            movements: vin ? get().movements : [],
        }),
    setInspection: (data) => set({ inspection: data }),
    addMovement: (mv) =>
        set(({ movements }) => {
            const now = new Date();
            const autoTitle = mv.title || `${mv.from} → ${mv.to}`;
            const autoDesc = mv.description || mv.reason || "";
            // Generate light random coords near Toamasina Port (lat ~-18.157444, lng ~49.425083)
            const rand = (base: number, spread: number) =>
                base + (Math.random() - 0.5) * spread;
            const coordsFrom = mv.coordsFrom || {
                lat: rand(-18.157444, 0.006),
                lng: rand(49.425083, 0.006),
            };
            const coordsTo = mv.coordsTo || {
                lat: rand(-18.157444, 0.006),
                lng: rand(49.425083, 0.006),
            };
            return {
                movements: [
                    {
                        id: uid(),
                        at: now.toISOString(),
                        title: autoTitle,
                        description: autoDesc,
                        coordsFrom,
                        coordsTo,
                        ...mv,
                    },
                    ...movements,
                ],
            };
        }),
    setMetadata: (metadata) =>
        set(({ metadata: current }) => ({
            metadata: {
                identification: {
                    ...(current?.identification || {}),
                    ...(metadata.identification || {}),
                },
                specs: { ...(current?.specs || {}), ...(metadata.specs || {}) },
                arrival: {
                    ...(current?.arrival || {}),
                    ...(metadata.arrival || {}),
                },
            },
        })),
    addDocument: (doc) =>
        set(({ documents }) => ({
            documents: [
                { id: uid(), uploadedAt: new Date().toISOString(), ...doc },
                ...documents,
            ],
        })),
    addNote: (note) =>
        set(({ notes }) => ({
            notes: [
                { id: uid(), createdAt: new Date().toISOString(), ...note },
                ...notes,
            ],
        })),
    setSelectedPortCall: (portCall) => set({ selectedPortCall: portCall }),
    setVinCheckResult: (res) =>
        set({
            vinCheckResult: res,
            vehicle: res?.vehicle || null,
            discharge: res?.discharge || null,
        }),
    setVehicle: (v) => set({ vehicle: v }),
    setDischarge: (d) => set({ discharge: d }),
    resetWorkflow: () =>
        set({
            vin: null,
            inspection: null,
            movements: [],
            vinCheckResult: null,
        }),
}));
