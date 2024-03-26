import { z } from "zod";

export const MajorSchema = z.object({
  major_id: z
    .string()
    .min(1, { message: "ID is required!" }),
  major_name: z
    .string()
    .min(1, { message: "Major name is required!" })
    .max(50, { message: "Maximum 50 characters" }),
  shorten: z.string(),
});
