import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.string(),
  vin: z.string().optional().or(z.literal("")),
  make: z.string().optional().or(z.literal("")),
  model: z.string().optional().or(z.literal("")),
  year: z.string().nullable().optional().or(z.literal("")),
  ownerName: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  type: z.string().optional().or(z.literal("")),
  weight: z.string().optional().or(z.literal("")),
  condition: z.string().optional().or(z.literal("")),
  observation: z.string().optional().or(z.literal("")),
  originCountry: z.string().optional().or(z.literal("")),
  shipLocation: z.string().nullable().optional().or(z.literal("")),
  isPrimed: z.boolean().optional().or(z.literal(false)),
  dischargeId: z.number().nullable().optional(),
  createdAt: z.string().optional().or(z.literal("")),
  updatedAt: z.string().optional().or(z.literal("")),
});

export type Vehicle = z.infer<typeof vehicleSchema>;

export const vehicleSchemaList = z.array(vehicleSchema);
