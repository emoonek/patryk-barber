"use server";

import { redirect } from "next/navigation";
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

export async function registerAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    firstName: formValue(formData, "firstName"),
    lastName: formValue(formData, "lastName"),
    email: formValue(formData, "email"),
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
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Nie udało się utworzyć konta.",
    };
  }

  redirect("/konto");
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await loginUser(parsed.data);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Nie udało się zalogować.",
    };
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
  const parsed = forgotPasswordSchema.safeParse({
    email: formValue(formData, "email"),
  });

  if (!parsed.success) {
    return validationError(parsed.error.flatten().fieldErrors);
  }

  try {
    await requestPasswordReset(parsed.data);
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Nie udalo sie wyslac linku resetu hasla.",
    };
  }

  return {
    ok: true,
    message: "Jesli konto istnieje, wyslalismy link resetu hasla.",
  };
}

export async function resetPasswordAction(
  _state: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
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
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Nie udało się ustawić nowego hasła.",
    };
  }

  return {
    ok: true,
    message: "Hasło zostało zmienione. Możesz się zalogować.",
  };
}
