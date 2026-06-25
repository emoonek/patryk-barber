import { z } from "zod";

const pricePlnSchema = z
  .string()
  .trim()
  .min(1, "Podaj cene uslugi.")
  .refine((value) => /^\d+([,.]\d{1,2})?$/.test(value), "Cena musi byc poprawna kwota w PLN.")
  .transform((value) => {
    const [zloty, grosze = ""] = value.replace(",", ".").split(".");
    return Number(zloty) * 100 + Number(grosze.padEnd(2, "0"));
  })
  .refine((value) => value >= 0, "Cena musi byc wieksza lub rowna 0.");

const checkboxBoolean = z.preprocess((value) => value === "on" || value === "true", z.boolean());

export const adminServiceIdSchema = z.object({
  serviceId: z.string().min(1, "Brakuje identyfikatora uslugi."),
});

export const adminServiceFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Nazwa jest wymagana.")
    .max(120, "Nazwa moze miec maksymalnie 120 znakow."),
  priceCents: pricePlnSchema,
  durationMinutes: z.coerce
    .number({ invalid_type_error: "Czas trwania musi byc liczba." })
    .int("Czas trwania musi byc liczba calkowita.")
    .min(15, "Czas trwania musi wynosic minimum 15 minut."),
  isActive: checkboxBoolean,
  sortOrder: z.coerce
    .number({ invalid_type_error: "Kolejnosc sortowania musi byc liczba." })
    .int("Kolejnosc sortowania musi byc liczba calkowita."),
});

export const adminCreateServiceSchema = adminServiceFormSchema;

export const adminUpdateServiceSchema = adminServiceIdSchema.extend(adminServiceFormSchema.shape);

export type AdminCreateServiceInput = z.infer<typeof adminCreateServiceSchema>;
export type AdminUpdateServiceInput = z.infer<typeof adminUpdateServiceSchema>;
