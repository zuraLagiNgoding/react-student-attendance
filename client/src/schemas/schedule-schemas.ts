import dayjs from "dayjs";
import { z } from "zod";

export const ScheduleSchema = z.object({
  schedule_id: z.string().min(1, { message: "ID is required." }),
  day: z.string().min(1, { message: "Please select the schedule date." }),
  timestamps: z.string().min(1, { message: "Schedule time is required." }).refine((value) => {
    if (!value) return false;
    const [ start, end ] = value.split("-");
    if (!start || !end) return false;
    const startTime = dayjs(dayjs().format("YYYY-MM-DD") + start);
    const endTime = dayjs(dayjs().format("YYYY-MM-DD") + end);
    return endTime.isValid() && endTime.isAfter(startTime);
  }, {message: "End time should be later than start time."}),
  subject_id: z.string().min(1, { message: "Please select schedule subject." }),
  classroom_id: z.string().min(1, { message: "Please select room schedule." }),
  teacher_id: z.string().min(1, { message: "Please select the teacher." }),
  class_id: z.string().min(1, { message: "Please select schedule class." }),
});
