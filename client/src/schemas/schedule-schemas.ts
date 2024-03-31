import { z } from "zod";

export const ScheduleSchema = z.object({
  schedule_id: z.string().min(1, { message: "ID is required." }),
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
  timestamps: z.string().min(1, { message: "Schedule time is required." }),
  subject_id: z.string().min(1, { message: "Please select schedule subject." }),
  teacher_id: z.string().min(1, { message: "Please select the teacher." }),
  class_id: z.string().min(1, { message: "Please select schedule class." }),
});
