"use server";

import { EmailConfigurationError, EmailDeliveryError, sendTestEmail } from "@/lib/email";
import { requireAdmin } from "@/modules/auth/auth.guards";
import { adminEmailTestSchema } from "./admin-email.schemas";

export type AdminEmailTestState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function adminEmailFallback() {
  return process.env.ADMIN_EMAIL?.trim();
}

export async function adminSendTestEmailAction(
  _state: AdminEmailTestState,
  formData: FormData,
): Promise<AdminEmailTestState> {
  await requireAdmin();

  const parsed = adminEmailTestSchema.safeParse({
    to: formValue(formData, "to"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Popraw błędy w formularzu.",
      errors: Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).filter(
          (entry): entry is [string, string[]] => Boolean(entry[1]?.length),
        ),
      ),
    };
  }

  const to = parsed.data.to?.trim() || adminEmailFallback();

  if (!to) {
    return {
      ok: false,
      message: "Błąd konfiguracji: brakuje ADMIN_EMAIL albo adresu odbiorcy.",
    };
  }

  try {
    await sendTestEmail({ to });
  } catch (error) {
    if (error instanceof EmailConfigurationError) {
      return {
        ok: false,
        message: `Błąd konfiguracji: ${error.message}`,
      };
    }

    if (error instanceof EmailDeliveryError) {
      return {
        ok: false,
        message: "Błąd providera: nie udało się wysłać testowego maila.",
      };
    }

    return {
      ok: false,
      message: "Błąd providera: nie udało się wysłać testowego maila.",
    };
  }

  return {
    ok: true,
    message: `Wysłano testowego maila na ${to}.`,
  };
}
