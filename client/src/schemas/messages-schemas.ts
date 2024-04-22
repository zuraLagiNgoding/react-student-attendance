import { z } from "zod";

export const ApplyAbsenceSchema = z.object({
  message: z.optional(z.string()),
  type: z.string().min(1, ({ message: "Absence type is required."})),
  date: z.object({
    from: z.date(),
    to: z.date()
  }).refine((data) => data.from < data.to, {
    path: ["date"],
    message: "From date must be before to date",
  })
});
