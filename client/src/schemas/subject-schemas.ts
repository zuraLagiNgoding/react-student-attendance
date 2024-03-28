import { z } from "zod";

export const SubjectSchema = z.object({
  subject_id: z
    .string()
    .min(1, { message: "ID is required!" }),
  subject_name: z
    .string()
    .min(1, { message: "Subject name is required!" })
    .max(50, { message: "Maximum 50 characters" }),
  subject_code: z.string(),
});
