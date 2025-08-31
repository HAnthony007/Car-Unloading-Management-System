import { z } from "zod";

export const parkingSchema = z.object({
  id: z.string(),
  name: z.string().optional().or(z.literal("")),
  location: z.string().optional().or(z.literal("")),
  capacity: z.number().int().nonnegative().optional().or(z.literal(0)),
  number: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional().or(z.literal("")),
  updatedAt: z.string().optional().or(z.literal("")),
});

export type Parking = z.infer<typeof parkingSchema>;

export const parkingSchemaList = z.array(parkingSchema);
