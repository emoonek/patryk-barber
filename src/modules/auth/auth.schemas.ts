import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków.")
  .max(128, "Hasło może mieć maksymalnie 128 znaków.");

const nameSchema = z.string().trim().min(2, "To pole musi mieć co najmniej 2 znaki.").max(80);

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Podaj poprawny adres email."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    firstName: nameSchema,
    lastName: nameSchema,
    phone: z.string().trim().max(30, "Numer telefonu jest za długi.").optional().or(z.literal("")),
    termsAccepted: z.literal("on", {
      errorMap: () => ({ message: "Musisz zaakceptować regulamin." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Podaj poprawny adres email."),
  password: z.string().min(1, "Podaj hasło."),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Podaj poprawny adres email."),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(20, "Token resetu jest nieprawidłowy."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
