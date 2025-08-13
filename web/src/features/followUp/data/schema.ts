export interface FollowupFile {
    id: string;
    reference_number: string;
    status: "Ouvert" | "En attente" | "Fermé";
    vehicle_id: string;
    port_call_id: string;
    created_at: string;
    updated_at: string;
    vehicle_info?: {
        plate_number: string;
        brand: string;
        model: string;
        year: number;
    };
    documents: Document[];
    photos: Photo[];
    workflow_steps: WorkflowStep[];
    inspections: Inspection[];
    assigned_inspector?: string;
    notes?: string;
    priority: "Faible" | "Moyenne" | "Élevée" | "Urgente";
    estimated_completion_date?: string;
    actual_completion_date?: string;
}

export interface Document {
    id: string;
    name: string;
    type:
        | "Connaissement"
        | "Bon de sortie"
        | "Fiche de contrôle"
        | "Certificat"
        | "Autre";
    file_url: string;
    uploaded_at: string;
    uploaded_by: string;
    status: "En attente" | "Approuvé" | "Rejeté";
}

export interface Photo {
    id: string;
    description: string;
    file_url: string;
    taken_at: string;
    taken_by: string;
    category:
        | "État du véhicule"
        | "Anomalie"
        | "Inspection"
        | "Documentation"
        | "Autre";
}

export interface WorkflowStep {
    id: string;
    name: string;
    description: string;
    status: "En attente" | "En cours" | "Terminé" | "Bloqué";
    assigned_to?: string;
    started_at?: string;
    completed_at?: string;
    order: number;
    is_required: boolean;
}

export interface Inspection {
    id: string;
    type:
        | "SURVEY"
        | "Contrôle qualité"
        | "Vérification documentaire"
        | "Inspection technique";
    status: "Planifiée" | "En cours" | "Terminée" | "Annulée";
    inspector: string;
    scheduled_at: string;
    started_at?: string;
    completed_at?: string;
    results?: string;
    findings?: string[];
    recommendations?: string[];
}

export interface FollowupFileFormData {
    reference_number: string;
    vehicle_id: string;
    port_call_id: string;
    priority: FollowupFile["priority"];
    assigned_inspector?: string;
    notes?: string;
    estimated_completion_date?: string;
}
