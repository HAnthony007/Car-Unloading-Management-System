import { PortCall, PortCallStatus } from "../types";

export const formatDate = (
  dateStr: string | null,
  opts: Intl.DateTimeFormatOptions = {}
) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      ...opts,
    });
  } catch (e) {
    return "—";
  }
};

export const getPortCallStatusColor = (status: PortCallStatus) => {
  switch (status) {
    case "pending":
      return "warning"; // amber
    case "in_progress":
      return "info"; // blue
    case "completed":
      return "success"; // green
    case "canceled":
      return "error"; // red
    default:
      return "neutral";
  }
};

export const getPortCallStatusText = (status: PortCallStatus) => {
  switch (status) {
    case "pending":
      return "En attente";
    case "in_progress":
      return "En cours";
    case "completed":
      return "Terminé";
    case "canceled":
      return "Annulé";
    default:
      return "Inconnu";
  }
};

export const computeStats = (portCalls: PortCall[]) => ({
  total: portCalls.length,
  pending: portCalls.filter(p => p.status === 'pending').length,
  in_progress: portCalls.filter(p => p.status === 'in_progress').length,
  completed: portCalls.filter(p => p.status === 'completed').length,
});
