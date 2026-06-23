import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków.")
  .max(128, "Hasło może mieć maksymalnie 128 znaków.");

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Podaj poprawny adres email."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    firstName: z.string().trim().min(2, "Podaj imię.").max(80).optional().or(z.literal("")),
    lastName: z.string().trim().min(2, "Podaj nazwisko.").max(80).optional().or(z.literal("")),
    phone: z.string().trim().max(30, "Numer telefonu jest za długi.").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Podaj poprawny adres email."),
  password: z.string().min(1, "Podaj hasło."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
