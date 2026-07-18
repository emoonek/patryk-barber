import { z } from "zod";

export const adminEmailTestSchema = z.object({
  to: z
    .string()
    .trim()
    .email("Podaj poprawny adres email.")
    .optional()
    .or(z.literal("")),
});

export type AdminEmailTestInput = z.infer<typeof adminEmailTestSchema>;
