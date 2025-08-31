import { z } from "zod";

export const vesselSchema = z.object({
  id: z.string(),
  imoNo: z.string().optional().or(z.literal("")),
  name: z.string().optional().or(z.literal("")),
  flag: z.string().optional().or(z.literal("")),
  createdAt: z.string().optional().or(z.literal("")),
  updatedAt: z.string().optional().or(z.literal("")),
});

export type Vessel = z.infer<typeof vesselSchema>;

export const vesselSchemaList = z.array(vesselSchema);
