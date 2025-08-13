import { z } from "zod";

const vehicleStatusSchema = z.union([
    z.literal("available"),
    z.literal("in_use"),
    z.literal("maintenance"),
    z.literal("out_of_service"),
]);

const vehicleTypeSchema = z.union([
    z.literal("truck"),
    z.literal("trailer"),
    z.literal("van"),
    z.literal("car"),
]);

const vehicleSchema = z.object({
    id: z.string(),
    plateNumber: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    type: vehicleTypeSchema,
    status: vehicleStatusSchema,
    capacity: z.number().optional(),
    driver: z.string().optional(),
    lastMaintenance: z.string().optional(),
    notes: z.string().optional(),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const vehicleSchemaList = z.array(vehicleSchema);

export const vehicleStatuses = [
    { value: "available", label: "Disponible", icon: "check" },
    { value: "in_use", label: "En cours d'utilisation", icon: "clock" },
    { value: "maintenance", label: "En maintenance", icon: "wrench" },
    { value: "out_of_service", label: "Hors service", icon: "x" },
] as const;

export const vehicleTypes = [
    { value: "truck", label: "Camion", icon: "truck" },
    { value: "trailer", label: "Remorque", icon: "trailer" },
    { value: "van", label: "Fourgon", icon: "van" },
    { value: "car", label: "Voiture", icon: "car" },
] as const;
