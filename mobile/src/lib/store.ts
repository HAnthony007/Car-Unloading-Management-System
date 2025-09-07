import { create } from 'zustand';

// Simple unique id helper: time component + random segment
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;

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

interface InspectionData {
  condition: string;
  notes: string;
}

interface VehicleWorkflowState {
  vin: string | null;
  inspection: InspectionData | null;
  movements: MovementRecord[];
  metadata: VehicleMetadata | null;
  documents: DocumentItem[];
  notes: AgentNote[];
  setVin: (vin: string | null) => void;
  setInspection: (data: InspectionData) => void;
  addMovement: (mv: Omit<MovementRecord, 'id' | 'at'>) => void;
  setMetadata: (metadata: Partial<VehicleMetadata>) => void;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadedAt'>) => void;
  addNote: (note: Omit<AgentNote, 'id' | 'createdAt'>) => void;
  resetWorkflow: () => void;
}

export const useScannerStore = create<VehicleWorkflowState>((set, get) => ({
  vin: null,
  inspection: null,
  movements: [],
  metadata: null,
  documents: [],
  notes: [],
  setVin: (vin) => set({ vin, inspection: vin ? get().inspection : null, movements: vin ? get().movements : [] }),
  setInspection: (data) => set({ inspection: data }),
  addMovement: (mv) => set(({ movements }) => {
    const now = new Date();
    const autoTitle = mv.title || `${mv.from} → ${mv.to}`;
    const autoDesc = mv.description || mv.reason || '';
    // Generate light random coords near Dakar port if not provided (lat ~14.7167, lng ~-17.4677)
    const rand = (base: number, spread: number) => base + (Math.random() - 0.5) * spread;
    const coordsFrom = mv.coordsFrom || { lat: rand(14.7167, 0.02), lng: rand(-17.4677, 0.02) };
    const coordsTo = mv.coordsTo || { lat: rand(14.7167, 0.02), lng: rand(-17.4677, 0.02) };
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
  setMetadata: (metadata) => set(({ metadata: current }) => ({
    metadata: {
      identification: { ...(current?.identification || {}), ...(metadata.identification || {}) },
      specs: { ...(current?.specs || {}), ...(metadata.specs || {}) },
      arrival: { ...(current?.arrival || {}), ...(metadata.arrival || {}) },
    },
  })),
  addDocument: (doc) => set(({ documents }) => ({
    documents: [
      { id: uid(), uploadedAt: new Date().toISOString(), ...doc },
      ...documents,
    ],
  })),
  addNote: (note) => set(({ notes }) => ({
    notes: [
      { id: uid(), createdAt: new Date().toISOString(), ...note },
      ...notes,
    ],
  })),
  resetWorkflow: () => set({ vin: null, inspection: null, movements: [] }),
}));
