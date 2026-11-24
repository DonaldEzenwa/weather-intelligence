import { z } from "zod";
const coordinate = z.number().finite();
export const locationSchema = z.object({
  query: z.string().trim().min(2, "Enter at least two characters."),
  latitude: coordinate.min(-90).max(90).optional(),
  longitude: coordinate.min(-180).max(180).optional(),
});
export const savedSearchFields = z.object({
  locationName: z.string().trim().min(2),
  latitude: coordinate.min(-90).max(90),
  longitude: coordinate.min(-180).max(180),
  country: z.string().trim().max(80).optional(),
  weatherCondition: z.string().trim().min(1),
  temperature: z.number().finite(),
  humidity: z.number().int().min(0).max(100),
  windSpeed: z.number().finite().min(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  notes: z.string().trim().max(500).optional(),
});
export const savedSearchSchema = savedSearchFields.superRefine((value, ctx) => {
  if (value.endDate < value.startDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["endDate"], message: "End date must be on or after the start date." });
});
export type LocationForm = z.infer<typeof locationSchema>;
