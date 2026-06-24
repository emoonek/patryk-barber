import { z } from "zod";

const optionalText = (max: number, message: string) =>
  z
    .string()
    .trim()
    .max(max, message)
    .transform((value) => (value.length > 0 ? value : null));

export const adminCustomerSearchSchema = z.object({
  q: z.string().trim().max(100, "Wyszukiwanie moze miec maksymalnie 100 znakow.").default(""),
});

export const adminCustomerIdSchema = z.object({
  clientId: z.string().min(1, "Brakuje identyfikatora klienta."),
});

export const adminUpdateCustomerSchema = adminCustomerIdSchema.extend({
  firstName: optionalText(80, "Imie moze miec maksymalnie 80 znakow."),
  lastName: optionalText(80, "Nazwisko moze miec maksymalnie 80 znakow."),
  phone: optionalText(30, "Telefon moze miec maksymalnie 30 znakow."),
});

export const adminBlockCustomerSchema = adminCustomerIdSchema.extend({
  reason: z.string().trim().max(500, "Powod moze miec maksymalnie 500 znakow.").optional(),
});

export const adminCreateCustomerNoteSchema = adminCustomerIdSchema.extend({
  content: z
    .string()
    .trim()
    .min(2, "Notatka musi miec co najmniej 2 znaki.")
    .max(2000, "Notatka moze miec maksymalnie 2000 znakow."),
});

export const adminDeleteCustomerNoteSchema = adminCustomerIdSchema.extend({
  noteId: z.string().min(1, "Brakuje identyfikatora notatki."),
});

export type AdminCustomerSearch = z.infer<typeof adminCustomerSearchSchema>;
export type AdminUpdateCustomerInput = z.infer<typeof adminUpdateCustomerSchema>;
export type AdminBlockCustomerInput = z.infer<typeof adminBlockCustomerSchema>;
export type AdminCreateCustomerNoteInput = z.infer<typeof adminCreateCustomerNoteSchema>;
export type AdminDeleteCustomerNoteInput = z.infer<typeof adminDeleteCustomerNoteSchema>;
