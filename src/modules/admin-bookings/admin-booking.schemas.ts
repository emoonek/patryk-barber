import { BookingStatus } from "@prisma/client";
import { z } from "zod";
import { bookingDateSchema, bookingTimeSchema, createBookingSchema } from "@/modules/booking/booking.schemas";

export const bookingStatusFilterSchema = z
  .enum(["all", BookingStatus.confirmed, BookingStatus.cancelled_by_client, BookingStatus.cancelled_by_admin, BookingStatus.completed, BookingStatus.no_show])
  .default("all");

export const adminBookingFiltersSchema = z.object({
  date: z.union([bookingDateSchema, z.literal("")]).default(""),
  status: bookingStatusFilterSchema,
});

export const adminBookingIdSchema = z.object({
  bookingId: z.string().min(1, "Brakuje identyfikatora rezerwacji."),
});

export const adminUpdateBookingSchema = createBookingSchema.extend({
  bookingId: z.string().min(1, "Brakuje identyfikatora rezerwacji."),
});

export const adminCreateBookingSchema = createBookingSchema.extend({
  customerId: z.string().min(1, "Wybierz klienta."),
});

export const adminCancelBookingSchema = adminBookingIdSchema.extend({
  cancelReason: z.string().max(500, "Powod moze miec maksymalnie 500 znakow.").optional(),
});

export const adminStatusChangeSchema = adminBookingIdSchema.extend({
  status: z.enum([BookingStatus.completed, BookingStatus.no_show]),
});

export const availabilityExceptionIdSchema = z.object({
  exceptionId: z.string().min(1, "Brakuje identyfikatora blokady."),
});

export const blockFullDaySchema = z.object({
  date: bookingDateSchema,
  reason: z.string().max(500, "Powod moze miec maksymalnie 500 znakow.").optional(),
});

export const blockSlotSchema = z.object({
  date: bookingDateSchema,
  time: bookingTimeSchema,
  serviceId: z.string().min(1, "Wybierz usluge."),
  reason: z.string().max(500, "Powod moze miec maksymalnie 500 znakow.").optional(),
});

export type AdminBookingFilters = z.infer<typeof adminBookingFiltersSchema>;
export type AdminUpdateBookingInput = z.infer<typeof adminUpdateBookingSchema>;
export type AdminCreateBookingInput = z.infer<typeof adminCreateBookingSchema>;
export type AdminCancelBookingInput = z.infer<typeof adminCancelBookingSchema>;
export type AdminStatusChangeInput = z.infer<typeof adminStatusChangeSchema>;
export type BlockFullDayInput = z.infer<typeof blockFullDaySchema>;
export type BlockSlotInput = z.infer<typeof blockSlotSchema>;
