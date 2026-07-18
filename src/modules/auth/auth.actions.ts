"use server";

import { redirect } from "next/navigation";
import { isEmailError } from "@/lib/email";
import { assertRateLimit, RateLimitError, requestRateLimitKey } from "@/lib/security/rate-limit";
import { requireAuth } from "./auth.guards";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.schemas";
import {
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
} from "./auth.service";

export type AuthActionState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function validationError(errors: Record<string, string[] | undefined>): AuthActionState {
  return {
    ok: false,
    message: "Popraw błędy w formularzu.",
    errors: Object.fromEntries(
      Object.entries(errors).filter((entry): entry is [string, string[]] => Boolean(entry[1]?.length)),
    ),
  };
}

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function actionError(error: unknown, fallback: string): AuthActionState {
  if (isEmailError(error)) {
    return {
      ok: false,
      message: fallback,
    };
  }

  return {
    ok: false,
    message: error instanceof RateLimitError || error instanceof Error ? error.message : fallback,
  };
}

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formValue(formData, "email");

  try {
    assertRateLimit({
      key: await requestRateLimitKey("auth:register", email),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
  } catch (error) {
    return actionError(error, "Nie udało się utworzyć konta.");
  }

  const parsed = registerSchema.safeParse({
    firstName: formValue(formData, "firstName"),
    lastName: formValue(formData, "lastName"),
    email,
    password: formValue(formData, "password"),
    confirmPassword: formValue(formData, "confirmPassword"),
    phone: formValue(formData, "phone"),
    termsAccepted: formData.get("termsAccepted"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await registerUser(parsed.data);
  } catch (error) {
    return actionError(error, "Nie udało się utworzyć konta.");
  }

  redirect("/konto");
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = formValue(formData, "email");

  try {
    assertRateLimit({
      key: await requestRateLimitKey("auth:login", email),
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
  } catch (error) {
    return actionError(error, "Nie udało się zalogować.");
  }

  const parsed = loginSchema.safeParse({
    email,
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await loginUser(parsed.data);
  } catch (error) {
    return actionError(error, "Nie udało się zalogować.");
  }

  redirect("/konto");
}

export async function logoutAction() {
  await logoutUser();
  redirect("/logowanie");
}

export async function forgotPasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formValue(formData, "email");

  try {
    assertRateLimit({
      key: await requestRateLimitKey("auth:forgot-password", email),
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });
  } catch (error) {
    return actionError(error, "Nie udało się wysłać linku resetu hasła.");
  }

  const parsed = forgotPasswordSchema.safeParse({
    email,
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await requestPasswordReset(parsed.data);
  } catch (error) {
    return actionError(error, "Nie udało się wysłać linku resetu hasła.");
  }

  return {
    ok: true,
    message: "Jeśli konto istnieje, wysłaliśmy link resetu hasła.",
  };
}

export async function resetPasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  try {
    assertRateLimit({
      key: await requestRateLimitKey("auth:reset-password"),
      limit: 8,
      windowMs: 15 * 60 * 1000,
    });
  } catch (error) {
    return actionError(error, "Nie udało się ustawić nowego hasła.");
  }

  const parsed = resetPasswordSchema.safeParse({
    token: formValue(formData, "token"),
    password: formValue(formData, "password"),
    confirmPassword: formValue(formData, "confirmPassword"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await resetPassword(parsed.data);
  } catch (error) {
    return actionError(error, "Nie udało się ustawić nowego hasła.");
  }

  return {
    ok: true,
    message: "Hasło zostało zmienione. Możesz się zalogować.",
  };
}

export async function resendVerificationEmailAction(): Promise<AuthActionState> {
  const user = await requireAuth();

  try {
    assertRateLimit({
      key: await requestRateLimitKey("auth:resend-verification", user.email),
      limit: 3,
      windowMs: 15 * 60 * 1000,
    });
    await resendVerificationEmail(user.id);
  } catch (error) {
    return actionError(error, "Nie udało się wysłać maila weryfikacyjnego.");
  }

  return {
    ok: true,
    message: user.emailVerifiedAt
      ? "Adres email jest już zweryfikowany."
      : "Wysłaliśmy nowy link weryfikacyjny.",
  };
}
