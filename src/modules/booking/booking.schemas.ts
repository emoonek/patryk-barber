import { z } from "zod";

export const bookingDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Podaj datę w poprawnym formacie.");

export const bookingTimeSchema = z.enum(["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]);

export const createBookingSchema = z.object({
  serviceId: z.string().min(1, "Wybierz usługę."),
  date: bookingDateSchema,
  time: bookingTimeSchema,
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1, "Brakuje identyfikatora rezerwacji."),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
