import type { PortCall } from "../data/schema";

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const getPortCallStatus = (portCall: PortCall) => {
  const now = new Date();
  const arrival = new Date(portCall.arrival_date);
  const departure = new Date(portCall.departure_date);

  if (now < arrival)
    return {
      status: "En attente",
      variant: "secondary" as const,
      color: "text-blue-600",
    };
  if (now >= arrival && now <= departure)
    return {
      status: "En cours",
      variant: "default" as const,
      color: "text-green-600",
    };
  return {
    status: "Terminé",
    variant: "outline" as const,
    color: "text-gray-600",
  };
};
