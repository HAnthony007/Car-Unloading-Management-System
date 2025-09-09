import { CustomsStatus, InspectionStatus, VehicleStatus } from "../types";

// Badge variant union reused from ui/Badge (warning, info, success, error, neutral)
export type BadgeVariant = "warning" | "info" | "success" | "error" | "neutral";

export const getStatusColor = (status: VehicleStatus): BadgeVariant => {
    switch (status) {
        case "pending":
            return "neutral";
        case "unloaded":
            return "info";
        case "under_inspection":
            return "warning";
        case "inspected":
            return "success";
        case "parked":
            return "info";
        case "completed":
            return "success";
        case "quarantined":
            return "error";
        case "rejected":
            return "error";
        case "arrived":
            return "warning";
        case "stored":
            return "success";
        case "delivered":
            return "neutral";
        case "in_transit":
            return "info";
        default:
            return "neutral";
    }
};

export const getStatusText = (status: VehicleStatus): string => {
    switch (status) {
        case "pending":
            return "En attente";
        case "unloaded":
            return "Débarqué";
        case "under_inspection":
            return "Inspection";
        case "inspected":
            return "Inspecté";
        case "parked":
            return "Parqué";
        case "completed":
            return "Terminé";
        case "quarantined":
            return "Quarantaine";
        case "rejected":
            return "Rejeté";
        case "arrived":
            return "Arrivé";
        case "stored":
            return "Stocké";
        case "delivered":
            return "Livré";
        case "in_transit":
            return "En transit";
        default:
            return "Inconnu";
    }
};

export const getCustomsStatusColor = (status: CustomsStatus): BadgeVariant => {
    switch (status) {
        case "pending":
            return "warning";
        case "cleared":
            return "success";
        case "hold":
            return "error";
        default:
            return "neutral";
    }
};

export const getCustomsStatusText = (status: CustomsStatus): string => {
    switch (status) {
        case "pending":
            return "En attente";
        case "cleared":
            return "Dédouané";
        case "hold":
            return "Bloqué";
        default:
            return "Inconnu";
    }
};

// Helpers pour statut d'inspection
export const getInspectionStatusColor = (
    status: InspectionStatus
): BadgeVariant => {
    switch (status) {
        case "in_progress":
            return "warning";
        case "pending_review":
            return "info";
        case "conforme":
        case "approved":
            return "success";
        case "non_conforme":
            return "error";
        case "critical":
            return "error";
        case "rejected":
            return "error";
        default:
            return "neutral";
    }
};

export const getInspectionStatusText = (status: InspectionStatus): string => {
    switch (status) {
        case "in_progress":
            return "En cours";
        case "pending_review":
            return "À valider";
        case "conforme":
            return "Conforme";
        case "approved":
            return "Approuvé";
        case "non_conforme":
            return "Non conforme";
        case "critical":
            return "Critique";
        case "rejected":
            return "Rejeté";
        default:
            return "N/A";
    }
};
