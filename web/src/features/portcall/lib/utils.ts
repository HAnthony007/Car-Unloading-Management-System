import type { PortCall } from "../data/schema";

export const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

export const getPortCallStatus = (portCall: PortCall) => {
    // If API provides explicit status, use it
    const explicit = (portCall as any).status as string | undefined;
    if (explicit) {
        if (explicit === "pending") {
            return {
                key: explicit,
                status: "En attente",
                variant: "secondary" as const,
                color: "text-blue-600",
            };
        }
        if (explicit === "in_progress") {
            return {
                key: explicit,
                status: "En cours",
                variant: "default" as const,
                color: "text-green-600",
            };
        }
        if (explicit === "completed") {
            return {
                key: explicit,
                status: "Terminé",
                variant: "outline" as const,
                color: "text-gray-600",
            };
        }
    }

    // Fallback to compute from dates
    const now = new Date();
    const arrival = new Date(portCall.arrival_date);
    const departure = new Date(portCall.departure_date);

    if (now < arrival)
        return {
            key: "pending",
            status: "En attente",
            variant: "secondary" as const,
            color: "text-blue-600",
        };
    if (now >= arrival && now <= departure)
        return {
            key: "in_progress",
            status: "En cours",
            variant: "default" as const,
            color: "text-green-600",
        };
    return {
        key: "completed",
        status: "Terminé",
        variant: "outline" as const,
        color: "text-gray-600",
    };
};
